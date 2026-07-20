// ─── Inicialização do Firebase ──────────────────────────────────────
// A config WEB do Firebase é pública por natureza (vai para o bundle do
// cliente). A segurança real vem das Firestore Security Rules e da
// restrição da API key no Google Cloud Console. As chaves ficam em
// variáveis de ambiente (.env.local) para não irem ao repositório.

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);

// Firestore (status do pagamento) e Functions (mesma região das CFs).
export const db = getFirestore(app);
export const functions = getFunctions(app, "southamerica-east1");

// Analytics só inicializa no browser e se o ambiente suportar
// (evita exceções em SSR / navegadores sem suporte / modo privado).
export let analytics = null;
isSupported()
  .then((ok) => { if (ok) analytics = getAnalytics(app); })
  .catch(() => {});

// Envia um evento ao GA4 (property mindcode-bd00e) — usado para a conversão de
// compra que o Google Ads importa do GA4. Garante o analytics pronto (init async).
export async function logConversion(name, params = {}) {
  try {
    if (!analytics) {
      if (!(await isSupported())) return;
      analytics = getAnalytics(app);
    }
    logEvent(analytics, name, params);
  } catch (e) {}
}
