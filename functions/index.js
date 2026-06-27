/**
 * MindCode — Cloud Functions (PIX + Cartão · Mercado Pago Checkout Transparente)
 *
 *  createPixPayment  — cria cobrança PIX, grava payments/{id}, devolve QR.
 *  createCardPayment — cria pagamento com cartão (token gerado no cliente via MP.js).
 *  mpWebhook         — recebe notificação do MP, revalida na API e atualiza status.
 *  getReport         — entrega o relatório COMPLETO só se o pagamento está aprovado.
 *
 * Segurança: token do MP só no servidor; cliente nunca escreve status (Rules);
 * o conteúdo pago não vai no bundle — é servido aqui após `approved`.
 */

import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import crypto from "node:crypto";
import { profiles } from "./profiles.js";

initializeApp();
const db = getFirestore();
setGlobalOptions({ region: "southamerica-east1", maxInstances: 10 });

const MP_API = "https://api.mercadopago.com";
const price = () => Number(process.env.MINDCODE_PRICE || "19.90");
const token = () => process.env.MP_ACCESS_TOKEN || "";

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
      updatedAt: FieldValue.serverTimestamp(),
      ...extra,
    },
    { merge: true }
  );
  return id;
}

/* ─── PIX ───────────────────────────────────────────────────────────── */
export const createPixPayment = onCall({ secrets: ["MP_ACCESS_TOKEN"] }, async (request) => {
  const { profileKey, nome, email } = request.data || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new HttpsError("invalid-argument", "E-mail inválido.");
  }
  if (!profiles[profileKey]) throw new HttpsError("invalid-argument", "Perfil inválido.");
  if (!token()) throw new HttpsError("failed-precondition", "Pagamento não configurado.");

  let mp;
  try {
    const resp = await fetch(`${MP_API}/v1/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token()}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        transaction_amount: price(),
        description: `MindCode - Relatorio ${profileKey}`,
        payment_method_id: "pix",
        payer: { email: String(email).slice(0, 120), first_name: String(nome || "Cliente").slice(0, 40) },
      }),
    });
    mp = await resp.json();
    if (!resp.ok) { logger.error("MP PIX erro", mp); throw new HttpsError("internal", "Falha ao criar a cobrança PIX."); }
  } catch (e) {
    if (e instanceof HttpsError) throw e;
    logger.error("MP PIX exceção", e);
    throw new HttpsError("internal", "Falha ao contatar o Mercado Pago.");
  }

  const tx = (mp.point_of_interaction && mp.point_of_interaction.transaction_data) || {};
  const id = await salvarPagamento(mp, {
    profileKey, nome: nome || null, email, createdAt: FieldValue.serverTimestamp(),
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

  let mp;
  try {
    const resp = await fetch(`${MP_API}/v1/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token()}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        transaction_amount: price(),
        description: `MindCode - Relatorio ${profileKey}`,
        token: cardToken,
        installments: Number(installments) || 1,
        payment_method_id: paymentMethodId,
        payer,
      }),
    });
    mp = await resp.json();
    if (!resp.ok) { logger.error("MP cartão erro", mp); throw new HttpsError("internal", "Pagamento com cartão recusado."); }
  } catch (e) {
    if (e instanceof HttpsError) throw e;
    logger.error("MP cartão exceção", e);
    throw new HttpsError("internal", "Falha ao contatar o Mercado Pago.");
  }

  const id = await salvarPagamento(mp, {
    profileKey, nome: nome || null, email, createdAt: FieldValue.serverTimestamp(),
  });
  return { paymentId: id, status: mp.status, statusDetail: mp.status_detail || null };
});

/* ─── Webhook ───────────────────────────────────────────────────────── */
export const mpWebhook = onRequest({ secrets: ["MP_ACCESS_TOKEN", "MP_WEBHOOK_SECRET"] }, async (req, res) => {
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

    const r = await fetch(`${MP_API}/v1/payments/${mpId}`, { headers: { Authorization: `Bearer ${token()}` } });
    const pay = await r.json();
    if (!r.ok) { logger.error("MP get erro", pay); res.status(200).send("error"); return; }

    await salvarPagamento(pay);
    res.status(200).send("ok");
  } catch (e) {
    logger.error("Webhook exceção", e);
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
  return profile; // conteúdo completo
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
