// Carrega o relatório COMPLETO de um perfil.
//
// Produção: chama a Cloud Function `getReport`, que só devolve o conteúdo se o
// pagamento estiver aprovado (Firestore). Assim o conteúdo pago NÃO vai no bundle.
//
// Dev (sem pagamentos): faz fallback para `../functions/profiles.js`. Esse import
// está atrás de `import.meta.env.DEV`, então o Rollup o ELIMINA do build de
// produção (dead-code elimination) — o conteúdo completo não entra no bundle final.

export async function carregarRelatorio({ paymentId, profileKey }) {
  // Fallback de desenvolvimento (não vai para produção)
  if (import.meta.env.DEV && import.meta.env.VITE_PAYMENTS_ENABLED !== "true") {
    const { profiles } = await import("../functions/profiles.js");
    return profiles[profileKey] || null;
  }

  const { httpsCallable } = await import("firebase/functions");
  const { functions } = await import("./firebase.js");
  const fn = httpsCallable(functions, "getReport");
  const res = await fn({ paymentId, profileKey });
  return res.data;
}
