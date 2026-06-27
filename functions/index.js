/**
 * MindCode — Cloud Functions de pagamento PIX (Mercado Pago · Checkout Transparente)
 *
 * Fluxo:
 *  1. Cliente chama `createPixPayment` (callable) com { profileKey, nome, email }.
 *  2. Aqui criamos a cobrança PIX na API do Mercado Pago usando o ACCESS TOKEN
 *     (que existe SÓ no servidor) e gravamos um doc em `payments/{mpId}`.
 *  3. Devolvemos o QR (copia-e-cola + base64) ao cliente.
 *  4. O Mercado Pago chama `mpWebhook` quando o status muda. Consultamos o
 *     pagamento na API do MP (fonte da verdade) e atualizamos o Firestore.
 *  5. O cliente escuta `payments/{mpId}` e libera o relatório quando = approved.
 *
 * Segurança: o cliente nunca escreve o status (Firestore Rules). O token do MP
 * nunca vai ao bundle. O webhook revalida sempre consultando a API do MP.
 */

const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const logger = require("firebase-functions/logger");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const crypto = require("crypto");

initializeApp();
const db = getFirestore();

// Região São Paulo (menor latência no Brasil). O cliente deve usar a MESMA.
setGlobalOptions({ region: "southamerica-east1", maxInstances: 10 });

const MP_API = "https://api.mercadopago.com";
const price = () => Number(process.env.MINDCODE_PRICE || "19.90");
const token = () => process.env.MP_ACCESS_TOKEN || "";

/* ─── 1) Criar cobrança PIX ─────────────────────────────────────────── */
exports.createPixPayment = onCall({ secrets: ["MP_ACCESS_TOKEN"] }, async (request) => {
  const { profileKey, nome, email } = request.data || {};

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new HttpsError("invalid-argument", "E-mail inválido.");
  }
  if (!token()) {
    throw new HttpsError("failed-precondition", "Pagamento não configurado no servidor.");
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
        description: `MindCode - Relatorio ${profileKey || ""}`.trim(),
        payment_method_id: "pix",
        payer: {
          email: String(email).slice(0, 120),
          first_name: String(nome || "Cliente").slice(0, 40),
        },
      }),
    });
    mp = await resp.json();
    if (!resp.ok) {
      logger.error("Erro Mercado Pago (create)", mp);
      throw new HttpsError("internal", "Falha ao criar a cobrança PIX.");
    }
  } catch (e) {
    if (e instanceof HttpsError) throw e;
    logger.error("Exceção ao criar pagamento", e);
    throw new HttpsError("internal", "Falha ao contatar o Mercado Pago.");
  }

  const tx = (mp.point_of_interaction && mp.point_of_interaction.transaction_data) || {};
  const id = String(mp.id);

  await db.collection("payments").doc(id).set({
    mpPaymentId: id,
    profileKey: profileKey || null,
    nome: nome || null,
    email,
    amount: price(),
    status: mp.status || "pending",
    statusDetail: mp.status_detail || null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    paymentId: id,
    qrCode: tx.qr_code || null,            // copia-e-cola
    qrCodeBase64: tx.qr_code_base64 || null, // imagem PNG (base64)
    ticketUrl: tx.ticket_url || null,
    status: mp.status || "pending",
  };
});

/* ─── 2) Webhook do Mercado Pago ────────────────────────────────────── */
exports.mpWebhook = onRequest({ secrets: ["MP_ACCESS_TOKEN", "MP_WEBHOOK_SECRET"] }, async (req, res) => {
  try {
    // (Opcional, recomendado) validar a assinatura x-signature do MP.
    const secret = process.env.MP_WEBHOOK_SECRET;
    if (secret && !assinaturaValida(req, secret)) {
      logger.warn("Webhook com assinatura inválida — ignorado.");
      res.status(401).send("invalid signature");
      return;
    }

    const type = req.query.type || (req.body && req.body.type) || req.query.topic;
    const mpId =
      req.query["data.id"] ||
      (req.body && req.body.data && req.body.data.id) ||
      req.query.id;

    if (type !== "payment" || !mpId) {
      res.status(200).send("ignored");
      return;
    }
    if (!token()) {
      res.status(200).send("not-configured");
      return;
    }

    // Fonte da verdade: consultar o pagamento na API do MP.
    const r = await fetch(`${MP_API}/v1/payments/${mpId}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    const pay = await r.json();
    if (!r.ok) {
      logger.error("Erro Mercado Pago (get)", pay);
      res.status(200).send("error"); // 200 evita reenvio infinito do MP
      return;
    }

    const id = String(pay.id);
    await db.collection("payments").doc(id).set(
      {
        status: pay.status, // approved | pending | rejected | cancelled | ...
        statusDetail: pay.status_detail || null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.status(200).send("ok");
  } catch (e) {
    logger.error("Exceção no webhook", e);
    res.status(200).send("error");
  }
});

/* Valida HMAC do header x-signature do Mercado Pago. */
function assinaturaValida(req, secret) {
  try {
    const sig = req.headers["x-signature"];
    const reqId = req.headers["x-request-id"];
    const dataId = req.query["data.id"] || (req.body && req.body.data && req.body.data.id);
    if (!sig || !dataId) return false;
    const parts = Object.fromEntries(
      String(sig).split(",").map((p) => p.split("=").map((s) => s.trim()))
    );
    const ts = parts.ts;
    const v1 = parts.v1;
    if (!ts || !v1) return false;
    const manifest = `id:${dataId};request-id:${reqId};ts:${ts};`;
    const hmac = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(v1));
  } catch {
    return false;
  }
}
