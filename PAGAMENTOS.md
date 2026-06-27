# Pagamento PIX — Mercado Pago (Checkout Transparente)

Fluxo: o cliente chama a Cloud Function `createPixPayment` → criamos a cobrança
PIX na API do Mercado Pago (token **só no servidor**) → gravamos `payments/{id}`
no Firestore → devolvemos o QR. Quando o pagamento muda de status, o Mercado
Pago chama `mpWebhook`, que **revalida na API do MP** e atualiza o Firestore. O
cliente **escuta** o doc e libera o resultado quando `status === "approved"`.

A segurança vem das **Firestore Rules** (cliente só lê, nunca escreve o status)
+ revalidação no webhook. Ninguém consegue forjar "approved".

## Passo a passo do deploy

1. **Plano Blaze** no Firebase (Functions exige billing ativo).

2. **Instalar deps das functions**
   ```bash
   cd functions && npm install && cd ..
   ```

3. **Credenciais do Mercado Pago** (Suas integrações → Checkout Transparente):
   ```bash
   firebase functions:secrets:set MP_ACCESS_TOKEN      # token PRIVADO (servidor)
   firebase functions:secrets:set MP_WEBHOOK_SECRET    # opcional (assinatura webhook)
   ```
   E a **chave pública** no frontend (cartão usa MP.js): defina
   `VITE_MP_PUBLIC_KEY` no `.env.local` e nas envs do deploy do front.
   > Em dev local com emulador, use `functions/.env` (veja `.env.example`).

4. **Deploy** (rules + functions):
   ```bash
   firebase deploy --only firestore:rules,functions
   ```

5. **Configurar o webhook** no painel do Mercado Pago apontando para a URL da
   função `mpWebhook` (mostrada no fim do deploy), evento **Pagamentos**:
   `https://southamerica-east1-<PROJECT_ID>.cloudfunctions.net/mpWebhook`

6. **Restringir a API key do Firebase** (Google Cloud Console → Credentials):
   HTTP referrers do seu domínio + `localhost:5173/*`.

7. **Ligar o fluxo real** no frontend: definir `VITE_PAYMENTS_ENABLED=true`
   (no `.env.local` e nas envs do deploy do front) e fazer o build.

## Paywall (fechado ✓)
O conteúdo completo dos relatórios **não está mais no bundle**: vive em
`functions/profiles.js` (servidor) e é entregue pela Function **`getReport`**, que
só responde se `payments/{id}.status === "approved"`. O cliente recebe apenas
teasers (`src/profilesPreview.js`). Em desenvolvimento, há um fallback local que o
Rollup **remove do build de produção** (verificado: 0 ocorrências do conteúdo pago
no bundle final).

## Métodos de pagamento
- **PIX**: `createPixPayment` → QR (copia-e-cola + base64) → webhook confirma.
- **Cartão**: Brick do Mercado Pago (MP.js) tokeniza o cartão no cliente (o número
  nunca passa pelo seu servidor) → `createCardPayment` cria o pagamento.

Ative o fluxo real com `VITE_PAYMENTS_ENABLED=true` (o cartão também exige
`VITE_MP_PUBLIC_KEY`).
