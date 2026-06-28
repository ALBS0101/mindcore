/**
 * MindCode — Cloud Functions (PIX + Cartão · Mercado Pago)
 *
 *  createPixPayment  — cria cobrança PIX, grava payments/{id}, devolve QR.
 *  createCardPayment — cria pagamento com cartão (token gerado no cliente via MP.js).
 *  mpWebhook         — recebe notificação do MP, revalida e atualiza status.
 *  getReport         — entrega o relatório COMPLETO só se o pagamento está aprovado.
 *
 * Usa o SDK oficial do Mercado Pago (recurso server-side). Cada pagamento leva:
 *  - external_reference: ID interno único (correlaciona com o payment_id do MP).
 *  - additional_info.items (com description): melhora a aprovação/antifraude.
 */

import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { MercadoPagoConfig, Payment } from "mercadopago";
import crypto from "node:crypto";
import { profiles } from "./profiles.js";

initializeApp();
const db = getFirestore();
setGlobalOptions({ region: "southamerica-east1", maxInstances: 10 });

const price = () => Number(process.env.MINDCODE_PRICE || "19.90");
const token = () => process.env.MP_ACCESS_TOKEN || "";

/* Cliente de pagamentos do SDK (token só existe no servidor, em runtime). */
function paymentApi() {
  return new Payment(new MercadoPagoConfig({ accessToken: token(), options: { timeout: 8000 } }));
}

/* Bloco additional_info.items (recomendado pelo MP para aprovação). */
function itemsInfo(profileKey, nome) {
  return {
    items: [
      {
        id: profileKey,
        title: "MindCode - Relatorio de Perfil",
        description: `Relatorio completo de autoconhecimento do perfil ${profileKey} (MindCode)`,
        category_id: "services",
        quantity: 1,
        unit_price: price(),
      },
    ],
    payer: nome ? { first_name: String(nome).slice(0, 60) } : undefined,
  };
}

/* Grava/atualiza o doc do pagamento a partir da resposta do MP. */
async function salvarPagamento(mp, extra = {}) {
  const id = String(mp.id);
  await db.collection("payments").doc(id).set(
    {
      mpPaymentId: id,
      status: mp.status || "pending",
      statusDetail: mp.status_detail || null,
      method: mp.payment_type_id || null,
      amount: mp.transaction_amount || price(),
      externalReference: mp.external_reference || null,
      updatedAt: FieldValue.serverTimestamp(),
      ...extra,
    },
    { merge: true }
  );
  return id;
}

/* Extrai uma mensagem útil de um erro do SDK do MP (para log). */
function mpErr(e) {
  return {
    message: e && e.message,
    status: e && (e.status || e.statusCode),
    cause: (e && (e.cause || (e.error && e.error.causes))) || null,
  };
}

/* ─── PIX ───────────────────────────────────────────────────────────── */
export const createPixPayment = onCall({ secrets: ["MP_ACCESS_TOKEN"] }, async (request) => {
  const { profileKey, nome, email } = request.data || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new HttpsError("invalid-argument", "E-mail inválido.");
  }
  if (!profiles[profileKey]) throw new HttpsError("invalid-argument", "Perfil inválido.");
  if (!token()) throw new HttpsError("failed-precondition", "Pagamento não configurado.");

  const externalRef = `mindcode_${crypto.randomUUID()}`;
  let mp;
  try {
    mp = await paymentApi().create({
      body: {
        transaction_amount: price(),
        description: `MindCode - Relatorio ${profileKey}`,
        payment_method_id: "pix",
        external_reference: externalRef,
        payer: { email: String(email).slice(0, 120), first_name: String(nome || "Cliente").slice(0, 40) },
        additional_info: itemsInfo(profileKey, nome),
      },
      requestOptions: { idempotencyKey: crypto.randomUUID() },
    });
  } catch (e) {
    logger.error("MP PIX erro", mpErr(e));
    throw new HttpsError("internal", "Falha ao criar a cobrança PIX.");
  }

  const tx = (mp.point_of_interaction && mp.point_of_interaction.transaction_data) || {};
  const id = await salvarPagamento(mp, {
    profileKey, nome: nome || null, email, externalReference: externalRef,
    createdAt: FieldValue.serverTimestamp(),
  });
  return {
    paymentId: id,
    qrCode: tx.qr_code || null,
    qrCodeBase64: tx.qr_code_base64 || null,
    ticketUrl: tx.ticket_url || null,
    status: mp.status || "pending",
  };
});

