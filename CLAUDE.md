# MindCode — Instruções para Claude Code

## Contexto do projeto

Aplicativo React de autoconhecimento com modelo de negócio freemium + paywall.
O usuário faz um teste de 8 perguntas, recebe uma prévia do perfil, paga R$19,90 via PIX
e acessa o resultado completo com download de PDF personalizado.

## Stack

- React 18 + Vite
- jsPDF 2.5.1 via CDN (carregado no index.html — NÃO instalar via npm)
- Sem backend ainda (paywall simulado — integração PIX será feita depois)
- Deploy alvo: Vercel ou Netlify

## Estrutura atual

```
mindcode-project/
├── index.html          ← jsPDF CDN aqui
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── App.jsx         ← todo o app em um único componente
```

## O que já está pronto (NÃO alterar sem instrução)

- 16 perfis completos com dados ricos (base teórica, forças, sombras, etc.)
- 8 perguntas do teste
- Algoritmo de cálculo de perfil
- 5 telas: intro → nome → teste → preview (paywall) → resultado
- Função `gerarPDF()` que usa `window.jspdf` (CDN)
- Design dark premium com Orbs de luz, tipografia serif italiana

## Tarefa principal desta sessão

**Integrar a função `gerarPDF` corretamente para funcionar em ambiente Vite.**

O problema: `window.jspdf` é carregado via CDN no `index.html`.
No desenvolvimento com Vite isso funciona, mas pode haver timing issues.

### O que fazer:

1. **Verificar** se `window.jspdf` está disponível antes de chamar `gerarPDF`
2. **Adicionar fallback** caso o CDN não carregue (mostrar mensagem ao usuário)
3. **Testar** que o PDF gera corretamente com nome personalizado
4. **Validar** que o arquivo salvo tem o nome correto:
   `MindCode_[NomePerfil]_[NomeUsuario].pdf`

### Código da função gerarPDF (já em App.jsx):

```js
async function gerarPDF(perfil, perfilKey, nome) {
  const { jsPDF } = window.jspdf;
  // ... gera PDF de 5 páginas com design dark
  doc.save(`MindCode_${perfil.nome.replace(/\s/g,"_")}_${(nome||"perfil").replace(/\s/g,"_")}.pdf`);
}
```

### Botão de download (tela resultado):

```jsx
<button onClick={baixarPDF} disabled={gerando}>
  {gerando ? "Gerando PDF..." : "⬇  Baixar PDF Personalizado"}
</button>
```

## Tarefas secundárias (se houver tempo)

- [ ] Extrair os dados dos perfis para `src/data/profiles.js`
- [ ] Extrair as perguntas para `src/data/questions.js`
- [ ] Separar `gerarPDF` para `src/utils/gerarPDF.js`
- [ ] Adicionar `src/index.css` com reset e font-face se necessário

## Padrões de código

- Componentes funcionais com hooks
- Inline styles (padrão atual do projeto — manter consistência)
- Sem CSS modules, sem styled-components
- Sem TypeScript por enquanto
- Comentários em português

## Como rodar

```bash
npm install
npm run dev
```

## Observações importantes

- O jsPDF está em `window.jspdf` (minúsculo), não `window.jsPDF`
- A função `gerarPDF` é async mas o jsPDF é síncrono — o await é para comportamento futuro
- Os perfis usam hex colors — a função `hex2rgb` converte para uso no jsPDF
- O PDF tem fundo escuro (#060409) — isso é intencional e parte do design

## Próximos passos após esta sessão

1. Integrar pagamento PIX real (Mercado Pago ou Pagar.me)
2. Webhook de confirmação de pagamento antes de liberar resultado
3. Captura de email após pagamento para lista de leads
4. Deploy na Vercel com domínio próprio
