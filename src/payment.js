// ─── Cliente do pagamento PIX (Mercado Pago via Cloud Functions) ─────
import { httpsCallable } from "firebase/functions";
import { doc, onSnapshot } from "firebase/firestore";
import { functions, db } from "./firebase";

/**
 * Cria a cobrança PIX chamando a Cloud Function `createPixPayment`.
 * @returns {Promise<{paymentId:string, qrCode:string, qrCodeBase64:string, ticketUrl:string, status:string}>}
 */
export async function criarPagamentoPix({ profileKey, nome, email }) {
  const fn = httpsCallable(functions, "createPixPayment");
  const res = await fn({ profileKey, nome, email });
  return res.data;
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