/* ─── CARTÃO ────────────────────────────────────────────────────────── */
export const createCardPayment = onCall({ secrets: ["MP_ACCESS_TOKEN"] }, async (request) => {
  const { profileKey, nome, email, token: cardToken, paymentMethodId, installments, identification } = request.data || {};
  if (!cardToken || !paymentMethodId) throw new HttpsError("invalid-argument", "Dados do cartão ausentes.");
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new HttpsError("invalid-argument", "E-mail inválido.");
  if (!profiles[profileKey]) throw new HttpsError("invalid-argument", "Perfil inválido.");
  if (!token()) throw new HttpsError("failed-precondition", "Pagamento não configurado.");

  const payer = { email: String(email).slice(0, 120) };
  if (identification && identification.type && identification.number) {
    payer.identification = { type: identification.type, number: String(identification.number) };
  }

  const externalRef = `mindcode_${crypto.randomUUID()}`;
  let mp;
  try {
    mp = await paymentApi().create({
      body: {
        transaction_amount: price(),
        description: `MindCode - Relatorio ${profileKey}`,
        token: cardToken,
        installments: Number(installments) || 1,
        payment_method_id: paymentMethodId,
        external_reference: externalRef,
        payer,
        additional_info: itemsInfo(profileKey, nome),
      },
      requestOptions: { idempotencyKey: crypto.randomUUID() },
    });
  } catch (e) {
    logger.error("MP cartão erro", mpErr(e));
    throw new HttpsError("internal", "Pagamento com cartão recusado.");
  }

  const id = await salvarPagamento(mp, {
    profileKey, nome: nome || null, email, externalReference: externalRef,
    createdAt: FieldValue.serverTimestamp(),
  });
  return { paymentId: id, status: mp.status, statusDetail: mp.status_detail || null };
});

/* ─── Webhook ───────────────────────────────────────────────────────── */
// Para validar a assinatura (opcional): crie o secret MP_WEBHOOK_SECRET e
// adicione-o ao array `secrets` abaixo, depois redeploy.
export const mpWebhook = onRequest({ secrets: ["MP_ACCESS_TOKEN"] }, async (req, res) => {
  try {
    const secret = process.env.MP_WEBHOOK_SECRET;
    if (secret && !assinaturaValida(req, secret)) {
      logger.warn("Webhook x-signature inválida.");
      res.status(401).send("invalid signature");
      return;
    }
    const type = req.query.type || (req.body && req.body.type) || req.query.topic;
    const mpId = req.query["data.id"] || (req.body && req.body.data && req.body.data.id) || req.query.id;
    if (type !== "payment" || !mpId) { res.status(200).send("ignored"); return; }
    if (!token()) { res.status(200).send("not-configured"); return; }

    let pay;
    try {
      pay = await paymentApi().get({ id: mpId });
    } catch (e) {
      logger.error("MP get erro", mpErr(e));
      res.status(200).send("error"); // 200 evita reenvio infinito do MP
      return;
    }

    await salvarPagamento(pay);
    res.status(200).send("ok");
  } catch (e) {
    logger.error("Webhook exceção", e && e.message);
    res.status(200).send("error");
  }
});

/* ─── Entrega do relatório (gated em pagamento aprovado) ────────────── */
export const getReport = onCall(async (request) => {
  const { paymentId, profileKey } = request.data || {};
  const profile = profiles[profileKey];
  if (!profile) throw new HttpsError("invalid-argument", "Perfil inválido.");
  if (!paymentId) throw new HttpsError("permission-denied", "Pagamento não encontrado.");

  const snap = await db.collection("payments").doc(String(paymentId)).get();
  if (!snap.exists) throw new HttpsError("permission-denied", "Pagamento não encontrado.");
  const pay = snap.data();
  if (pay.status !== "approved") throw new HttpsError("permission-denied", "Pagamento não aprovado.");
  if (pay.profileKey && pay.profileKey !== profileKey) {
    throw new HttpsError("permission-denied", "Pagamento não corresponde a este perfil.");
  }
  return profile;
});

/* Valida HMAC do header x-signature do Mercado Pago. */
function assinaturaValida(req, secret) {
  try {
    const sig = req.headers["x-signature"];
    const reqId = req.headers["x-request-id"];
    const dataId = req.query["data.id"] || (req.body && req.body.data && req.body.data.id);
    if (!sig || !dataId) return false;
    const parts = Object.fromEntries(String(sig).split(",").map((p) => p.split("=").map((s) => s.trim())));
    if (!parts.ts || !parts.v1) return false;
    const manifest = `id:${dataId};request-id:${reqId};ts:${parts.ts};`;
    const hmac = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}
