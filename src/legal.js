// Conteúdo legal do MindCode (Termos, Privacidade/LGPD, Cookies, Reembolso).
// Renderizado por telas discretas no App.jsx. Revise com apoio jurídico e
// preencha os campos [PREENCHER: ...] antes de operar comercialmente.

export const EMPRESA = {
  nome: "MindCode",
  responsavel: "[PREENCHER: nome completo ou razão social do responsável]",
  documento: "[PREENCHER: CPF ou CNPJ]",
  email: "contato@mindcode.app", // [PREENCHER/confirmar: e-mail oficial de contato]
  site: "https://mindcode.web.app",
  preco: "R$ 19,90",
  atualizado: "julho de 2026",
};

const E = EMPRESA;

export const LEGAL = {
  termos: {
    titulo: "Termos de Uso",
    intro: `Ao acessar e utilizar o ${E.nome} (${E.site}), você concorda com estes Termos de Uso. Leia com atenção. Se não concordar, não utilize o serviço.`,
    secoes: [
      { h: "1. O que é o MindCode", p: [
        `O ${E.nome} é uma ferramenta digital de autoconhecimento que, a partir de um questionário, identifica um entre diversos perfis que combinam temperamento e inteligência dominante, e disponibiliza um relatório personalizado.`,
        "O teste e a prévia do perfil são gratuitos. O relatório completo, incluindo o PDF personalizado, é um produto digital pago." ] },
      { h: "2. Natureza do conteúdo", p: [
        "O conteúdo do MindCode tem finalidade educativa e de autoconhecimento. Não constitui diagnóstico, aconselhamento ou tratamento psicológico, médico, terapêutico ou profissional de qualquer natureza, e não substitui o acompanhamento de profissionais habilitados.",
        "As descrições de perfil são interpretações gerais e não devem ser usadas como base única para decisões importantes." ] },
      { h: "3. Cadastro e informações fornecidas", p: [
        "Para receber o relatório, você informa um e-mail e, opcionalmente, um nome. Você é responsável pela veracidade e pela atualização dos dados fornecidos.",
        "O tratamento de dados pessoais segue a nossa Política de Privacidade." ] },
      { h: "4. Preço e pagamento", p: [
        `O relatório completo custa ${E.preco}, em pagamento único (sem assinatura ou cobrança recorrente).`,
        "Os pagamentos são processados pelo Mercado Pago (PIX ou cartão de crédito). O MindCode não coleta nem armazena os dados do seu cartão — eles são tratados diretamente pelo processador de pagamento." ] },
      { h: "5. Entrega e acesso", p: [
        "Após a confirmação do pagamento, o relatório completo é liberado imediatamente na tela, e é disponibilizado um link de acesso durável para você reabri-lo quando quiser.",
        "É sua responsabilidade guardar o link de acesso. Recomendamos salvá-lo." ] },
      { h: "6. Direito de arrependimento e reembolso", p: [
        "Você pode solicitar o cancelamento e o reembolso em até 7 (sete) dias corridos a contar da compra, conforme o art. 49 do Código de Defesa do Consumidor. Consulte a Política de Reembolso para saber como solicitar." ] },
      { h: "7. Propriedade intelectual", p: [
        `Todo o conteúdo do ${E.nome} — textos, relatórios, marca, layout e código — é protegido por direitos autorais e de propriedade intelectual. O relatório adquirido é para uso pessoal; é vedada a revenda, redistribuição ou reprodução comercial sem autorização.` ] },
      { h: "8. Uso permitido", p: [
        "Você concorda em não utilizar o serviço para fins ilícitos, não tentar burlar o pagamento, não acessar áreas restritas sem autorização e não interferir no funcionamento da plataforma." ] },
      { h: "9. Limitação de responsabilidade", p: [
        `Na máxima extensão permitida pela lei, o ${E.nome} não se responsabiliza por decisões tomadas com base no conteúdo, nem por indisponibilidades temporárias, falhas de terceiros (como processador de pagamento ou provedores de hospedagem) ou eventos fora de seu controle razoável.` ] },
      { h: "10. Alterações", p: [
        "Estes Termos podem ser atualizados a qualquer momento. A versão vigente é sempre a publicada nesta página, com a data de atualização indicada." ] },
      { h: "11. Legislação e foro", p: [
        "Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro do domicílio do consumidor para dirimir eventuais controvérsias, conforme o Código de Defesa do Consumidor." ] },
    ],
  },

  privacidade: {
    titulo: "Política de Privacidade",
    intro: `Esta Política explica como o ${E.nome} trata seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD). Ao usar o serviço, você declara estar ciente desta Política.`,
    secoes: [
      { h: "1. Dados que coletamos", p: ["Coletamos apenas o necessário para prestar o serviço:"], list: [
        "Dados de identificação: e-mail e, opcionalmente, nome que você informa.",
        "Respostas do questionário e o perfil resultante.",
        "Dados de pagamento: processados pelo Mercado Pago. Não coletamos nem armazenamos números de cartão. Guardamos apenas informações não sensíveis da transação (status, valor, identificador).",
        "Dados técnicos e de navegação: coletados de forma agregada por ferramentas de análise (ex.: páginas acessadas, tipo de dispositivo).",
      ] },
      { h: "2. Para que usamos", p: ["Utilizamos seus dados para:"], list: [
        "Processar o pagamento e liberar o relatório adquirido.",
        "Disponibilizar o acesso ao relatório e dar suporte.",
        "Emitir comprovantes e cumprir obrigações legais.",
        "Melhorar a experiência e a segurança do serviço.",
      ] },
      { h: "3. Base legal (LGPD, art. 7º)", p: [
        "Tratamos seus dados com base na execução do contrato (entrega do produto que você comprou), no cumprimento de obrigações legais, no seu consentimento (quando aplicável) e no legítimo interesse para segurança e melhoria do serviço." ] },
      { h: "4. Compartilhamento", p: ["Não vendemos seus dados. Compartilhamos o mínimo necessário com:"], list: [
        "Mercado Pago — para processar o pagamento.",
        "Google / Firebase — para hospedagem, banco de dados e análise de uso.",
        "Autoridades — quando exigido por lei ou ordem judicial.",
      ] },
      { h: "5. Transferência internacional", p: [
        "Alguns fornecedores (como Google/Firebase) podem processar dados em servidores fora do Brasil. Nesses casos, adotam-se salvaguardas compatíveis com a LGPD." ] },
      { h: "6. Retenção", p: [
        "Mantemos os dados pelo tempo necessário às finalidades acima e ao cumprimento de obrigações legais (por exemplo, registros fiscais). Depois disso, os dados são eliminados ou anonimizados." ] },
      { h: "7. Segurança", p: [
        "Adotamos medidas técnicas e organizacionais para proteger seus dados, como conexões criptografadas (HTTPS/TLS), separação de dados pessoais e acesso restrito. Nenhum sistema é 100% infalível, mas trabalhamos para reduzir riscos." ] },
      { h: "8. Seus direitos (LGPD, art. 18)", p: ["Você pode, a qualquer momento, solicitar:"], list: [
        "Confirmação e acesso aos seus dados.",
        "Correção de dados incompletos ou desatualizados.",
        "Anonimização, bloqueio ou eliminação de dados desnecessários.",
        "Portabilidade e informação sobre compartilhamentos.",
        "Revogação do consentimento.",
      ], pFim: [`Para exercer seus direitos, escreva para ${E.email}.`] },
      { h: "9. Cookies", p: [
        "Utilizamos cookies e tecnologias semelhantes. Consulte a Política de Cookies para detalhes e formas de gerenciamento." ] },
      { h: "10. Crianças e adolescentes", p: [
        "O serviço não é direcionado a menores de 18 anos. Não coletamos intencionalmente dados de menores sem o consentimento dos responsáveis." ] },
      { h: "11. Encarregado e contato", p: [
        `Responsável pelo tratamento: ${E.responsavel} (${E.documento}). Dúvidas ou solicitações sobre privacidade: ${E.email}.` ] },
      { h: "12. Alterações", p: [
        "Esta Política pode ser atualizada. A versão vigente é a publicada nesta página, com a data de atualização indicada." ] },
    ],
  },

  cookies: {
    titulo: "Política de Cookies",
    intro: "Esta página explica como o MindCode usa cookies e tecnologias de armazenamento local, e como você pode gerenciá-los.",
    secoes: [
      { h: "1. O que são cookies", p: [
        "Cookies e armazenamentos locais (localStorage) são pequenos arquivos guardados no seu navegador para lembrar preferências e permitir o funcionamento do serviço." ] },
      { h: "2. Cookies que utilizamos", p: ["Usamos apenas o essencial e a análise de uso:"], list: [
        "Essenciais/funcionais: guardam sua preferência de tema (claro/escuro) e o seu acesso ao relatório pago (para você não perdê-lo ao recarregar a página). Sem eles, o serviço não funciona corretamente.",
        "Analíticos: ferramentas do Google/Firebase que nos ajudam a entender, de forma agregada, como o serviço é usado.",
        "Pagamento: o Mercado Pago pode utilizar cookies próprios durante o checkout para segurança e prevenção a fraudes.",
      ] },
      { h: "3. O que NÃO usamos", p: [
        "Não utilizamos cookies de publicidade comportamental de terceiros para te perseguir com anúncios." ] },
      { h: "4. Como gerenciar", p: [
        "Você pode apagar ou bloquear cookies nas configurações do seu navegador. Note que desativar os cookies essenciais pode impedir o acesso ao relatório e outras funções." ] },
      { h: "5. Alterações", p: [
        "Esta Política pode ser atualizada. A versão vigente é a publicada nesta página." ] },
    ],
  },

  reembolso: {
    titulo: "Política de Reembolso",
    intro: "Sua satisfação e seus direitos como consumidor são respeitados.",
    secoes: [
      { h: "Direito de arrependimento (7 dias)", p: [
        "Conforme o art. 49 do Código de Defesa do Consumidor, você pode desistir da compra em até 7 (sete) dias corridos a partir da data do pagamento e solicitar o reembolso integral." ] },
      { h: "Como solicitar", p: [
        `Basta enviar um e-mail para ${E.email} com o assunto “Reembolso”, informando o e-mail usado na compra. Não é necessário justificar.` ] },
      { h: "Prazo do estorno", p: [
        "Após a solicitação dentro do prazo, o estorno é providenciado pelo mesmo meio de pagamento. O prazo de crédito pode variar conforme o Mercado Pago e a operadora do cartão." ] },
    ],
  },
};
