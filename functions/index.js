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

// Nome que aparece na fatura do cartão do comprador (máx. 22 caracteres).
// Reduz contestações/chargebacks: o cliente reconhece a cobrança. (rec. MP)
const STATEMENT_DESCRIPTOR = "MINDCODE";

// Remetente do e-mail de acesso. Enquanto o domínio próprio não está verificado
// no Resend, usa o domínio de teste (onboarding@resend.dev). Depois de verificar
// um domínio (ex.: mindcode.app), troque para algo como "MindCode <acesso@mindcode.app>".
const EMAIL_FROM = process.env.RESEND_FROM || "MindCode <onboarding@resend.dev>";
const SITE_URL = "https://mindcode.web.app";

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

/* Grava/atualiza o doc do pagamento.
   PII (email/nome) vai para a coleção privada `payment_private` (não-legível
   pelo cliente). `payments/{id}` fica só com dados não-sensíveis (status, perfil,
   valor) — é o que o cliente precisa para liberar o relatório. */
async function salvarPagamento(mp, extra = {}) {
  const id = String(mp.id);
  const { email, nome, ...pub } = extra;
  await db.collection("payments").doc(id).set(
    {
      mpPaymentId: id,
      status: mp.status || "pending",
      statusDetail: mp.status_detail || null,
      method: mp.payment_type_id || null,
      amount: mp.transaction_amount || price(),
      externalReference: mp.external_reference || null,
      updatedAt: FieldValue.serverTimestamp(),
      ...pub,
    },
    { merge: true }
  );
  if (email || nome) {
    await db.collection("payment_private").doc(id).set(
      { email: email || null, nome: nome || null, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
  }
  return id;
}

/* Envia o e-mail com o LINK DE ACESSO ao relatório (via Resend), uma única vez.
   No-op silencioso se RESEND_API_KEY não estiver configurado — não quebra o fluxo
   de pagamento. Idempotente: grava emailSent no doc para não reenviar. */
async function enviarEmailAcesso(pay) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return; // e-mail ainda não configurado → segue sem enviar
  const email = pay && pay.payer && pay.payer.email;
  const mpId = pay && String(pay.id);
  if (!email || !mpId) return;

  const ref = db.collection("payments").doc(mpId);
  const snap = await ref.get();
  const data = snap.exists ? snap.data() : {};
  if (data.emailSent) return; // já enviado

  const profileKey =
    data.profileKey ||
    (pay.additional_info && pay.additional_info.items && pay.additional_info.items[0] && pay.additional_info.items[0].id) ||
    "";
  const link = `${SITE_URL}/?acesso=${encodeURIComponent(mpId)}${profileKey ? `&perfil=${encodeURIComponent(profileKey)}` : ""}`;

  const html = `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#334155">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:36px 32px">
      <div style="font-size:12px;letter-spacing:2px;color:#6366f1;font-weight:700">MINDCODE</div>
      <h1 style="font-size:22px;color:#0f172a;margin:14px 0 10px">Seu relatório está pronto ✅</h1>
      <p style="font-size:15px;line-height:1.7;margin:0 0 22px">Recebemos seu pagamento e liberamos o seu relatório completo de autoconhecimento. Toque no botão abaixo para acessá-lo quando quiser, em qualquer aparelho.</p>
      <a href="${link}" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px">Acessar meu relatório</a>
      <p style="font-size:12px;color:#94a3b8;line-height:1.7;margin:24px 0 0">Ou copie este link:<br><span style="color:#6366f1;word-break:break-all">${link}</span></p>
      <p style="font-size:12px;color:#94a3b8;line-height:1.7;margin:20px 0 0;border-top:1px solid #e2e8f0;padding-top:16px">Guarde este e-mail — ele é o seu acesso permanente ao relatório. MindCode · autoconhecimento.</p>
    </div>
  </div></body></html>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [email],
        subject: "Seu relatório MindCode está pronto ✅",
        html,
      }),
    });
    if (r.ok) {
      await ref.set({ emailSent: true, emailAt: FieldValue.serverTimestamp() }, { merge: true });
    } else {
      const body = await r.text();
      logger.error("Resend erro", { status: r.status, body: String(body).slice(0, 300) });
    }
  } catch (e) {
    logger.error("Resend exceção", e && e.message);
  }
}

/* Envia a conversão de COMPRA ao GA4 pelo Measurement Protocol (server-side),
   uma única vez. Garante que TODA venda seja contada — inclusive PIX pago com a
   aba fechada, quando o evento do navegador não dispara. Usa o client_id do GA4
   capturado no cliente para atribuir a conversão à sessão/anúncio do usuário.
   No-op silencioso se GA_MP_API_SECRET não estiver configurado. */
async function enviarConversaoGA4(pay) {
  const secret = process.env.GA_MP_API_SECRET;
  if (!secret) return;
  const mid = process.env.GA_MEASUREMENT_ID || "G-W13HKCQ510";
  const id = pay && String(pay.id);
  if (!id) return;

  const ref = db.collection("payments").doc(id);
  const snap = await ref.get();
  const data = snap.exists ? snap.data() : {};
  if (data.gaConversionSent) return; // já enviado

  const clientId = data.gaClientId || `${Math.floor(Math.random() * 1e10)}.${Math.floor(Date.now() / 1000)}`;
  const body = {
    client_id: String(clientId),
    events: [
      {
        name: "conversion_event_purchase_1",
        params: {
          value: pay.transaction_amount || 19.9,
          currency: "BRL",
          transaction_id: id,
        },
      },
    ],
  };
  try {
    const r = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(mid)}&api_secret=${encodeURIComponent(secret)}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );
    if (r.status === 204 || r.ok) {
      await ref.set({ gaConversionSent: true, gaConversionAt: FieldValue.serverTimestamp() }, { merge: true });
    } else {
      logger.error("GA4 MP status", r.status);
    }
  } catch (e) {
    logger.error("GA4 MP exceção", e && e.message);
  }
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
  const { profileKey, nome, email, gaClientId, gclid } = request.data || {};
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
        statement_descriptor: STATEMENT_DESCRIPTOR,
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
    gaClientId: gaClientId || null, gclid: gclid || null,
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
  const { profileKey, nome, email, token: cardToken, paymentMethodId, installments, identification, gaClientId, gclid } = request.data || {};
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
        statement_descriptor: STATEMENT_DESCRIPTOR,
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
    gaClientId: gaClientId || null, gclid: gclid || null,
    createdAt: FieldValue.serverTimestamp(),
  });
  return { paymentId: id, status: mp.status, statusDetail: mp.status_detail || null };
});

/* ─── Webhook ───────────────────────────────────────────────────────── */
// Valida a assinatura HMAC (x-signature) do MP usando MP_WEBHOOK_SECRET.
// Para ATIVAR o e-mail: crie o secret RESEND_API_KEY e adicione-o à lista abaixo
// (ex.: [..., "RESEND_API_KEY"]) e faça o deploy. Sem isso, enviarEmailAcesso é no-op.
export const mpWebhook = onRequest({ secrets: ["MP_ACCESS_TOKEN", "MP_WEBHOOK_SECRET", "GA_MP_API_SECRET"] }, async (req, res) => {
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
    if (pay.status === "approved") { await enviarConversaoGA4(pay); await enviarEmailAcesso(pay); }
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
