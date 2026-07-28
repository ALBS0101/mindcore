# Google Analytics 4 + Claude — Guia de conexão via MCP

Conecte o **Claude** ao seu **Google Analytics 4** para analisar dados
conversando, e aprenda a criar eventos personalizados para medir o que importa
no seu produto.

- **Servidor:** [googleanalytics/google-analytics-mcp](https://github.com/googleanalytics/google-analytics-mcp) — oficial do Google, Apache 2.0
- **Acesso:** somente leitura (o Claude lê relatórios, nunca altera sua configuração)
- **Tempo:** ~15 minutos
- **Custo:** gratuito

> Escrito a partir de uma implementação real em produção — inclui os erros que
> aparecem no caminho e como resolver cada um.

---

## Como usar este guia com o Claude

Salve este arquivo na pasta do seu projeto. Depois peça ao Claude:

```
Leia o GUIA-MCP-GA4.md e me ajude a conectar meu Google Analytics.
Meu sistema é Windows/macOS/Linux e meu projeto usa <React/Next/WordPress/...>.
```

O Claude vai executar o que puder (instalação, edição de configuração,
verificação) e te dizer exatamente quais passos exigem você — os que envolvem
login no Google e credenciais.

**Divisão de trabalho:**

| Você faz | O Claude faz |
|---|---|
| Login no Google Cloud e no GA4 | Instala o servidor MCP |
| Criar a Service Account e baixar a chave | Edita os arquivos de configuração |
| Dar acesso de Leitor no GA4 | Testa a conexão e diagnostica erros |
| Reiniciar o Claude Code | Consulta os dados e escreve o código dos eventos |

---

## Índice
1. [Pré-requisitos](#1-pré-requisitos)
2. [Instalar o servidor MCP](#2-instalar-o-servidor-mcp)
3. [Google Cloud: APIs e Service Account](#3-google-cloud-apis-e-service-account)
4. [Dar acesso ao GA4](#4-dar-acesso-ao-ga4)
5. [Registrar no Claude](#5-registrar-no-claude)
6. [Verificar](#6-verificar)
7. [Consultar dados](#7-consultar-dados)
8. [Criar eventos](#8-criar-eventos)
9. [Evento → conversão no Google Ads](#9-evento--conversão-no-google-ads)
10. [Solução de problemas](#10-solução-de-problemas)
11. [Checklist](#11-checklist)

---

## 1. Pré-requisitos

| Item | Verificação |
|---|---|
| Python 3.10+ | `python --version` (ou `python3 --version`) |
| Claude Code | instalado e funcionando |
| GA4 com acesso **Administrador** | analytics.google.com → Administrador |
| Projeto no Google Cloud | console.cloud.google.com (pode criar um novo, é grátis) |

**Anote seu Property ID:** GA4 → **Administrador → Configurações da propriedade**.
É um número como `123456789` (não confunda com o *Measurement ID*, que é
`G-XXXXXXXXXX`).

---

## 2. Instalar o servidor MCP

O servidor é o pacote Python `analytics-mcp`. Use **pipx** (isola as dependências):

```bash
python -m pip install --user pipx
```

```bash
python -m pipx install analytics-mcp
```

Saída esperada:

```
installed package analytics-mcp 0.6.0
These apps are now available
  - analytics-mcp
  - google-analytics-mcp
```

**Descubra o caminho do executável** — você vai precisar dele no passo 5:

```bash
python -m pipx list
```

| Sistema | Caminho típico |
|---|---|
| Windows | `C:\Users\<SEU_USUARIO>\.local\bin\analytics-mcp.exe` |
| macOS / Linux | `/Users/<SEU_USUARIO>/.local/bin/analytics-mcp` |

> ⚠️ Se o download falhar no meio (`ConnectionResetError`, ou erro compilando
> `pyasn1`/`grpcio`), **não é incompatibilidade de versão** — foi a conexão que
> caiu. Impeça o computador de suspender e rode o comando novamente.

---

## 3. Google Cloud: APIs e Service Account

### 3.1 Habilitar as duas APIs

Em [console.cloud.google.com/apis/library](https://console.cloud.google.com/apis/library),
com o projeto certo selecionado, habilite:

- **Google Analytics Data API** — relatórios
- **Google Analytics Admin API** — listar contas e propriedades

### 3.2 Criar a Service Account

**IAM e administrador → Contas de serviço → + Criar conta de serviço**

- Nome: `ga-mcp-reader`
- Papéis no projeto: **nenhum** (o acesso é concedido dentro do GA4)
- **Concluir**

### 3.3 Gerar a chave JSON

1. Clique na conta criada → aba **Chaves**
2. **Adicionar chave → Criar nova chave → JSON → Criar**
3. Baixa um arquivo `.json` de **~2 KB**
4. Guarde num local fixo e seguro:

| Sistema | Sugestão |
|---|---|
| Windows | `C:\Users\<SEU_USUARIO>\.ga-mcp\key.json` |
| macOS / Linux | `~/.ga-mcp/key.json` |

5. Abra o arquivo e **copie o valor de `client_email`** — algo como
   `ga-mcp-reader@seu-projeto.iam.gserviceaccount.com`

> ⚠️ **Extensão do arquivo (erro comum no Windows):** o Explorer esconde
> extensões, e é fácil terminar com `key.json.txt` ou `key.json.json`. Ative
> **Exibir → Extensões de nomes de arquivos** e confirme que termina em `.json`
> exatamente uma vez.
>
> 🔒 **Essa chave dá acesso aos seus dados.** Nunca a envie para o Git — adicione
> ao `.gitignore` se ficar dentro do projeto. Não cole o conteúdo dela em chats.

---

## 4. Dar acesso ao GA4

Este passo é no **Google Analytics**, não no Cloud. É o mais esquecido.

1. GA4 → **Administrador**
2. Coluna **Propriedade** → **Gerenciamento de acesso à propriedade**
3. Botão **+** → **Adicionar usuários**
4. Cole o **`client_email`** da Service Account
5. Papel: **Leitor**
6. Desmarque a notificação por e-mail → **Adicionar**

> Sem isso, a autenticação funciona mas o Claude não enxerga nenhuma propriedade.

---

## 5. Registrar no Claude

### Opção A — CLI (mais simples)

```bash
claude mcp add google-analytics -s user -e GOOGLE_APPLICATION_CREDENTIALS="/caminho/para/key.json" -- "/caminho/para/analytics-mcp"
```

No Windows, use os caminhos com barra invertida entre aspas:

```bash
claude mcp add google-analytics -s user -e GOOGLE_APPLICATION_CREDENTIALS="C:\Users\<SEU_USUARIO>\.ga-mcp\key.json" -- "C:\Users\<SEU_USUARIO>\.local\bin\analytics-mcp.exe"
```

### Opção B — Edição manual

Use se o comando `claude` não estiver no PATH (comum quando se usa a extensão de
IDE). Edite `~/.claude.json` (ou `C:\Users\<SEU_USUARIO>\.claude.json`) e
adicione na raiz do JSON:

```json
{
  "mcpServers": {
    "google-analytics": {
      "type": "stdio",
      "command": "/caminho/para/analytics-mcp",
      "args": [],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/caminho/para/key.json"
      }
    }
  }
}
```

No Windows, escape as barras: `"C:\\Users\\voce\\.local\\bin\\analytics-mcp.exe"`

> 💡 Faça backup antes (`cp ~/.claude.json ~/.claude.json.bak`) e valide depois:
> `python -c "import json;json.load(open('CAMINHO'));print('JSON OK')"`

### Reiniciar

**Feche e reabra o Claude Code**, e aprove o servidor quando solicitado.

---

## 6. Verificar

Peça ao Claude:

```
Liste minhas propriedades do Google Analytics
```

Se vier o nome e o ID da propriedade, está conectado. As ferramentas aparecem
como `mcp__google-analytics__*`.

---

## 7. Consultar dados

### Ferramentas disponíveis (somente leitura)

| Ferramenta | Para quê |
|---|---|
| `get_account_summaries` | Lista contas e propriedades |
| `get_property_details` | Fuso horário, moeda, detalhes |
| `run_report` | **Relatório principal** — dimensões × métricas × período |
| `run_realtime_report` | Últimos ~30 min (validar evento novo) |
| `run_funnel_report` | Funil de etapas |
| `run_conversions_report` | Conversões |
| `get_custom_dimensions_and_metrics` | Dimensões/métricas personalizadas |
| `list_google_ads_links` | Vínculos com Google Ads |

### Prompts prontos

```
Analise meu funil dos últimos 30 dias e me diga onde as pessoas desistem
```
```
Compare o desempenho antes e depois de <data> — o que mudou?
```
```
De onde vem meu tráfego? Separe por origem e por dispositivo
```
```
Quais páginas têm mais saídas? Onde estou perdendo visitantes?
```
```
Mostre os eventos dos últimos 30 minutos (estou testando um evento novo)
```
```
Quantas conversões tive esta semana e qual a receita?
```

### Exemplo de funil real

Um relatório de eventos por contagem revela o gargalo na hora:

```
1114  first_visit
 433  test_started       ← 39% dos visitantes começam
 296  test_completed     ← 68% terminam
 293  paywall_view       ← 99% chegam à oferta
   3  checkout_started   ← 1% clica em comprar   🔴 o problema está aqui
```

Nesse caso, a página de oferta perdia 99% — a correção dela multiplicou os
cliques por 10. **O valor do MCP é achar o número que importa em minutos.**

### Estrutura do `run_report`

```jsonc
{
  "property_id": 123456789,
  "date_ranges": [{ "start_date": "30daysAgo", "end_date": "today" }],
  "dimensions": ["eventName"],
  "metrics": ["eventCount", "totalUsers"],
  "order_bys": [{ "metric": { "metric_name": "eventCount" }, "desc": true }],
  "limit": 25
}
```

Dimensões úteis: `eventName`, `deviceCategory`, `sessionSourceMedium`,
`country`, `pagePath`, `landingPage`
Métricas úteis: `eventCount`, `totalUsers`, `sessions`, `activeUsers`,
`screenPageViews`, `bounceRate`, `averageSessionDuration`

**Comparar períodos:** passe dois objetos em `date_ranges` (retorna
`date_range_0` e `date_range_1`).

**Filtrar por prefixo** (ex.: todos os eventos que começam com `ckt_`):

```jsonc
"dimension_filter": {
  "filter": {
    "field_name": "eventName",
    "string_filter": { "match_type": "BEGINS_WITH", "value": "ckt_" }
  }
}
```

> ⏱️ **Latência:** relatórios normais levam de horas até ~24h para consolidar.
> Para validar um evento agora, use `run_realtime_report`.

---

## 8. Criar eventos

No GA4 você não "cria" o evento no painel — basta **enviá-lo** que ele aparece.
Existem dois caminhos, e escolher o certo evita dor de cabeça.

| Tipo de evento | Onde disparar |
|---|---|
| Cliques, etapas do funil, rolagem | **Client-side** (navegador) |
| Compra, pagamento, evento crítico | **Server-side** (não pode se perder) |

### 8.1 Client-side

**Site com gtag.js:**

```html
<script>
  gtag('event', 'clicou_orcamento', {
    origem: 'header',
    plano: 'pro'
  });
</script>
```

**Projeto com Firebase:**

```js
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

let analytics = null;
isSupported().then(ok => { if (ok) analytics = getAnalytics(app); });

export async function logConversion(name, params = {}) {
  try {
    if (!analytics) {
      if (!(await isSupported())) return;
      analytics = getAnalytics(app);
    }
    logEvent(analytics, name, params);
  } catch (e) {}
}

// uso
logConversion("checkout_started", { metodo: "pix", segundos: 42 });
```

**Regras de nomenclatura do GA4:**

| Regra | Limite |
|---|---|
| Nome do evento | ≤ 40 caracteres, `snake_case`, sem espaços |
| Nome do parâmetro | ≤ 40 caracteres |
| Valor de texto | ≤ 100 caracteres |
| Parâmetros por evento | ≤ 25 |

> 💡 **Use prefixos** (`ckt_` para checkout, `onb_` para onboarding). Depois dá
> para filtrar o grupo inteiro com `BEGINS_WITH` e ver o funil completo.

### 8.2 Server-side (Measurement Protocol)

Essencial quando o evento **não pode se perder** — por exemplo, um pagamento
confirmado por webhook enquanto o cliente já fechou a aba.

**a) Criar o API Secret:** GA4 → **Administrador → Fluxos de dados** → clique no
fluxo Web → **Protocolo de medição → Criar** → copie o valor.

**b) Guardar como variável de ambiente/secret** (nunca no código):

```bash
# exemplo com Firebase Functions
firebase functions:secrets:set GA_MP_API_SECRET
```

**c) Enviar o evento** (Node.js — adapte para sua linguagem):

```js
async function enviarEventoGA4({ clientId, eventName, params }) {
  const mid = "G-XXXXXXXXXX";               // Measurement ID
  const secret = process.env.GA_MP_API_SECRET;
  if (!secret) return;

  const res = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${mid}&api_secret=${secret}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: String(clientId),        // veja o item (d)
        events: [{ name: eventName, params }],
      }),
    }
  );
  return res.status === 204 || res.ok;
}
```

**d) Capturar o `client_id`** no navegador e salvá-lo junto ao pedido — é o que
liga o evento do servidor à sessão/campanha do usuário:

```js
function lerGaCookie() {
  const m = document.cookie.match(/_ga=GA\d\.\d\.([\d.]+)/);
  return m ? m[1] : null;
}

function lerGaClientId() {
  return new Promise(resolve => {
    const mid = "G-XXXXXXXXXX";
    if (window.gtag) {
      window.gtag("get", mid, "client_id", id => resolve(id || lerGaCookie()));
      setTimeout(() => resolve(lerGaCookie()), 700);  // timeout de segurança
    } else resolve(lerGaCookie());
  });
}
```

> Sem o `client_id` correto, o evento chega mas fica **sem atribuição** — o
> Google Ads não saberá qual anúncio gerou a venda.

**e) Garanta idempotência.** Marque no banco que o evento já foi enviado para
aquele pedido, para um webhook reenviado não contar duas vezes:

```js
if (pedido.gaEventoEnviado) return;
await enviarEventoGA4({ ... });
await salvar({ gaEventoEnviado: true });
```

**f) Valide antes de produção** com o endpoint de debug (não registra nada):

```bash
curl -s -X POST "https://www.google-analytics.com/debug/mp/collect?measurement_id=G-XXXXXXXXXX&api_secret=SEU_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"client_id":"123.456","events":[{"name":"teste","params":{"value":1,"currency":"BRL"}}]}'
```

`{"validationMessages":[]}` = válido. Qualquer mensagem aponta o problema.

### 8.3 ⚠️ Nunca dispare o mesmo evento nos dois lados

Erro clássico (e cometido em produção neste projeto de origem): a compra era
enviada pelo navegador **e** pelo servidor. Resultado: **2 vendas viraram 5
eventos** — dados inflados e campanhas otimizando errado.

A deduplicação por `transaction_id` **não funciona** em evento personalizado: a
dimensão `transactionId` só é preenchida em eventos de e-commerce padrão
(`purchase`). Para conferir, peça ao Claude:

```
Mostre meus eventos de compra por transactionId nos últimos 7 dias
```

Se vier `(not set)`, não há dedupe possível — **escolha um lado só**.

---

## 9. Evento → conversão no Google Ads

1. **GA4 → Administrador → Eventos principais** → marque seu evento
2. **GA4 → Administrador → Vínculos com produtos → Google Ads** → vincule a conta
3. **Google Ads → Objetivos → Conversões → + Nova ação → Importar → GA4** →
   selecione o evento
4. Defina como **Ação principal** para os lances otimizarem por ela

> A conversão aparece como "não verificada" até a primeira ocorrência real ser
> importada — pode levar horas. É normal.

**Atenção em SPAs (React, Vue, Angular):** não use o método de conversão por
**URL**. Como a URL não muda, o Google contaria toda visita como conversão. Use
o método por **evento**; se a interface exigir uma URL, crie uma rota de sucesso
acessível **apenas após a conversão** (ex.: `/obrigado`).

---

## 10. Solução de problemas

| Sintoma | Causa | Solução |
|---|---|---|
| `failed to build pyasn1` / `ConnectionResetError` | Download interrompido — **não** é versão do Python | Evite a suspensão do PC e reinstale |
| `Missing expected target directory for Python minor version link` | Falha do `uv` ao extrair Python | Use **pipx**, não `uv` |
| `'claude' não é reconhecido` | CLI fora do PATH (uso via IDE) | Use a [Opção B](#opção-b--edição-manual) |
| Ferramentas não aparecem | Claude não reiniciado ou JSON inválido | Reinicie; valide o `.claude.json` |
| Credencial não encontrada | Extensão dupla (`.json.txt`) | Ative extensões no Explorer e renomeie |
| Autentica mas **0 propriedades** | Falta acesso no GA4 | [Passo 4](#4-dar-acesso-ao-ga4) — papel **Leitor** |
| `403 ... serviceusage.serviceUsageConsumer` | Header `x-goog-user-project` em chamada direta | Omita esse header (o MCP já faz certo) |
| `403 PERMISSION_DENIED` | API não habilitada | [Passo 3.1](#31-habilitar-as-duas-apis) |
| Evento novo não aparece | Latência de processamento | Use `run_realtime_report` |
| Conversão contando em dobro | Disparo client **e** server | [Seção 8.3](#83--nunca-dispare-o-mesmo-evento-nos-dois-lados) |
| Evento chega sem atribuição | `client_id` ausente/errado | [Seção 8.2 (d)](#82-server-side-measurement-protocol) |

### Comandos úteis

```bash
python -m pipx list                       # ver instalação
python -m pipx upgrade analytics-mcp      # atualizar
python -m pipx uninstall analytics-mcp    # remover
```

---

## 11. Checklist

**Conexão**
- [ ] `analytics-mcp` instalado e caminho anotado
- [ ] Data API + Admin API habilitadas
- [ ] Service Account criada e chave `.json` salva (extensão correta)
- [ ] `client_email` adicionado como **Leitor** na propriedade GA4
- [ ] Servidor registrado no `.claude.json`
- [ ] Claude Code reiniciado e servidor aprovado
- [ ] "Liste minhas propriedades" retorna a propriedade

**Eventos**
- [ ] Nomes em `snake_case`, ≤ 40 caracteres, com prefixo por grupo
- [ ] Eventos críticos enviados **server-side** com idempotência
- [ ] `client_id` capturado e persistido para atribuição
- [ ] Validado no `/debug/mp/collect` e visto no `run_realtime_report`
- [ ] Nenhum evento disparando nos dois lados
- [ ] Marcado como evento principal e importado no Google Ads (se aplicável)

---

## Referências

- [Servidor MCP oficial (GitHub)](https://github.com/googleanalytics/google-analytics-mcp)
- [Documentação Google Analytics MCP](https://developers.google.com/analytics/devguides/MCP)
- [Data API — dimensões e métricas](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
- [Measurement Protocol (GA4)](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [Limites de eventos e parâmetros](https://support.google.com/analytics/answer/9267744)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

*Guia livre para uso e adaptação. Baseado em uma implementação real em produção.*
