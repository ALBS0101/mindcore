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

3. **Token do Mercado Pago** (Suas integrações → Checkout Transparente):
   ```bash
   firebase functions:secrets:set MP_ACCESS_TOKEN
   # (opcional) validação de assinatura do webhook:
   firebase functions:secrets:set MP_WEBHOOK_SECRET
   ```
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

## Pendência de segurança (paywall)
Hoje o **conteúdo do relatório está no bundle** do cliente. Gatear o *unlock*
pelo pagamento já impede o caminho "normal", mas alguém técnico ainda lê o JSON
no source. Para fechar 100%, sirva o relatório completo por uma Function que só
o entrega após confirmar `approved` (mover `descricao/forcas/...` para o servidor).
