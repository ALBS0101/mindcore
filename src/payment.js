// ─── Cliente do pagamento PIX (Mercado Pago via Cloud Functions) ─────
import { httpsCallable } from "firebase/functions";
import { doc, onSnapshot } from "firebase/firestore";
import { functions, db } from "./firebase";

/**
 * Cria a cobrança PIX chamando a Cloud Function `createPixPayment`.
 * @returns {Promise<{paymentId:string, qrCode:string, qrCodeBase64:string, ticketUrl:string, status:string}>}
 */
// ─── Atribuição de conversão (GA4 / Google Ads) ─────────────────────
// Lê o client_id do GA4 (via gtag ou cookie _ga) para que a conversão
// enviada pelo servidor seja atribuída à mesma sessão/anúncio do usuário.
function lerGaCookie() {
  try { const m = document.cookie.match(/_ga=GA\d\.\d\.([\d.]+)/); return m ? m[1] : null; } catch (e) { return null; }
}
function lerGaClientId() {
  return new Promise((resolve) => {
    let done = false;
    const finish = (v) => { if (!done) { done = true; resolve(v || null); } };
    try {
      const mid = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
      if (typeof window !== "undefined" && window.gtag && mid) {
        window.gtag("get", mid, "client_id", (id) => finish(id || lerGaCookie()));
        setTimeout(() => finish(lerGaCookie()), 700);
      } else finish(lerGaCookie());
    } catch (e) { finish(lerGaCookie()); }
  });
}
function lerGclid() { try { return sessionStorage.getItem("mc-gclid") || null; } catch (e) { return null; } }

export async function criarPagamentoPix({ profileKey, nome, email }) {
  const gaClientId = await lerGaClientId();
  const fn = httpsCallable(functions, "createPixPayment");
  const res = await fn({ profileKey, nome, email, gaClientId, gclid: lerGclid() });
  return res.data;
}

/**
 * Cria um pagamento com CARTÃO (token gerado no cliente via MP.js / Brick).
 * @returns {Promise<{paymentId:string, status:string, statusDetail:string}>}
 */
export async function criarPagamentoCartao(payload) {
  const gaClientId = await lerGaClientId();
  const fn = httpsCallable(functions, "createCardPayment");
  const res = await fn({ ...payload, gaClientId, gclid: lerGclid() });
  return res.data;
}

/** Carrega o SDK MP.js (v2) sob demanda (uma vez). */
let _mpSdk;
export function carregarMpSdk() {
  if (typeof window !== "undefined" && window.MercadoPago) return Promise.resolve();
  if (!_mpSdk) {
    _mpSdk = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://sdk.mercadopago.com/js/v2";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Falha ao carregar o SDK do Mercado Pago."));
      document.head.appendChild(s);
    });
  }
  return _mpSdk;
}

/**
 * Observa o doc do pagamento e chama `cb(dados)` a cada mudança de status.
 * Retorna a função de unsubscribe.
 */
export function observarPagamento(paymentId, cb) {
  return onSnapshot(
    doc(db, "payments", paymentId),
    (snap) => cb(snap.exists() ? snap.data() : null),
    (err) => cb({ status: "error", error: err.message })
  );
}
