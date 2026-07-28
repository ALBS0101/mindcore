# Guia completo — MCP do Google Analytics 4 (GA4)

Como conectar o Claude Code ao GA4 via MCP oficial do Google, como consultar os
dados e como criar novos eventos. Documenta o processo **real** usado no MindCode
(property `543380097`, projeto `mindcode-bd00e`), incluindo os erros encontrados
e como resolvê-los.

- **Servidor:** [googleanalytics/google-analytics-mcp](https://github.com/googleanalytics/google-analytics-mcp) (oficial, Apache 2.0)
- **Acesso:** somente leitura — o MCP lê relatórios, nunca altera a configuração do GA4
- **Tempo estimado:** ~15 min

---

## Índice
1. [Pré-requisitos](#1-pré-requisitos)
2. [Instalar o servidor MCP](#2-instalar-o-servidor-mcp)
3. [Google Cloud: APIs e Service Account](#3-google-cloud-apis-e-service-account)
4. [Dar acesso da Service Account ao GA4](#4-dar-acesso-da-service-account-ao-ga4)
5. [Registrar o MCP no Claude Code](#5-registrar-o-mcp-no-claude-code)
6. [Verificar a conexão](#6-verificar-a-conexão)
7. [Como consultar os dados](#7-como-consultar-os-dados)
8. [Como criar novos eventos](#8-como-criar-novos-eventos)
9. [Transformar evento em conversão (Google Ads)](#9-transformar-evento-em-conversão-google-ads)
10. [Solução de problemas](#10-solução-de-problemas)

---

## 1. Pré-requisitos

| Item | Como verificar |
|---|---|
| Python 3.10+ | `python --version` |
| Conta Google com acesso **Administrador** ao GA4 | GA4 → Administrador |
| Projeto no Google Cloud | console.cloud.google.com |
| Claude Code instalado | — |

> **Windows:** os comandos abaixo funcionam no PowerShell, CMD ou Git Bash.

---

## 2. Instalar o servidor MCP

O servidor é o pacote Python `analytics-mcp`. Instale com **pipx** (isola as
dependências num venv próprio):

```bash
python -m pip install --user pipx
```

```bash
python -m pipx install analytics-mcp
```

Saída esperada:

```
installed package analytics-mcp 0.6.0, installed using Python 3.14.0
These apps are now available
  - analytics-mcp.exe
  - google-analytics-mcp.exe
```

**Anote o caminho do executável.** No Windows costuma ser:

```
C:\Users\<SEU_USUARIO>\.local\bin\analytics-mcp.exe
```

Para confirmar:

```bash
python -m pipx list
```

> ⚠️ **Se o download falhar no meio** (erro `ConnectionReset`, `pyasn1` "failed to
> build"), **não é incompatibilidade** — foi a conexão que caiu (ex.: o PC entrou
> em suspensão). Desative a suspensão e rode o comando de novo. Veja
> [Solução de problemas](#10-solução-de-problemas).

---

## 3. Google Cloud: APIs e Service Account

### 3.1 Habilitar as duas APIs

No [Console do Google Cloud](https://console.cloud.google.com/apis/library),
com o **projeto correto selecionado**, habilite:

- **Google Analytics Data API** ← relatórios
- **Google Analytics Admin API** ← listar contas/propriedades

### 3.2 Criar a Service Account

**IAM e administrador → Contas de serviço → + Criar conta de serviço**

- **Nome:** `ga-mcp-reader`
- **Papéis no projeto:** *nenhum* (o acesso é dado no GA4, não aqui)
- Clique em **Concluir**

### 3.3 Gerar a chave JSON

1. Clique na conta de serviço criada
2. Aba **Chaves → Adicionar chave → Criar nova chave → JSON → Criar**
3. O navegador baixa um arquivo `.json` de **~2 KB**
4. Mova para um local fixo, por exemplo:

```
C:\Users\<SEU_USUARIO>\.mindcode\ga-mcp-key.json
```

5. **Anote o e-mail da Service Account** (está dentro do JSON, campo
   `client_email`), algo como:
   `ga-mcp-reader@seu-projeto.iam.gserviceaccount.com`

> ⚠️ **Cuidado com a extensão do arquivo.** O Windows esconde extensões por
> padrão — é fácil acabar com `ga-mcp-key.json.txt` ou `ga-mcp-key.json.json`.
> Ative **Explorer → Exibir → Extensões de nomes de arquivos** e confirme que o
> nome termina em **`.json`** (exatamente uma vez).
>
> 🔒 **A chave é uma credencial.** Nunca versione no Git. Adicione ao
> `.gitignore` se ficar dentro do projeto.

---

## 4. Dar acesso da Service Account ao GA4

Este passo é no **Google Analytics**, não no Cloud.

1. GA4 → **Administrador**
2. Na coluna **Propriedade** → **Gerenciamento de acesso à propriedade**
3. Botão **+** (canto superior direito) → **Adicionar usuários**
4. Cole o **e-mail da Service Account**
5. Papel: **Leitor** (Viewer)
6. Desmarque "Notificar novos usuários por e-mail" → **Adicionar**

> Sem este passo a autenticação funciona, mas o MCP não enxerga nenhuma
> propriedade (retorna lista vazia).

---

## 5. Registrar o MCP no Claude Code

### Opção A — CLI (se o comando `claude` estiver disponível)

```bash
claude mcp add google-analytics -s user -e GOOGLE_APPLICATION_CREDENTIALS="C:\Users\<SEU_USUARIO>\.mindcode\ga-mcp-key.json" -- "C:\Users\<SEU_USUARIO>\.local\bin\analytics-mcp.exe"
```

### Opção B — Edição manual (se o `claude` não estiver no PATH)

Foi o caso deste projeto. Edite o arquivo **`C:\Users\<SEU_USUARIO>\.claude.json`**
e adicione a chave `mcpServers` **na raiz** do JSON:

```json
{
  "mcpServers": {
    "google-analytics": {
      "type": "stdio",
      "command": "C:\\Users\\<SEU_USUARIO>\\.local\\bin\\analytics-mcp.exe",
      "args": [],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "C:\\Users\\<SEU_USUARIO>\\.mindcode\\ga-mcp-key.json"
      }
    }
  }
}
```

> - Use **barras duplas** (`\\`) nos caminhos do Windows dentro do JSON.
> - **Faça backup** antes de editar: `copy .claude.json .claude.json.bak`
> - Se o arquivo tiver a seção `projects`, dá para registrar por projeto
>   (`projects["<caminho>"].mcpServers`) — a raiz vale para todos.
> - Valide o JSON depois de editar:
>   `python -c "import json;json.load(open(r'C:\Users\<SEU_USUARIO>\.claude.json',encoding='utf-8'));print('OK')"`

### Reiniciar

**Feche e reabra o Claude Code.** Aprove o servidor `google-analytics` quando
solicitado.

---

## 6. Verificar a conexão

Peça ao Claude:

```
Liste minhas propriedades do GA4
```

Se responder com a propriedade (`properties/543380097 | mindcode-bd00e`), está
conectado. As ferramentas ficam disponíveis como `mcp__google-analytics__*`.

### Teste manual da credencial (opcional, sem depender do MCP)

```bash
python -c "
from google.oauth2 import service_account
import google.auth.transport.requests as gtr, json, urllib.request
KEY=r'C:\Users\<SEU_USUARIO>\.mindcode\ga-mcp-key.json'
c=service_account.Credentials.from_service_account_file(KEY,scopes=['https://www.googleapis.com/auth/analytics.readonly'])
c.refresh(gtr.Request()); print('AUTH OK ->', c.service_account_email)
r=urllib.request.Request('https://analyticsadmin.googleapis.com/v1beta/accountSummaries',headers={'Authorization':'Bearer '+c.token})
d=json.load(urllib.request.urlopen(r))
for a in d.get('accountSummaries',[]):
    for p in a.get('propertySummaries',[]): print(' ', p['property'], p['displayName'])
"
```

> Requer as libs do Google. Use o Python do venv do pipx:
> `C:\Users\<SEU_USUARIO>\AppData\Local\pipx\pipx\venvs\analytics-mcp\Scripts\python.exe`

---

## 7. Como consultar os dados

### Ferramentas disponíveis (somente leitura)

| Ferramenta | Para quê |
|---|---|
| `get_account_summaries` | Lista contas e propriedades |
| `get_property_details` | Detalhes da propriedade (fuso, moeda) |
| `run_report` | **Relatório principal** (dimensões × métricas × período) |
| `run_realtime_report` | Últimos ~30 min (ideal para testar evento novo) |
| `run_funnel_report` | Relatório de funil |
| `run_conversions_report` | Conversões |
| `get_custom_dimensions_and_metrics` | Dimensões/métricas personalizadas |
| `list_google_ads_links` | Vínculos com o Google Ads |
| `list_property_annotations` | Anotações da propriedade |

### Em linguagem natural (recomendado)

Basta pedir ao Claude:

```
Analise o funil dos últimos 30 dias
Quantas conversões de compra tivemos esta semana?
De onde vem meu tráfego? Compare mobile vs desktop
Compare a taxa de checkout antes e depois de 24/07
Mostre os eventos que aconteceram nos últimos 30 minutos
```

### Exemplo real — funil do MindCode

Pedido: *"eventos dos últimos 30 dias, ordenados por contagem"*

```
1425  page_view
1193  session_start
1114  first_visit
 433  test_started        ← iniciou o teste
 296  test_completed      ← terminou as 14 perguntas
 293  paywall_view        ← viu a oferta
   3  checkout_started    ← clicou em pagar  🔴 gargalo!
   1  conversion_event_purchase_1
```

Esse relatório revelou que **99% desistiam no paywall** — o que levou à reforma
da página e ao salto de 1,4% → 13,5% de cliques.

### Parâmetros úteis do `run_report`

```jsonc
{
  "property_id": 543380097,
  "date_ranges": [{ "start_date": "30daysAgo", "end_date": "today" }],
  "dimensions": ["eventName"],          // deviceCategory, sessionSourceMedium, country...
  "metrics": ["eventCount", "totalUsers"], // sessions, activeUsers, eventValue...
  "order_bys": [{ "metric": { "metric_name": "eventCount" }, "desc": true }],
  "limit": 25,
  "dimension_filter": {
    "filter": {
      "field_name": "eventName",
      "in_list_filter": { "values": ["test_started", "paywall_view"] }
    }
  }
}
```

Comparar dois períodos: passe **dois** objetos em `date_ranges` (o resultado vem
com `date_range_0` e `date_range_1`).

Filtrar por prefixo (ex.: todos os eventos `ckt_`):

```jsonc
"dimension_filter": {
  "filter": {
    "field_name": "eventName",
    "string_filter": { "match_type": "BEGINS_WITH", "value": "ckt_" }
  }
}
```

> ⏱️ **Latência:** o `run_report` demora de algumas horas até ~24h para
> consolidar. Para validar um evento **agora**, use `run_realtime_report`.

---

## 8. Como criar novos eventos

Não é preciso "criar" o evento no painel do GA4 — basta **enviá-lo**; ele aparece
automaticamente. Há dois caminhos.

### 8.1 Client-side (navegador) — para ações de interface

Use quando o evento representa uma **ação na tela** (clique, rolagem, etapa do
funil).

**`src/firebase.js`** — helper que garante o Analytics inicializado:

```js
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

export let analytics = null;
isSupported().then((ok) => { if (ok) analytics = getAnalytics(app); }).catch(() => {});

export async function logConversion(name, params = {}) {
  try {
    if (!analytics) {
      if (!(await isSupported())) return;
      analytics = getAnalytics(app);
    }
    logEvent(analytics, name, params);
  } catch (e) {}
}
```

**Uso:**

```js
import { logConversion } from "./firebase.js";

logConversion("paywall_view");
logConversion("ckt_card_recusado", { metodo: "cartao", segundos: 42, detalhe: "cc_rejected_bad_filled_security_code" });
```

**Regras de nome (GA4):**

| Regra | Limite |
|---|---|
| Nome do evento | ≤ 40 caracteres, sem espaços, `snake_case` |
| Nome do parâmetro | ≤ 40 caracteres |
| Valor do parâmetro (texto) | ≤ 100 caracteres |
| Parâmetros por evento | ≤ 25 |

> 💡 **Prefixe eventos relacionados** (`ckt_` para checkout) — facilita filtrar
> tudo com `BEGINS_WITH`.

### 8.2 Server-side (Measurement Protocol) — para eventos críticos

Use quando o evento **não pode se perder**, como uma compra: se o cliente paga
por PIX com a aba fechada, o evento do navegador nunca dispara.

**a) Criar o API Secret**

GA4 → **Administrador → Fluxos de dados** → clique no fluxo Web →
**Protocolo de medição → Criar** → copie o valor.

**b) Guardar como secret (Firebase Functions)**

```bash
firebase functions:secrets:set GA_MP_API_SECRET
```

**c) Declarar o secret na função**

```js
export const mpWebhook = onRequest(
  { secrets: ["MP_ACCESS_TOKEN", "GA_MP_API_SECRET"] },
  async (req, res) => { /* ... */ }
);
```

**d) Enviar o evento** (`functions/index.js`):

```js
async function enviarConversaoGA4(pay) {
  const secret = process.env.GA_MP_API_SECRET;
  if (!secret) return;                       // no-op se não configurado
  const mid = "G-XXXXXXXXXX";                // Measurement ID do fluxo Web
  const id = String(pay.id);

  const ref = db.collection("payments").doc(id);
  const data = (await ref.get()).data() || {};
  if (data.gaConversionSent) return;          // idempotência: envia 1x só

  const body = {
    // client_id capturado no navegador → atribui a conversão à sessão/anúncio
    client_id: String(data.gaClientId || `${Math.floor(Math.random()*1e10)}.${Math.floor(Date.now()/1000)}`),
    events: [{
      name: "conversion_event_purchase_1",
      params: {
        value: pay.transaction_amount,
        currency: "BRL",
        transaction_id: id,
        items: [{ item_id: data.profileKey, item_name: "Relatorio", price: pay.transaction_amount, quantity: 1 }],
      },
    }],
  };

  const r = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${mid}&api_secret=${secret}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
  );
  if (r.status === 204 || r.ok) {
    await ref.set({ gaConversionSent: true, gaConversionAt: FieldValue.serverTimestamp() }, { merge: true });
  }
}
```

**e) Capturar o `client_id` no navegador** (para a atribuição funcionar):

```js
function lerGaCookie() {
  const m = document.cookie.match(/_ga=GA\d\.\d\.([\d.]+)/);
  return m ? m[1] : null;
}
function lerGaClientId() {
  return new Promise((resolve) => {
    const mid = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
    if (window.gtag && mid) {
      window.gtag("get", mid, "client_id", (id) => resolve(id || lerGaCookie()));
      setTimeout(() => resolve(lerGaCookie()), 700);   // timeout de segurança
    } else resolve(lerGaCookie());
  });
}
```

Envie o `gaClientId` junto ao criar o pagamento e **salve no banco** — o webhook
vai usá-lo depois.

**f) Validar antes de ir para produção**

O endpoint `/debug/mp/collect` valida sem registrar:

```bash
curl -s -X POST "https://www.google-analytics.com/debug/mp/collect?measurement_id=G-XXXXXXXXXX&api_secret=SEU_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"client_id":"123.456","events":[{"name":"teste_evento","params":{"value":1,"currency":"BRL"}}]}'
```

`{"validationMessages":[]}` = evento válido. Qualquer mensagem aponta o erro.

### 8.3 ⚠️ Nunca dispare o mesmo evento nos dois lados

**Erro cometido neste projeto:** a compra era enviada pelo navegador **e** pelo
servidor. Resultado: **2 vendas viraram 5 eventos** no GA4.

A dedupe por `transaction_id` **não funciona** em evento personalizado — a
dimensão `transactionId` só é preenchida em eventos de e-commerce padrão
(`purchase`). Como conferir:

```
Peça: "mostre eventos de compra por transactionId nos últimos 7 dias"
Se vier "(not set)" → não há deduplicação possível.
```

**Regra:** escolha **um** lado por evento.

| Tipo de evento | Onde disparar |
|---|---|
| Interface (cliques, etapas do funil) | Client-side |
| Compra / pagamento confirmado | **Server-side** (cobre 100% dos casos) |

---

## 9. Transformar evento em conversão (Google Ads)

1. **GA4 → Administrador → Eventos principais** → marcar o evento como principal
   (ex.: `conversion_event_purchase_1`)
2. **GA4 → Administrador → Vínculos com produtos → Google Ads** → vincular a conta
3. **Google Ads → Objetivos → Conversões → + Nova ação → Importar → GA4** →
   selecionar o evento
4. Definir como **Ação principal** para a estratégia de lances otimizar por ela

> A conversão fica "não verificada" no Google Ads até a primeira ocorrência real
> ser importada — pode levar algumas horas. É normal.

**Não use o método de "URL de conversão" em SPA:** como a URL não muda, o Google
contaria toda visita à home como venda. Se a interface obrigar uma URL, crie uma
rota de sucesso exclusiva (ex.: `/compra-aprovada`) alcançável **apenas após o
pagamento**.

---

## 10. Solução de problemas

| Sintoma | Causa | Solução |
|---|---|---|
| `pip failed to build pyasn1` / `ConnectionResetError` | Download interrompido (PC suspendeu, rede caiu) — **não** é incompatibilidade de versão | Desative a suspensão e rode `python -m pipx install analytics-mcp` de novo |
| `error: Missing expected target directory for Python minor version link` (uv) | Extração do Python pelo `uv` corrompida | Use **pipx**, não `uv` |
| `'claude' não é reconhecido como comando` | CLI fora do PATH (usa extensão IDE) | Use a [Opção B](#opção-b--edição-manual-se-o-claude-não-estiver-no-path) — editar `.claude.json` |
| Ferramentas `mcp__google-analytics__*` não aparecem | Claude Code não foi reiniciado, ou JSON inválido | Reinicie; valide o `.claude.json` |
| `Cannot read credentials` / chave não encontrada | Extensão dupla (`.json.txt`, `.json.json`) | Ative extensões no Explorer e renomeie para `.json` |
| Autentica mas **0 propriedades** | Service Account sem acesso no GA4 | [Passo 4](#4-dar-acesso-da-service-account-ao-ga4) — adicionar como **Leitor** |
| `403 Caller does not have permission to use project ... serviceusage.serviceUsageConsumer` | Header `x-goog-user-project` enviado em chamada direta à API | **Omita** esse header (o MCP já faz isso corretamente) |
| `403 PERMISSION_DENIED` na Data API | API não habilitada | [Passo 3.1](#31-habilitar-as-duas-apis) |
| Evento novo não aparece no relatório | Latência de processamento (horas) | Use `run_realtime_report` para validar na hora |
| Conversão contando em dobro | Evento disparado client **e** server-side | [Seção 8.3](#83--nunca-dispare-o-mesmo-evento-nos-dois-lados) |

### Comandos úteis

```bash
python -m pipx list                      # versão instalada do analytics-mcp
python -m pipx upgrade analytics-mcp     # atualizar
python -m pipx uninstall analytics-mcp   # remover
```

---

## Referências

- [Servidor MCP oficial (GitHub)](https://github.com/googleanalytics/google-analytics-mcp)
- [Documentação Google Analytics MCP](https://developers.google.com/analytics/devguides/MCP)
- [Data API v1beta — dimensões e métricas](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
- [Measurement Protocol (GA4)](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [Limites de eventos e parâmetros](https://support.google.com/analytics/answer/9267744)

---

## Referência rápida — MindCode

| Item | Valor |
|---|---|
| Property ID | `543380097` |
| Projeto Cloud / Firebase | `mindcode-bd00e` |
| Measurement ID | `G-W13HKCQ510` |
| Executável do MCP | `C:\Users\augus\.local\bin\analytics-mcp.exe` |
| Chave da Service Account | `C:\Users\augus\.mindcode\ga-mcp-key.json` |
| Evento de conversão | `conversion_event_purchase_1` (server-side) |
| Eventos do funil | `test_started`, `test_completed`, `paywall_view`, `checkout_started` |
| Eventos do checkout | prefixo `ckt_` (ver `src/App.jsx` → `trackCkt`) |
| Avaliações | `review_submitted` |
