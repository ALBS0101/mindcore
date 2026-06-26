import { useState, useRef } from "react";

/* ─── PERFIS ─────────────────────────────────────────────────────────────── */
const profiles = {
  "Colérico-Lógica": {
    nome: "O Estrategista", emoji: "♟️", cor: "#C0392B",
    frase: "Você não joga para participar. Você joga para dominar.",
    resumo: "Mente rápida, foco cirúrgico e tolerância zero para ineficiência. Você resolve problemas antes de a maioria perceber que existem.",
    base: {
      arquetipo: "O temperamento Colérico é movido por resultado, controle e velocidade. Pessoas com esse arquétipo têm alta energia direcional — não desperdiçam movimento. São assertivas, determinadas e raramente esperam permissão para agir. O lado difícil: a mesma intensidade que os torna eficazes pode torná-los intransigentes quando a situação pede flexibilidade.",
      inteligencia: "A Inteligência Lógico-Matemática, descrita por Howard Gardner, é a capacidade de raciocinar abstratamente, reconhecer padrões, construir sistemas e resolver problemas de forma estruturada. Não se limita à matemática — manifesta-se em qualquer domínio onde causalidade, lógica e estrutura importam: direito, estratégia, tecnologia, ciência.",
      combinacao: "Quando o impulso colérico encontra a mente lógica, o resultado é alguém que não apenas enxerga o caminho — enxerga o caminho mais curto, mais eficiente e mais difícil de rebater. Você não age por instinto puro nem analisa por prazer acadêmico. Age porque analisou, e analisa para agir. Essa é a combinação mais orientada a resultado da matriz."
    },
    descricao: "Sua mente é uma máquina de xadrez em tempo real. Enquanto outros ainda estão entendendo o problema, você já calculou três soluções e descartou duas. Essa combinação de temperamento colérico com inteligência lógica cria líderes que assustam — não pelo volume, mas pela precisão. Você não precisa gritar para ser ouvido. Sua clareza já é uma forma de autoridade.",
    descricao2: "O que diferencia O Estrategista de outros perfis lógicos é a urgência. Você não analisa por prazer — analisa para agir. Cada dado que coleta serve a um plano. Cada plano serve a um resultado. Você pensa em sistemas, em causas e efeitos, em movimentos de três etapas à frente. Isso te torna valioso em ambientes complexos — e, às vezes, solitário em ambientes que preferem improvisar.",
    forcas: ["Toma decisões rápidas e acertadas mesmo sob pressão extrema","Enxerga padrões e inconsistências que outros simplesmente ignoram","Executa com disciplina — planeja e entrega, raramente ao contrário","Transforma complexidade em planos claros e acionáveis","Alta resiliência emocional em crises — o caos te ativa, não te paralisa"],
    sombra: ["Pode ser frio demais em situações que pedem empatia antes de solução","Subestima quem processa o mundo de forma diferente da sua","Dificuldade em delegar — ninguém parece tão competente quanto você","A necessidade de estar certo pode fechar portas importantes","Impaciente com processos que considera lentos ou ineficientes"],
    sobrePressao: "Sob pressão você se torna mais afiado, não mais ansioso. Isola o ruído, identifica a variável crítica e age. Isso pode parecer insensibilidade para quem está ao redor — mas para você é apenas eficiência. O problema surge quando a pressão é emocional: seu instinto de racionalizar o que deveria sentir pode gerar distância em momentos que pedem presença.",
    pontosCegos: "Você assume que lógica é universal. Não é. Pessoas não são equações. Sua maior vulnerabilidade é a crença de que se você explicar melhor, todos vão concordar. Às vezes as pessoas não discordam da sua lógica — discordam de você. E isso é algo que a lógica sozinha não resolve.",
    relacoes: "Nos relacionamentos você é leal e confiável, mas não é fácil de ser amado. Sua intensidade pode ser confundida com arrogância. Você cuida de formas práticas — resolve problemas, oferece soluções — mas raramente demonstra afeto de formas que a outra pessoa consegue reconhecer. Aprenda a perguntar o que a outra pessoa precisa antes de oferecer o que você acha que ela precisa.",
    carreiras: ["Estratégia de negócios","Engenharia de sistemas","Análise de dados","Direito corporativo","Liderança executiva","Consultoria de gestão"],
    fatoCurioso: "Estrategistas com seu perfil frequentemente relatam que se sentem mais calmos em crises do que em situações de rotina. A urgência ativa algo em você que a normalidade entorpece. Você não foi feito para a manutenção — foi feito para a virada.",
    afirmacao: "Sua maior força é também seu maior risco: você consegue ir sozinho. Mas os resultados que mais vão te satisfazer na vida vão exigir que você leve pessoas junto."
  },
  "Colérico-Interpessoal": {
    nome: "O Líder", emoji: "👑", cor: "#E67E22",
    frase: "Você não segue movimento. Você cria um.",
    resumo: "Magnético, direto e movido por impacto. Você sabe como fazer as pessoas se moverem — e raramente precisa pedir.",
    base: {
      arquetipo: "O Colérico é o arquétipo da ação e da liderança. Tem clareza de propósito, alta tolerância ao conflito quando necessário e uma tendência natural de assumir o controle em situações ambíguas. Não é necessariamente agressivo — é determinado. A diferença pode ser sutil para quem está de fora, mas é fundamental para quem o conhece de perto.",
      inteligencia: "A Inteligência Interpessoal, na teoria de Gardner, é a capacidade de compreender os outros — suas motivações, emoções, intenções e padrões de comportamento. Não é simpatia superficial: é leitura profunda de pessoas. Quem tem essa inteligência dominante navega dinâmicas sociais complexas com naturalidade e consegue adaptar sua abordagem a diferentes perfis.",
      combinacao: "Colérico com inteligência interpessoal é a combinação mais poderosa para liderança de pessoas. Você tem o impulso de agir e o mapa de como cada pessoa responde. Isso cria um perfil que move grupos com precisão cirúrgica — sabendo quando pressionar, quando recuar, quando inspirar e quando exigir. O risco é usar esse talento sem consciência ética."
    },
    descricao: "Você tem a rara combinação de querer o controle e saber como fazer as pessoas quererem te dar esse controle. Não é manipulação — é magnetismo com propósito. Líderes do seu perfil mudam ambientes só de entrar neles.",
    descricao2: "O que distingue O Líder de outros perfis interpessoais é a orientação para resultado. Você não constrói relacionamentos por prazer social — você os constrói porque entende que pessoas são o recurso mais valioso de qualquer projeto. Você lê dinâmicas de grupo com precisão cirúrgica.",
    forcas: ["Mobiliza grupos em direção a objetivos com naturalidade e velocidade","Lê dinâmicas de poder e motivação com precisão","Cria senso de urgência e direção onde havia estagnação","Inspira lealdade sem precisar pedir","Alta capacidade de identificar e ativar o potencial das pessoas"],
    sombra: ["Pode usar influência social para desviar de responsabilidades","Intolerância com quem tem ritmo diferente do seu","Confunde concordância com lealdade","Necessidade de admiração pode distorcer decisões","Pode liderar sem ouvir — e chamar isso de visão"],
    sobrePressao: "Em crise, você assume o comando naturalmente — às vezes sem que alguém tenha pedido. Isso funciona em 70% das situações. Nos outros 30%, gera ressentimento silencioso de quem estava pronto para liderar mas não teve espaço.",
    pontosCegos: "Você sabe influenciar, mas raramente sabe quando parar. Nem todo problema precisa do seu comando. Às vezes as pessoas ao seu redor só precisam ser ouvidas — não lideradas.",
    relacoes: "Você é intenso e presente nos relacionamentos — quando está, está de verdade. O problema é que sua mente está sempre em algum próximo objetivo, e as pessoas próximas percebem quando são tratadas como mais um item da lista.",
    carreiras: ["Gestão de equipes","Política e relações públicas","Vendas complexas","Empreendedorismo","Treinamento e desenvolvimento","Liderança comunitária"],
    fatoCurioso: "Pessoas com seu perfil frequentemente são lembradas por quem as conheceu por apenas alguns minutos. Você deixa impressão — mas raramente sabe que deixou.",
    afirmacao: "Você tem o dom de mover pessoas. Use isso com responsabilidade — porque o impacto que você causa raramente é neutro."
  },
  "Colérico-Linguística": {
    nome: "O Orador", emoji: "🎯", cor: "#8E44AD",
    frase: "Suas palavras não informam. Elas movem.",
    resumo: "Você pensa rápido, fala com intenção e raramente sai de uma conversa sem ter mudado algo.",
    base: {
      arquetipo: "O Colérico é orientado por resultado e tem baixa tolerância para ambiguidade ou passividade. Age com velocidade, fala com convicção e tem dificuldade em se conter quando vê algo errado ou ineficiente. Essa energia, quando disciplinada, torna-se presença — a qualidade que faz pessoas pararem o que estão fazendo quando você entra em uma sala.",
      inteligencia: "A Inteligência Linguística é a capacidade de usar a linguagem com precisão e impacto — tanto oral quanto escrita. Vai além de saber se expressar: é sentir o peso de cada palavra, entender o efeito de uma pausa, saber o momento exato em que uma frase vai mudar o estado mental de quem ouve. Escritores, advogados, comunicadores e líderes carismáticos frequentemente têm essa inteligência como dominante.",
      combinacao: "Colérico com inteligência linguística produz o comunicador mais perigoso da matriz — no melhor sentido. Você não apenas tem algo a dizer: tem urgência para dizer e precisão para dizer bem. A combinação transforma palavras em instrumentos de mudança. O risco é quando essa habilidade é usada para vencer discussões em vez de construir entendimento."
    },
    descricao: "Você pensa rápido e fala com intenção. Cada frase tem destino. Combinando a intensidade do temperamento colérico com domínio natural da linguagem, você tem o perfil mais persuasivo da matriz.",
    descricao2: "O que torna O Orador único não é apenas o talento verbal — é a combinação de clareza com urgência. Você não fala para preencher silêncio. Fala para mudar estados mentais. Em negociações, apresentações ou conflitos, você raramente sai do lugar onde entrou.",
    forcas: ["Argumentação precisa e estruturada, difícil de rebater","Capacidade de simplificar o complexo sem perder profundidade","Presença vocal que naturalmente comanda atenção","Escreve e fala com igual impacto","Identifica o argumento central de qualquer posição com velocidade"],
    sombra: ["Pode usar palavras como arma em conflitos emocionais","Dificuldade genuína em ouvir quando já formou sua opinião","Impaciente com quem se expressa mal","Pode confundir eloquência com ter razão","Tendência a transformar toda conversa em debate"],
    sobrePressao: "Sob pressão você fica mais verbal, não menos. Isso pode ser poderoso em negociações e desastroso em conflitos íntimos, onde a outra pessoa precisava de silêncio e presença, não de argumentos perfeitos.",
    pontosCegos: "Sua maior ilusão é achar que se comunicar bem significa ser compreendido. Você pode estar sendo claríssimo e completamente incompreendido — porque o problema nunca foi a mensagem. Foi a relação.",
    relacoes: "Você é estimulante como parceiro — raramente entediante. Mas sua intensidade verbal pode fazer as pessoas sentirem que precisam estar sempre prontas para um debate. Aprenda a conversar sem precisar ter a última palavra.",
    carreiras: ["Advocacia","Jornalismo investigativo","Marketing e copywriting","Liderança política","Educação e treinamento","Negociação e mediação"],
    fatoCurioso: "Oradores do seu perfil raramente precisam elevar o tom para intimidar. O silêncio estratégico entre frases é sua arma mais subestimada — e a mais poderosa.",
    afirmacao: "Você tem o dom de dar forma ao pensamento. Mas as palavras mais importantes que você vai dizer na vida provavelmente serão três: 'eu estava errado'."
  },
  "Colérico-Criativa": {
    nome: "O Visionário", emoji: "🔥", cor: "#E74C3C",
    frase: "Você não pensa fora da caixa. Você não sabe que a caixa existe.",
    resumo: "Ideias que chegam com plano de execução. Energia que contamina. Impaciência com o ordinário.",
    base: {
      arquetipo: "O Colérico não aceita o status quo como resposta. Tem tolerância baixa para 'sempre foi assim' e energia para confrontar o estabelecido. Essa característica, combinada com visão de futuro, é a raiz de quase toda disrupção significativa — em negócios, arte, ciência ou política.",
      inteligencia: "A Inteligência Criativa — baseada nos estudos de inteligência espacial e criativa de Gardner e expandida por pesquisas contemporâneas — é a capacidade de gerar conexões inéditas, visualizar possibilidades ainda não existentes e produzir soluções que outros não imaginaram. Não é apenas 'ser criativo' no sentido artístico: é pensar em possibilidades onde outros veem impossibilidades.",
      combinacao: "Colérico com inteligência criativa é a combinação mais propensa a criar algo que não existia antes. A urgência colérica impede que as ideias morram na gaveta; a mente criativa garante que as soluções sejam originais. O resultado é um perfil que não apenas sonha — executa. O desafio é que essa combinação pode produzir mais inícios brilhantes do que finais sólidos."
    },
    descricao: "Criatividade sem urgência é devaneio. Urgência sem criatividade é brutalidade. Você tem os dois. O Visionário colérico não espera inspiração — ele a força. E quando a ideia chega, ela chega com plano de execução junto.",
    descricao2: "Você não cria para expressar — cria para mudar. Há uma orientação pragmática na sua criatividade que a maioria dos perfis criativos não tem. Você quer que a ideia funcione no mundo real, não apenas na sua cabeça.",
    forcas: ["Gera ideias originais e já visualiza o caminho para realizá-las","Alta tolerância ao risco criativo","Cria tendências em vez de seguir","Energia que contamina equipes com entusiasmo genuíno","Velocidade de ideação que deixa a concorrência atrás"],
    sombra: ["Abandona projetos quando a parte difícil começa","Pode atropelar colaboradores criativos","Superestima a própria visão antes de testar com a realidade","Tédio com execução de detalhes","Pode tratar críticas à ideia como ataques pessoais"],
    sobrePressao: "Pressão ativa sua criatividade de forma peculiar. Você produz melhor com deadline do que com liberdade total. O paradoxo é que você odeia restrições — mas é nelas que você brilha.",
    pontosCegos: "Nem toda ideia revolucionária sua é revolucionária. Às vezes é só diferente. E diferente sem utilidade é excentricidade, não visão. Aprenda a distinguir os dois.",
    relacoes: "Você é arrebatador no início dos relacionamentos. O desafio é a manutenção. Quando a novidade passa, sua atenção migra para o próximo estímulo.",
    carreiras: ["Empreendedorismo disruptivo","Direção criativa","Arquitetura e design","Inovação e P&D","Produção audiovisual","Marketing de produto"],
    fatoCurioso: "Visionários do seu perfil frequentemente têm suas melhores ideias em situações inapropriadas — reuniões chatas, 3h da manhã, trânsito. Seu cérebro cria quando o ambiente não pede.",
    afirmacao: "Você tem visão suficiente para mudar algo. O que vai determinar se vai ou não é sua capacidade de sobreviver à fase chata do meio."
  },
  "Fleumático-Lógica": {
    nome: "O Analista", emoji: "🔬", cor: "#2980B9",
    frase: "Você não age rápido. Age certo.",
    resumo: "Profundidade, consistência e precisão. Você é o tipo de pessoa que entrega o que promete — sempre.",
    base: {
      arquetipo: "O Fleumático é o arquétipo da estabilidade e da consistência. Não reage de forma impulsiva, não se deixa levar por emoções do momento e tem uma paciência que outros perfis simplesmente não conseguem sustentar. É o temperamento mais confiável da matriz — o que raramente surpreende negativamente, mas frequentemente surpreende positivamente.",
      inteligencia: "A Inteligência Lógico-Matemática é o talento para identificar padrões, construir sistemas de raciocínio e resolver problemas com estrutura. Não é restrita a números — aparece em qualquer situação que exige análise causal, pensamento sistemático ou avaliação de evidências. É a inteligência de quem precisa entender o porquê antes de agir.",
      combinacao: "Fleumático com inteligência lógica cria o analista mais completo da matriz: calmo o suficiente para não distorcer dados com emoção, e rigoroso o suficiente para não aceitar conclusões rasas. Você não tem pressa para chegar — e isso é uma vantagem real em um mundo que confunde velocidade com competência. Sua análise tem peso porque você esperou ter certeza antes de falar."
    },
    descricao: "Em um mundo que confunde velocidade com competência, você é o antídoto. O Analista fleumático-lógico é a combinação mais confiável da matriz — não o mais brilhante na superfície, mas o mais sólido nas profundezas.",
    descricao2: "Sua força não é a velocidade — é a consistência. Enquanto perfis mais intensos chegam mais rápido ao destino errado, você chega mais devagar ao certo. Em contextos que exigem profundidade real, seu perfil gera resultados que outros não conseguem replicar.",
    forcas: ["Análise profunda sem perder objetividade","Alta tolerância a processos complexos e tecnicamente densos","Pouco influenciado por pressão emocional nas decisões","Memória analítica excepcional","Confiabilidade que raramente decepciona"],
    sombra: ["Paralisia por análise — às vezes o perfeito é inimigo do bom","Dificuldade em comunicar conclusões com urgência","Pode parecer indiferente quando está apenas processando","Subutiliza intuição porque não consegue justificá-la","Resistência a mudanças não suficientemente analisadas"],
    sobrePressao: "Pressão te lentifica antes de te acelerar. Você precisa de um momento para recalibrar — e esse momento pode parecer fraqueza para quem não te conhece. Mas quem te conhece sabe que vale esperar.",
    pontosCegos: "Você coleta dados até ter certeza. Mas certeza total raramente existe. Há decisões em que a janela certa vale mais que a análise perfeita. Aprender a identificar qual é qual é sua tarefa mais importante.",
    relacoes: "Você é um parceiro estável, leal e de baixa dramaturgia. O desafio é que sua estabilidade pode ser confundida com falta de entusiasmo. Demonstre o que sente — não apenas o que pensa.",
    carreiras: ["Ciência de dados","Engenharia","Medicina diagnóstica","Pesquisa acadêmica","Auditoria e compliance","Arquitetura de sistemas"],
    fatoCurioso: "Analistas do seu perfil frequentemente resolvem problemas enquanto dormem. Seu cérebro continua processando mesmo quando você acha que parou. As melhores soluções chegam depois de largar o problema.",
    afirmacao: "Sua consistência é um superpoder subestimado. Em um mundo de pessoas que prometem muito e entregam pouco, você é o oposto — e isso tem valor imenso."
  },
  "Fleumático-Interpessoal": {
    nome: "O Mediador", emoji: "⚖️", cor: "#27AE60",
    frase: "Você não resolve conflitos. Você dissolve.",
    resumo: "O perfil mais necessário em qualquer grupo — e o mais subestimado. Você cria paz sem parecer que está tentando.",
    base: {
      arquetipo: "O Fleumático tem uma qualidade rara: não precisa vencer. Consegue ouvir posições opostas sem se sentir ameaçado, sustentar neutralidade sem perder opinião própria, e estar presente em conflitos sem ser consumido por eles. Essa estabilidade emocional é o que torna o Fleumático o arquétipo mais valorizado em ambientes de alta tensão interpessoal.",
      inteligencia: "A Inteligência Interpessoal é a capacidade de ler, compreender e se conectar com outras pessoas em profundidade. Não é apenas simpatia ou carisma — é percepção. Pessoas com essa inteligência dominante entendem o que está por trás do que é dito, percebem dinâmicas não-verbais e conseguem criar segurança emocional para que outros se abram.",
      combinacao: "Fleumático com inteligência interpessoal é a combinação que cria os melhores mediadores, terapeutas e líderes de harmonia. A calma do temperamento impede que a empatia vire fusão emocional; a inteligência interpessoal garante que a neutralidade não vire indiferença. Você consegue estar totalmente presente sem perder o chão — e isso é extraordinariamente raro."
    },
    descricao: "Há um talento raro em fazer com que duas pessoas em lados opostos saiam de uma conversa sentindo que foram compreendidas. Você tem esse talento. O Mediador fleumático-interpessoal é o perfil mais necessário em qualquer grupo.",
    descricao2: "Você não apenas resolve conflitos — você previne a maioria deles antes de começarem. Há algo na sua presença que reduz a temperatura das salas. Quando a tensão explode, você é a pessoa que todo mundo procura.",
    forcas: ["Lê emoções alheias sem ser absorvido por elas","Cria ambientes onde as pessoas se abrem com facilidade","Alta tolerância a posições contrárias sem perder equilíbrio","Constrói pontes entre perfis opostos","Presença que reduz ansiedade coletiva sem esforço aparente"],
    sombra: ["Evita conflito mesmo quando seria necessário e saudável","Cede posição própria para manter harmonia — e ressente depois","Dificuldade genuína em dizer não sem culpa","Às vezes tão neutro que parece não ter opinião","Pode proteger dinâmicas disfuncionais ao dissolver tensões que deveriam explodir"],
    sobrePressao: "Sob pressão você absorve a tensão ao redor como esponja. Isso te torna valioso para o grupo mas caro para você mesmo. Você processa por dentro o que os outros externalizam — e raramente alguém percebe quanto você carrega.",
    pontosCegos: "Mediação excessiva pode proteger dinâmicas disfuncionais. Ao dissolver conflitos antes do nó real, você às vezes prolonga problemas que precisavam explodir para serem resolvidos.",
    relacoes: "Você é o parceiro que as pessoas percebem que precisavam depois que te perdem. O risco é você se perder na função de suporte e esquecer suas próprias necessidades.",
    carreiras: ["Recursos humanos","Psicologia e terapia","Diplomacia","Gestão de comunidades","Liderança em ONGs","Facilitação e treinamento"],
    fatoCurioso: "Pessoas com seu perfil são frequentemente procuradas por amigos em crise — mesmo quando vocês não se falam há meses. Você emite algo que faz as pessoas sentirem que podem ser honestas.",
    afirmacao: "Você cuida do mundo ao seu redor com consistência e silêncio. Certifique-se de que alguém esteja fazendo o mesmo por você."
  },
  "Fleumático-Linguística": {
    nome: "O Escritor", emoji: "✍️", cor: "#16A085",
    frase: "Você pensa em camadas. Escreve em pontes.",
    resumo: "Profundidade rara e precisão ainda mais rara. Você diz o que outros sentem mas não conseguem articular.",
    base: {
      arquetipo: "O Fleumático processa antes de falar. Não reage — responde. Essa capacidade de pausar, observar e formular com cuidado é rara e frequentemente subestimada em um mundo que valoriza velocidade de resposta acima de profundidade de pensamento. É o arquétipo de quem deixa marcas através da consistência, não do espetáculo.",
      inteligencia: "A Inteligência Linguística é sensibilidade à linguagem em todos os seus níveis: ritmo, estrutura, ambiguidade, precisão, metáfora. Pessoas com essa inteligência dominante não apenas escrevem bem — pensam em linguagem. Para elas, encontrar a palavra exata não é opcional: é uma necessidade cognitiva.",
      combinacao: "Fleumático com inteligência linguística cria o comunicador mais reflexivo da matriz. Você não fala por falar — e quando fala, foi porque tinha algo real a dizer. Essa combinação produz escrita e comunicação com peso específico: cada palavra foi escolhida, cada frase teve intenção. O resultado é uma voz que as pessoas tendem a voltar para ouvir."
    },
    descricao: "Enquanto outros falam para serem ouvidos, você escreve para ser entendido — há uma diferença enorme. O Escritor fleumático-linguístico tem profundidade rara: paciência para desenvolver ideias e precisão para expressá-las sem ruído.",
    descricao2: "Você tem um dom específico: consegue dar forma a experiências humanas que resistem à linguagem ordinária. Quando você encontra a frase certa para algo que parecia inexprimível, cria um momento de reconhecimento em quem lê.",
    forcas: ["Comunicação escrita de qualidade e clareza excepcionais","Capacidade de capturar nuance sem perder acessibilidade","Processa emoções através da linguagem com maestria","Cria conteúdo com consistência e profundidade","Lê subtext em comunicações alheias que a maioria ignora"],
    sombra: ["Usa escrita como substituto para conversas difíceis","Perfeccionismo linguístico que atrasa publicação e entrega","Subestima comunicação oral em contextos que pedem presença","Introspecção excessiva que paralisa mais do que ilumina","Pode criar distância emocional usando palavras como escudo"],
    sobrePressao: "Pressão tira sua melhor escrita. Você funciona melhor com espaço para processar. Deadlines curtos produzem ansiedade, não qualidade.",
    pontosCegos: "Você acredita que se escrever bem o suficiente, vai ser compreendido. Mas nem todos leem com a mesma profundidade com que você escreve. Às vezes você precisa falar — imperfeitamente, ao vivo.",
    relacoes: "Você se comunica com profundidade e cuidado — mas muitas vezes por escrito, quando a outra pessoa precisava de sua presença. Mensagens longas e bem escritas não substituem presença.",
    carreiras: ["Jornalismo e literatura","Comunicação corporativa","Roteirismo","Pedagogia","UX Writing","Consultoria de conteúdo"],
    fatoCurioso: "Escritores do seu perfil têm diários ou arquivos de notas que nunca mostram a ninguém. Você processa o mundo escrevendo antes de viver — e esses textos privados são frequentemente os mais honestos.",
    afirmacao: "Você tem o dom de traduzir o humano em palavras. Use isso — mas não como substituto para viver o que você tão bem descreve."
  },
  "Fleumático-Criativa": {
    nome: "O Inventor", emoji: "💡", cor: "#F39C12",
    frase: "Suas ideias não explodem. Elas crescem.",
    resumo: "Criatividade com raízes. Você desenvolve ideias que funcionam — e duram.",
    base: {
      arquetipo: "O Fleumático tem paciência para o processo longo. Não precisa de validação imediata para continuar, não abandona projetos por falta de entusiasmo externo e sustenta esforço de forma consistente. Essa resistência silenciosa é o combustível de trabalhos que levam anos para chegar ao mundo — e quando chegam, chegam completos.",
      inteligencia: "A Inteligência Criativa é a capacidade de gerar soluções originais e visualizar possibilidades fora dos padrões estabelecidos. Não é apenas imaginação — é a combinação de pensamento divergente com capacidade de síntese. Pessoas com essa inteligência dominante frequentemente enxergam o produto final antes de qualquer esboço existir.",
      combinacao: "Fleumático com inteligência criativa é a combinação mais rara e mais subestimada da matriz. Você tem profundidade criativa sem a instabilidade que frequentemente acompanha perfis altamente criativos. Suas ideias não nascem em explosão — amadurecem. E quando chegam ao mundo, já foram testadas internamente tantas vezes que raramente falham por falta de consistência."
    },
    descricao: "Enquanto visionários coléricos criam com explosão, você cria com raízes. O Inventor fleumático-criativo desenvolve ideias lentamente, profundamente, e quando chegam ao mundo já são sólidas.",
    descricao2: "Sua criatividade tem uma qualidade que a maioria não possui: sustentabilidade. Você não cria em rajadas e depois para. Cria de forma consistente, metódica, construindo camada sobre camada.",
    forcas: ["Desenvolve conceitos com profundidade e sustentabilidade real","Alta tolerância ao processo criativo longo","Criatividade prática: pensa em como funciona, não só em como parece","Consistência criativa independente de humor","Inovação incremental que acumula resultado ao longo do tempo"],
    sombra: ["Refinamento infinito sem lançar — gaveta cheia de quase-projetos","Dificuldade em comunicar o valor das ideias com entusiasmo","Subestimado por não saber se autopromover","Cria para si antes de criar para o mercado","Resistência a lançar antes de estar 'pronto'"],
    sobrePressao: "Pressão não ativa seu melhor — te bloqueia. Você precisa de ambiente seguro para criar. Suas melhores ideias surgem quando você parou de tentar tê-las.",
    pontosCegos: "Uma ideia não executada não existe. Você pode ter o conceito mais sofisticado da sala e ninguém vai saber se não lançar. O lançamento imperfeito supera o eterno refinamento.",
    relacoes: "Você é um parceiro atento e criativo. O risco é que sua introversão criativa pode ser interpretada como desinteresse. Aprenda a verbalizar o que sente, mesmo sem as palavras perfeitas.",
    carreiras: ["Design de produto","Arquitetura","Desenvolvimento de software","Pesquisa e inovação","Artesanato de alto nível","Engenharia criativa"],
    fatoCurioso: "Inventores do seu perfil têm projetos inacabados mais sofisticados que os projetos finalizados de outros. Sua gaveta vale mais do que parece — o problema é que o mundo não consegue ver o que está nela.",
    afirmacao: "Você tem profundidade suficiente para criar algo que dura. O que falta não é talento — é a coragem de lançar antes de estar perfeito."
  },
  "Sanguíneo-Lógica": {
    nome: "O Explorador", emoji: "🧭", cor: "#E91E63",
    frase: "Para você, cada problema é uma aventura disfarçada.",
    resumo: "Curiosidade com método. Você aprende rápido, conecta ideias distantes e raramente fica entediado.",
    base: {
      arquetipo: "O Sanguíneo é o arquétipo da curiosidade e da energia social. Tem alto apetite por novidade, aprende rápido, se adapta facilmente e raramente fica preso em um estado por muito tempo. O risco desse temperamento é a superficialidade — mas quando combinado com inteligência analítica, a amplitude se torna um ativo estratégico.",
      inteligencia: "A Inteligência Lógico-Matemática neste contexto não aparece como o analista introspectivo — aparece como o pensador ágil. Você usa a lógica como ferramenta de exploração, não como destino. Identifica padrões rapidamente, testa hipóteses sem apego e descarta o que não funciona sem culpa.",
      combinacao: "Sanguíneo com inteligência lógica cria o explorador mais metodicamente curioso da matriz. Você tem a energia para entrar em qualquer território e a estrutura mental para não se perder nele. A combinação é rara porque une dois traços que raramente aparecem juntos: abertura total à novidade e capacidade de organizar o que encontra em algo utilizável."
    },
    descricao: "Você tem algo raro: curiosidade com método. A maioria das pessoas é curiosa mas desorganizada, ou organizada mas entediante. Você consegue seguir o fio de uma ideia com entusiasmo genuíno e chegar a algum lugar real.",
    descricao2: "O Explorador não apenas toca em muitos assuntos — os conecta. Enxerga relações entre áreas que parecem não ter nada a ver e cria sínteses que pessoas mais especializadas simplesmente não conseguem fazer.",
    forcas: ["Aborda problemas com energia e abertura genuínas","Conecta áreas de conhecimento aparentemente desconexas","Alta adaptabilidade sem perder raciocínio","Aprende rápido e com prazer","Capacidade de simplificar o complexo para audiências diversas"],
    sombra: ["Perde interesse assim que o problema é resolvido","Pode parecer superficial mesmo quando vai fundo","Dificuldade com tarefas repetitivas sem estímulo","Começa mais projetos do que termina","Distrai-se com o próximo problema antes de entregar o atual"],
    sobrePressao: "Pressão te energiza no curto prazo e te esgota no médio. Você funciona melhor em sprints do que em maratonas.",
    pontosCegos: "Sua energia e inteligência juntas criam uma ilusão: a de que você pode entrar em qualquer área e se virar. Profundidade real exige o que você mais evita — repetição e a parte chata do domínio.",
    relacoes: "Você é estimulante e divertido como parceiro. O risco é que sua necessidade de estímulo pode fazer as pessoas sentirem que precisam ser sempre interessantes para te manter presente.",
    carreiras: ["Consultoria","Jornalismo científico","Empreendedorismo","Pesquisa multidisciplinar","Tecnologia e startups","Inovação e estratégia"],
    fatoCurioso: "Exploradores do seu perfil são a pessoa que 'conhece alguém' em qualquer área. Sua rede é ampla porque sua curiosidade é genuína — e as pessoas sentem isso.",
    afirmacao: "Sua amplitude é um ativo raro. Mas o mundo recompensa profundidade. Encontre o assunto que merece sua lealdade mais longa."
  },
  "Sanguíneo-Interpessoal": {
    nome: "O Conector", emoji: "🌐", cor: "#FF5722",
    frase: "Você não acumula contatos. Acumula histórias de pessoas.",
    resumo: "Você é o motivo pelo qual alguns ambientes funcionam e outros não. Sua presença muda a temperatura de um lugar.",
    base: {
      arquetipo: "O Sanguíneo é naturalmente atraído por pessoas. Ganha energia em interações sociais, cria conexões com facilidade e tem uma abertura genuína que outros percebem como magnética. Não é performance — é constituição. O desafio é que essa abundância social pode dificultar a profundidade quando não há disciplina para cultivá-la.",
      inteligencia: "A Inteligência Interpessoal é a habilidade de ler, entender e se conectar com outras pessoas de forma profunda. Em sua expressão sanguínea, ela aparece não como análise fria de comportamento — mas como presença quente. Você não estuda as pessoas: você as sente.",
      combinacao: "Sanguíneo com inteligência interpessoal é a combinação que cria os maiores conectores humanos. Você tem a energia para iniciar conexões e a inteligência para torná-las significativas. Onde outros veem estranhos, você vê histórias esperando para serem ouvidas. O resultado é uma rede de relacionamentos que não é apenas ampla — é viva."
    },
    descricao: "Você é o motivo pelo qual algumas festas funcionam e outras não. O Conector sanguíneo-interpessoal tem o dom de fazer estranhos se sentirem conhecidos de longa data em quinze minutos.",
    descricao2: "Sua inteligência interpessoal combinada com a energia sanguínea cria conexão que parece espontânea mas é resultado de atenção genuína ao outro. Você lembra detalhes. Você faz perguntas que mostram que estava ouvindo.",
    forcas: ["Cria conexões autênticas em tempo recorde","Alta memória social: lembra detalhes de quem conheceu meses atrás","Transforma ambientes com presença e energia","Ativa o melhor nas pessoas ao redor","Rede de relacionamentos que resolve problemas que dinheiro não resolve"],
    sombra: ["Pode priorizar conexão sobre substância","Dificuldade em manter relacionamentos profundos com tantos superficiais","Evita conflito porque ameaça a harmonia construída","Pode ser percebido como inconstante em compromissos longos","Necessidade de aprovação que pode distorcer autenticidade"],
    sobrePressao: "Sob pressão você busca pessoas. Isso pode ser uma força — sua rede resolve problemas que você não resolveria sozinho. Mas também pode ser fuga disfarçada de networking.",
    pontosCegos: "Você se preocupa tanto com como te percebem que às vezes age para a plateia. Sua maior pergunta deveria ser: o que eu quero de verdade — não o que vão pensar.",
    relacoes: "Você é um parceiro caloroso e presente — quando está, faz a outra pessoa sentir que é a única no mundo. O desafio é que divide essa presença com muitas pessoas.",
    carreiras: ["Vendas e business development","Relações públicas","Recrutamento","Eventos e hospitalidade","Liderança comunitária","Empreendedorismo social"],
    fatoCurioso: "Conectores do seu perfil são lembrados em conversas em que não estavam presentes. As pessoas falam de você — e quase sempre positivamente.",
    afirmacao: "Você tem o dom de fazer as pessoas se sentirem vistas. Certifique-se de que alguém esteja fazendo o mesmo por você."
  },
  "Sanguíneo-Linguística": {
    nome: "O Contador", emoji: "🎭", cor: "#9C27B0",
    frase: "Você não conta histórias. Você cria experiências com palavras.",
    resumo: "Quando você fala, as pessoas param o que estavam fazendo. Não por educação — por escolha.",
    base: {
      arquetipo: "O Sanguíneo vive no presente e encontra significado na experiência imediata. Tem um senso natural de drama — não no sentido negativo, mas no sentido teatral: percebe o que é interessante em qualquer situação e tem impulso de compartilhar. Essa combinação de presença e impulso narrativo é a raiz do talento para contar histórias.",
      inteligencia: "A Inteligência Linguística em expressão sanguínea aparece como oralidade antes de escrita. Você pensa enquanto fala, encontra as palavras no processo de narrar, e tem consciência aguçada do ritmo e do impacto emocional de cada frase. É a inteligência do improviso com qualidade.",
      combinacao: "Sanguíneo com inteligência linguística é o perfil mais naturalmente carismático da matriz. A energia sanguínea dá vida à linguagem; a inteligência linguística dá estrutura à energia. O resultado é comunicação que parece espontânea mas tem efeito preciso. Você transforma qualquer experiência em narrativa — e qualquer narrativa em conexão."
    },
    descricao: "Há uma diferença entre quem tem boas histórias e quem sabe contá-las. Você tem os dois. O Contador sanguíneo-linguístico é magnético porque combina entusiasmo natural com precisão narrativa.",
    descricao2: "Você tem uma habilidade específica: transformar o mundano em interessante sem mentir. Uma ida ao supermercado na sua boca vira uma saga. Isso não é exagero — é perspectiva. E perspectiva é uma forma de gênio.",
    forcas: ["Narrativa oral irresistível que prende atenção sem esforço","Transforma o mundano em interessante com naturalidade","Alta adaptabilidade de linguagem para diferentes públicos","Presença natural em ambientes públicos","Torna ideias complexas emocionalmente acessíveis"],
    sombra: ["Pode exagerar para efeito narrativo — e nem sempre percebe","Dificuldade com comunicação técnica e objetiva","Usa humor para desviar de conversas difíceis","Às vezes mais performático do que autêntico","Pode priorizar a boa história sobre a verdade completa"],
    sobrePressao: "Pressão ativa sua performance. Você fica mais articulado e brilhante em público. O problema é que isso pode ser uma máscara que cansa — e que os mais próximos já sabem que é máscara.",
    pontosCegos: "Você domina a arte de ser interessante. Mas interessante não é o mesmo que confiável. As pessoas adoram te ouvir — mas nem sempre te levam a sério quando importa.",
    relacoes: "Você é intenso e presente como parceiro. O desafio é que você performa em relacionamentos da mesma forma que em público. Às vezes as pessoas mais próximas precisam de você sem a história — só você.",
    carreiras: ["Apresentação e oratória","Marketing e branding","Educação","Atuação e comunicação","Liderança de comunidades","Podcast e mídia"],
    fatoCurioso: "Contadores do seu perfil melhoram histórias inconscientemente a cada vez que contam. Você não mente. Você edita. Há uma diferença — embora quem foi personagem nem sempre concorde.",
    afirmacao: "Você tem o dom da narrativa. Use-o para iluminar verdades, não para construir uma versão de si mesmo que precise ser mantida."
  },
  "Sanguíneo-Criativa": {
    nome: "O Artista", emoji: "🎨", cor: "#FF4081",
    frase: "Você não vê o mundo como ele é. Você vê como poderia ser.",
    resumo: "Energia, imaginação e necessidade de compartilhar. Você cria para se conectar — e isso dá ao seu trabalho uma assinatura que não pode ser ensinada.",
    base: {
      arquetipo: "O Sanguíneo cria para se conectar. Diferente de outros temperamentos que criam por necessidade interna ou rigor técnico, o Sanguíneo cria porque quer que outros vejam, sintam e respondam. Essa orientação social da criatividade é o que torna seu trabalho acessível e contagiante — e também o que o torna vulnerável à validação externa.",
      inteligencia: "A Inteligência Criativa em sua expressão sanguínea é abundante e variada. Você não tem um estilo fixo — tem muitos. Experimenta com facilidade, transita entre linguagens criativas e tem baixa resistência ao início de novos projetos. A genialidade está na geração; o desafio está na curadoria.",
      combinacao: "Sanguíneo com inteligência criativa é o perfil mais expressivo e mais generoso da matriz criativa. Você cria em quantidade e com coração aberto — raramente guardando para si. O desafio é que criatividade abundante sem filtragem pode diluir o impacto. Aprender a escolher o que merece ser compartilhado é o que transforma produção em obra."
    },
    descricao: "Energia, imaginação e vontade de compartilhar o que cria. O Artista sanguíneo-criativo coloca cor onde havia cinza. Você cria para se conectar, e isso torna seu trabalho único: há presença de quem o fez.",
    descricao2: "Você não separa vida de arte. O que vive vira material. O que sente vira forma. Essa permeabilidade entre experiência e criação é o que torna seu trabalho reconhecível — há algo de vivo nele.",
    forcas: ["Criatividade abundante, variada e de fácil acesso","Capacidade genuína de inspirar outros","Experimenta sem medo do julgamento — no início","Cria com velocidade e frescor","Trabalho com assinatura reconhecível — você não imita"],
    sombra: ["Muitos começos, poucos fins","Dependência de validação externa para continuar criando","Dificuldade com o lado técnico e processual","Pode sacrificar profundidade por impacto imediato","Hipersensibilidade à crítica"],
    sobrePressao: "Pressão bloqueia você de formas específicas: o olhar crítico alheio congela sua criação. Você precisa de liberdade psicológica para criar.",
    pontosCegos: "Você cria muito mas filtra pouco. Aprender a editar é tão importante quanto criar. O curador é tão valioso quanto o artista.",
    relacoes: "Você é um parceiro vibrante e criativo. O risco é que sua necessidade de expressão pode fazer os relacionamentos parecerem palco. Deixe a outra pessoa ser o protagonista às vezes.",
    carreiras: ["Artes visuais e design","Música e performance","Fotografia e vídeo","Moda e styling","Criação de conteúdo digital","Direção de arte"],
    fatoCurioso: "Artistas do seu perfil têm projetos que outros consideram incompletos — mas que para você já expressaram o que precisavam. Você termina quando sente, não quando está tecnicamente pronto.",
    afirmacao: "Você tem o dom de trazer beleza ao ordinário. Aprenda a curar o que cria — porque nem tudo que é genuíno precisa ser público."
  },
  "Melancólico-Lógica": {
    nome: "O Perfeccionista", emoji: "🎯", cor: "#34495E",
    frase: "Para você, 'bom o suficiente' nunca é.",
    resumo: "Padrão excepcional, integridade intelectual inabalável e um radar de qualidade que raramente falha.",
    base: {
      arquetipo: "O Melancólico é orientado por padrão interno. Não age para agradar ou para ser visto — age porque não consegue fazer de outra forma. Tem consciência aguçada da diferença entre o que é e o que deveria ser, e essa consciência é ao mesmo tempo sua maior força e sua maior fonte de sofrimento.",
      inteligencia: "A Inteligência Lógico-Matemática em expressão melancólica não é apenas analítica — é julgadora. Você não apenas vê os dados: vê os erros nos dados. Não apenas entende o sistema: vê onde o sistema falha. Essa capacidade de identificar imperfeições com precisão é o que torna seu trabalho excepcionalmente rigoroso.",
      combinacao: "Melancólico com inteligência lógica cria o perfil de maior padrão técnico da matriz. Você combina exigência interna com capacidade analítica — o que significa que não apenas quer que o trabalho seja excelente, mas consegue identificar com precisão o que separa o bom do excelente. O custo é a dificuldade em parar: sempre há mais um detalhe a corrigir."
    },
    descricao: "Você vê o que está errado antes de ver o que está certo. Isso não é pessimismo — é um radar de qualidade que poucos têm. O Perfeccionista melancólico-lógico produz trabalho de padrão excepcional.",
    descricao2: "Seu padrão não é escolha — é constituição. Você simplesmente não consegue entregar algo inferior ao possível. Isso cria trabalho de nível excepcional e um nível de autocrítica que nenhum crítico externo conseguiria superar.",
    forcas: ["Padrão de qualidade excepcionalmente alto","Identifica falhas e riscos que outros não veem","Pensamento sistemático e detalhado","Integridade intelectual que raramente se dobra à pressão","Trabalho que resiste à revisão"],
    sombra: ["Paralisia por perfeccionismo","Autocrítica mais cruel que qualquer crítico externo","Dificuldade em celebrar conquistas","Excessivamente crítico com outros","Pode tornar a perfeição um fim em si mesmo"],
    sobrePressao: "Pressão eleva seu padrão interno — o que às vezes produz seu melhor trabalho. O problema é o custo. Você entrega excelência e cobra isso de si mesmo de formas que ninguém vê.",
    pontosCegos: "Perfeição não existe. Você sabe disso intelectualmente. Mas emocionalmente age como se existisse. Compaixão consigo mesmo não é baixar o padrão — é sobreviver para continuar entregando.",
    relacoes: "Você é um parceiro cuidadoso e dedicado. Mas seus padrões altos podem criar pressão nos relacionamentos. As pessoas próximas podem sentir que nunca são suficientes.",
    carreiras: ["Engenharia de precisão","Medicina e cirurgia","Auditoria e controle de qualidade","Filosofia e pesquisa","Arquitetura técnica","Desenvolvimento de software"],
    fatoCurioso: "Perfeccionistas do seu perfil produzem seu melhor trabalho quando acreditam que ninguém vai ver. A ausência do olhar alheio libera algo que a pressão bloqueia.",
    afirmacao: "Seu padrão é um dom raro. Mas você não precisa ser perfeito para merecer estar aqui. Feito e imperfeito supera perfeito e inexistente."
  },
  "Melancólico-Interpessoal": {
    nome: "O Conselheiro", emoji: "🌙", cor: "#6C3483",
    frase: "Você não ouve o que as pessoas dizem. Ouve o que não conseguem dizer.",
    resumo: "O perfil mais empático da matriz — e o mais sobrecarregado. Você carrega o que os outros não conseguem nomear.",
    base: {
      arquetipo: "O Melancólico sente em profundidade. Não experimenta emoções na superfície — as processa em camadas, muitas vezes por longos períodos. Essa intensidade interna cria uma sensibilidade ao sofrimento alheio que outros perfis simplesmente não acessam. O Melancólico não apenas entende a dor — reconhece a dor porque a conhece por dentro.",
      inteligencia: "A Inteligência Interpessoal em expressão melancólica é menos sobre influência e mais sobre compreensão. Você não quer mover as pessoas — quer entendê-las. Essa distinção é fundamental: onde o Colérico interpessoal usa o conhecimento das pessoas para agir, você o usa para acolher.",
      combinacao: "Melancólico com inteligência interpessoal cria o perfil de maior profundidade empática da matriz. Você não apenas lê as pessoas — sente o que elas sentem, às vezes antes delas mesmas. Isso te torna extraordinariamente capaz de oferecer suporte real, não superficial. O custo é absorver emocionalmente o que os outros depositam em você — e raramente ter onde depositar o seu."
    },
    descricao: "Profundidade emocional com percepção interpessoal aguçada. O Conselheiro melancólico-interpessoal é o perfil mais empático da matriz. Você sente o que os outros sentem antes que eles mesmos percebam.",
    descricao2: "Você não apenas lê emoções — entende por que as pessoas fazem o que fazem, mesmo quando elas mesmas não sabem. Você vê a criança dentro do adulto difícil, o medo por trás da arrogância.",
    forcas: ["Empatia profunda e genuinamente não-julgamental","Percepção de subtext emocional que a maioria não acessa","Cria segurança para que outros se abram","Memória afetiva excepcional","Capacidade de estar presente com o sofrimento alheio sem fugir"],
    sombra: ["Absorve o sofrimento alheio como se fosse próprio","Evita pedir ajuda porque entende o peso dos outros","Lealdade excessiva a pessoas que não merecem","Tende à melancolia quando não há espaço para processar","Pode usar a compreensão dos outros para evitar se compreender"],
    sobrePressao: "Sob pressão você internaliza. Isso é perigoso porque você parece bem quando não está — e as pessoas acreditam em você. Aprenda a ser tão honesto sobre si mesmo quanto é perspicaz sobre os outros.",
    pontosCegos: "Você cuida de todos com tanta atenção que raramente alguém te cuida com a mesma atenção. Você dificulta que te ajudem porque parece sempre estar bem. Sua vulnerabilidade não é fraqueza — é a porta para conexão real.",
    relacoes: "Você é um parceiro profundo e atento. O risco é que sua profundidade pode ser assustadora para quem não está acostumado a ser verdadeiramente visto.",
    carreiras: ["Psicologia e psicoterapia","Trabalho social","Liderança pastoral ou espiritual","Cuidados paliativos","Mentoria e coaching","Recursos humanos"],
    fatoCurioso: "Conselheiros do seu perfil são a pessoa com quem alguém fala antes de uma decisão importante — mesmo sem terem pedido esse papel. Você é procurado porque parece saber guardar. E guarda mesmo.",
    afirmacao: "Você tem capacidade de cuidar que poucos têm. Mas você também merece ser cuidado — e precisa aprender a pedir isso."
  },
  "Melancólico-Linguística": {
    nome: "O Poeta", emoji: "🌊", cor: "#1A5276",
    frase: "Você sente demais e escreve para não se afogar.",
    resumo: "Você dá forma ao que não tem forma. O que você cria ressoa porque é verdadeiro antes de ser bonito.",
    base: {
      arquetipo: "O Melancólico tem uma relação intensa com a experiência interna. Não vive no exterior — vive no que a experiência exterior provoca por dentro. Essa interioridade profunda cria uma riqueza emocional que, quando encontra expressão, produz algo raro: autenticidade que não pode ser fabricada.",
      inteligencia: "A Inteligência Linguística em expressão melancólica não serve para persuadir ou entender — serve para nomear. Você usa a linguagem para dar forma ao que de outra forma permaneceria amorfo e pesado. A escrita não é um produto: é um processo de sobrevivência e descoberta.",
      combinacao: "Melancólico com inteligência linguística é a combinação que cria os escritores, poetas e comunicadores mais autênticos da matriz. Você tem profundidade emocional para sentir o que outros evitam e precisão linguística para expressá-lo de forma que ressoa universalmente. O que você cria não é apenas bonito — é verdadeiro. E verdade ressoa em um nível que técnica não alcança."
    },
    descricao: "A combinação de profundidade emocional melancólica com o dom linguístico cria algo raro: alguém capaz de dar forma ao que não tem forma. O Poeta não escreve sobre o que sente — descobre o que sente ao escrever.",
    descricao2: "Você tem uma relação com a linguagem que vai além da comunicação. Escrever não é transmitir — é descobrir. Cada texto é uma arqueologia interna. Por isso quando você encontra as palavras certas, elas chegam com um peso que trabalho mais técnico não carrega.",
    forcas: ["Expressão de complexidade emocional com precisão rara","Criação de conteúdo com profundidade que resiste ao tempo","Percepção de nuance na linguagem que a maioria não capta","Autenticidade que conecta em nível profundo","Capacidade de articular experiências coletivas que as pessoas reconhecem"],
    sombra: ["Pode usar linguagem para se isolar em vez de conectar","Sensibilidade extrema à crítica — impossível separar obra de si","Tendência à ruminação — reprocessa o mesmo tema indefinidamente","Pode romantizar sofrimento como fonte de criatividade","Perfeccionismo linguístico que paralisa mais do que refina"],
    sobrePressao: "Pressão externa bloqueia mas dor interna cria. Seus melhores trabalhos vieram de seus piores momentos. A questão é aprender a criar sem precisar do sofrimento como combustível.",
    pontosCegos: "Você acredita que quem não sente profundamente não entende. Mas isso é arrogância emocional disfarçada de sensibilidade. Há formas de profundidade que não passam pelo sentimento.",
    relacoes: "Você é um parceiro intenso e profundo. O risco é que essa profundidade pode ser pesada de forma constante. Nem todo momento precisa de significado.",
    carreiras: ["Literatura e escrita criativa","Roteiro e dramaturgia","Psicologia narrativa","Jornalismo de perfil humano","Educação humanística","Consultoria de comunicação"],
    fatoCurioso: "Poetas do seu perfil têm textos escritos para si mesmos que nunca compartilharão. Esses são seus melhores trabalhos — e você sabe disso.",
    afirmacao: "Você tem o dom de nomear o indizível. Use isso — mas cuide de si mesmo com a mesma poesia que dedica ao mundo."
  },
  "Melancólico-Criativa": {
    nome: "O Sonhador", emoji: "✨", cor: "#4A235A",
    frase: "Você cria mundos que existem apenas para você — até que alguém os vê e reconhece o próprio.",
    resumo: "O perfil mais profundo e mais solitário da matriz. O que você cria não é bonito. É verdadeiro — e verdade é mais rara que beleza.",
    base: {
      arquetipo: "O Melancólico cria a partir de necessidade, não de desejo. Não é uma escolha estética — é uma forma de processar a existência. Há algo que precisa ser externalizado, e a criação é o único canal que parece amplo o suficiente. Isso dá ao trabalho do Melancólico uma urgência interna que trabalho mais técnico não consegue replicar.",
      inteligencia: "A Inteligência Criativa em expressão melancólica é singular e reflexiva. Você não cria em quantidade — cria em profundidade. Cada obra é uma tentativa de resolver algo que a linguagem ordinária não alcança. O processo é lento e solitário; o resultado frequentemente carrega camadas que o próprio criador não consegue articular completamente.",
      combinacao: "Melancólico com inteligência criativa é o perfil mais profundo e mais solitário da matriz — e o que produz trabalho de maior ressonância emocional quando encontra seu público. Você não cria para entreter. Cria para entender. E quando alguém encontra seu trabalho no momento certo, reconhece nele algo que nunca conseguiu nomear sozinho. Isso é impacto que ultrapassa geração."
    },
    descricao: "O Sonhador melancólico-criativo é o perfil mais profundo e mais solitário da matriz. Você cria a partir de um lugar interno que poucos alcançam — e o que produz tem uma ressonância que vai além do estético.",
    descricao2: "Você não cria para agradar — cria para processar. Cada obra é uma tentativa de entender algo que a vida te apresentou de forma crua. Isso torna seu trabalho inconfundível: há uma urgência interna que o atravessa.",
    forcas: ["Criação com camadas de significado que resistem ao tempo","Visão estética singular e reconhecível","Capacidade de transformar experiências internas em arte universal","Alta tolerância à solidão criativa","Profundidade que cria conexão real com quem está pronto para receber"],
    sombra: ["Pode se perder em mundos internos em detrimento do externo","Hipersensibilidade extrema à recepção do próprio trabalho","Dificuldade em criar sob demanda ou por obrigação","Subestima o próprio trabalho enquanto superestima o dos outros","Pode usar criação como substituto para viver o que evita"],
    sobrePressao: "Pressão destrói sua criação. Você não consegue fingir. Quando forçado a criar sem estado interno alinhado, o que sai é vazio — e você sabe exatamente que é vazio.",
    pontosCegos: "Você espera condições perfeitas para criar. Mas as condições nunca serão perfeitas. A questão não é quando você vai criar — é o que criará apesar de.",
    relacoes: "Você é um parceiro profundo e raro. O risco é que esse mundo interno pode ser inacessível para quem não compartilha sua intensidade. Aprenda a criar pontes, não apenas mundos.",
    carreiras: ["Artes plásticas e instalações","Composição musical","Cinema de autor","Design conceitual","Filosofia estética","Literatura experimental"],
    fatoCurioso: "Sonhadores do seu perfil são descobertos tarde — porque levam tempo para confiar que o que criaram merece existir. Sua maior barreira nunca foi talento. Foi a pergunta: 'isso é bom o suficiente para ser visto'.",
    afirmacao: "Você cria verdade. E o mundo precisa disso mais do que precisa de mais perfeição. Deixe ser visto."
  },
  "Colérico-Corporal": {
    nome: "O Guerreiro", emoji: "⚔️", cor: "#B0281A",
    frase: "Você não planeja indefinidamente. Você age — e ajusta no movimento.",
    resumo: "Presença física intensa, instinto de ação e capacidade de sentir o mundo através do corpo. Você pensa melhor quando está em movimento.",
    base: {
      arquetipo: "O Colérico tem urgência. Não suporta esperar. Prefere uma decisão imperfeita agora a uma decisão perfeita tarde. Esse impulso, combinado com inteligência corporal, cria alguém que literalmente age antes de pensar — e frequentemente acerta.",
      inteligencia: "Descrita por Gardner como a capacidade de usar o próprio corpo com habilidade e precisão. Não se limita a atletas — aparece em cirurgiões, artesãos, dançarinos, atores e qualquer pessoa que pensa com as mãos e sente no corpo antes de articular com palavras.",
      combinacao: "Colérico com inteligência corporal cria o perfil mais orientado à ação física da matriz. Você não espera ter certeza antes de começar — começa e corrige no processo. Sua inteligência não é abstrata: é visceral, tátil, imediata. O que outros processam em horas, você sente em segundos."
    },
    descricao: "Você tem uma relação com o mundo que passa pelo corpo antes de passar pela mente. Não é impulsividade — é um tipo diferente de inteligência. Você lê ambientes, tensões e dinâmicas de poder através de sinais físicos que outras pessoas simplesmente não captam. Sua presença física é comunicação mesmo quando você não fala.",
    descricao2: "O Guerreiro tem um código interno de honra difícil de dobrar. Você não faz o que não acredita, não trai o que considera seu e não recua quando a situação exige que fique. Isso cria uma lealdade rara — e uma inflexibilidade que pode ser custosa quando a situação exige diplomacia em vez de confronto.",
    forcas: ["Age com velocidade e confiança em situações que exigem decisão imediata","Presença física que transmite autoridade e segurança sem precisar de palavras","Alta tolerância à dor, ao desconforto e à adversidade física","Lê tensões corporais e emocionais no ambiente com precisão instintiva","Executa com o corpo o que outros apenas planejam"],
    sombra: ["Pode resolver conflitos com confronto direto quando diplomacia seria mais eficaz","Dificuldade com ambientes que exigem paciência, burocracia e espera","Pode intimidar involuntariamente quem tem perfil mais sensível","Impulsividade física pode gerar consequências que o pensamento teria evitado","Tende a subestimar a inteligência de quem não demonstra força ou ação"],
    sobrePressao: "Pressão libera você. Situações de crise ativam um modo operacional que parece quase sobrenatural para quem observa — você fica mais calmo, mais rápido e mais decisivo. O perigo é o período pós-crise: quando a adrenalina baixa, o custo emocional aparece de uma vez.",
    pontosCegos: "Você confia tanto no seu instinto físico que às vezes ignora informações que vêm em formato abstrato — dados, estatísticas, análises. Nem tudo que importa pode ser sentido. Algumas batalhas são vencidas antes de começar, com planejamento que você acha tedioso.",
    relacoes: "Você é protetor, presente e intenso. As pessoas ao seu lado sabem que você as defende — e sentem isso como segurança real. O risco é que sua intensidade pode sufocar. Nem toda pessoa quer ser protegida da mesma forma que você protegeria.",
    carreiras: ["Medicina de emergência","Artes marciais e esportes de alto desempenho","Dança e teatro físico","Cirurgia","Construção e artesanato","Segurança e resgate"],
    fatoCurioso: "Guerreiros do seu perfil frequentemente descrevem estados de 'flow' durante situações de alta pressão — cirurgias, competições, crises. O corpo assume o controle e a mente observa. É um estado que outros perfis raramente acessam.",
    afirmacao: "Você foi feito para o campo — não para a sala de reuniões. Mas os maiores guerreiros da história também sabiam quando negociar."
  },
  "Colérico-Musical": {
    nome: "O Maestro", emoji: "🎼", cor: "#A93226",
    frase: "Você não segue o ritmo. Você define o compasso que os outros vão seguir.",
    resumo: "Sensibilidade ao ritmo de tudo — pessoas, projetos, conversas. Você percebe quando algo está fora do tom antes de qualquer outro.",
    base: {
      arquetipo: "O Colérico tem senso natural de ritmo social — sabe quando acelerar, quando desacelerar, quando o silêncio é poder. Combinado com inteligência musical, essa percepção se torna quase sobrenatural.",
      inteligencia: "A Inteligência Musical, para Gardner, não é apenas tocar instrumentos — é sensibilidade a padrões sonoros, ritmo, harmonia e a estrutura emocional da música. Aparece em músicos, mas também em quem percebe o 'tom' de uma reunião, a cadência de uma negociação ou o ritmo de uma equipe.",
      combinacao: "Colérico com inteligência musical cria líderes com senso de timing excepcional. Você sabe exatamente quando lançar uma ideia, quando pressionar e quando recuar. Sua liderança tem qualidade orquestral — você rege sem que as pessoas percebam que estão sendo regidas."
    },
    descricao: "Você percebe o mundo em padrões que outros não conseguem articular. Quando uma reunião está 'saindo do ritmo', quando uma equipe está 'desafinada', quando uma conversa 'perdeu o tom' — você sente isso antes de qualquer outro. E tem a autoridade natural para reestabelecer o compasso.",
    descricao2: "Líderes com seu perfil não precisam gritar para serem ouvidos. Eles simplesmente mudam o ritmo — e todo o ambiente se ajusta. Há uma qualidade magnética no seu silêncio e uma precisão no seu timing que cria seguidores sem que você precise pedir.",
    forcas: ["Senso de timing excepcional em comunicação, liderança e negociação","Percebe dissonâncias em equipes e ambientes antes que se tornem problemas","Capacidade de criar harmonia e coesão em grupos diversos","Usa pausa e ritmo como ferramentas de influência conscientes","Memória para padrões — lembra como situações evoluíram e prevê como vão evoluir"],
    sombra: ["Pode ser perfeccionista com o 'ritmo' alheio — intolerante com quem é naturalmente descompassado","Dificuldade em trabalhar com pessoas que não têm sensibilidade ao timing","Pode manipular ambientes sutilmente sem perceber","Às vezes mais preocupado com a harmonia da situação do que com a verdade dela","Impaciência com processos que considera cacofônicos ou desorganizados"],
    sobrePressao: "Pressão tende a te fazer acelerar o ritmo interno antes de desacelerar. Você pode tomar decisões prematuras porque o silêncio da incerteza é insuportável — você prefere um compasso errado a nenhum compasso.",
    pontosCegos: "Nem tudo que parece desafinado está errado. Algumas das melhores ideias chegam de pessoas que parecem fora do ritmo. Sua sensibilidade ao padrão pode te cegar para o valor da dissonância criativa.",
    relacoes: "Você busca parceiros que 'estejam na mesma frequência'. Quando encontra, a conexão é profunda e intuitiva. Quando não encontra, pode descartar relações que precisariam apenas de tempo para encontrar o ritmo.",
    carreiras: ["Regência e composição","Liderança de equipes criativas","Produção musical e audiovisual","Treinamento e facilitação","Neurociência e pesquisa em ritmo","Direção de palco e cinema"],
    fatoCurioso: "Maestros do seu perfil frequentemente descrevem pensar em reuniões e conversas como se fossem partituras — com vozes, tempos e dinâmicas. Quando algo 'soa errado', eles sentem antes de analisar.",
    afirmacao: "Você tem o dom de criar harmonia. Mas harmonia real não é ausência de tensão — é tensão bem resolvida. Não suavize o que precisa ser confrontado."
  },
  "Colérico-Naturalista": {
    nome: "O Caçador", emoji: "🦅", cor: "#BA4A00",
    frase: "Você lê o ambiente antes de qualquer outro. E age enquanto os outros ainda estão observando.",
    resumo: "Instinto aguçado, leitura rápida de contextos e sistemas, capacidade de agir no momento exato.",
    base: {
      arquetipo: "Alta energia direcional e orientação por resultado. O Colérico não observa passivamente — observa para agir.",
      inteligencia: "Gardner descreve a Inteligência Naturalista como a capacidade de reconhecer, classificar e entender padrões na natureza e no ambiente. Em contextos modernos, manifesta-se como leitura aguçada de sistemas e ecossistemas — seja na natureza, nos negócios ou nas dinâmicas humanas.",
      combinacao: "Colérico com inteligência naturalista cria o perfil mais orientado a contexto e oportunidade da matriz. Você não apenas age rápido — age no momento certo. Você lê o ambiente como um predador lê o território: com precisão instintiva e sem desperdício de energia."
    },
    descricao: "Você tem uma capacidade rara de ler sistemas inteiros com rapidez. Seja um ecossistema natural, um mercado, uma organização ou uma sala de reuniões — você enxerga as relações entre as partes, identifica onde está o poder e onde está a vulnerabilidade, e age com precisão cirúrgica.",
    descricao2: "O Caçador não corre atrás de qualquer coisa. Ele espera o momento certo — mas quando esse momento chega, age com uma velocidade que surpreende quem achava que você estava parado.",
    forcas: ["Leitura rápida e precisa de sistemas complexos e ambientes dinâmicos","Identificação de oportunidades antes que outros as percebam","Capacidade de agir no momento exato, sem cedo demais nem tarde demais","Alta resistência e adaptabilidade a ambientes incertos e instáveis","Pensamento ecossistêmico — enxerga relações que análises lineares perdem"],
    sombra: ["Pode ser excessivamente predatório em contextos que pedem colaboração","Dificuldade com ambientes burocráticos e estáveis que não exigem caça","Pode subestimar o valor de paciência prolongada sem ação","Tendência a classificar pessoas e situações rapidamente — e nem sempre corretamente","Pode priorizar a oportunidade sobre as pessoas envolvidas"],
    sobrePressao: "Pressão aguça seus instintos. Você fica mais focado, mais eficiente e menos propenso a desperdiçar energia. O risco é a hiperfocagem — às vezes você está tão focado na presa que não vê o que está ao seu redor.",
    pontosCegos: "Nem todo ambiente é território a ser dominado. Algumas situações pedem cuidado, não caça. Sua leitura rápida de sistemas pode te fazer agir antes de entender completamente o que está diante de você.",
    relacoes: "Você é protetor e atento com quem considera seu. Mas sua leitura classificatória de pessoas pode criar distâncias desnecessárias. Nem todo mundo precisa provar que merece seu respeito antes de recebê-lo.",
    carreiras: ["Biologia e ecologia","Empreendedorismo e venture capital","Inteligência de mercado","Gestão de crises","Exploração e pesquisa de campo","Estratégia competitiva"],
    fatoCurioso: "Caçadores do seu perfil frequentemente descrevem uma sensação de 'saber' quando algo está prestes a mudar em um ambiente — antes de conseguir articular por quê. É leitura de padrões em nível inconsciente.",
    afirmacao: "Você foi feito para territórios que exigem leitura rápida e ação precisa. Mas os ecossistemas mais ricos são também os mais frágeis — cuide do que caça."
  },
  "Colérico-Espacial": {
    nome: "O Arquiteto", emoji: "🏛️", cor: "#922B21",
    frase: "Você não vê o que existe. Você vê o que deveria existir — e sabe como construí-lo.",
    resumo: "Visão tridimensional do mundo, capacidade de projetar soluções antes de executar e precisão na tradução de ideias em estruturas concretas.",
    base: {
      arquetipo: "Urgência, controle e orientação por resultado. O Colérico não projeta por prazer estético — projeta para construir algo real.",
      inteligencia: "A Inteligência Espacial é a capacidade de pensar em três dimensões, visualizar estruturas e relações no espaço, e criar representações mentais precisas de como as coisas se encaixam. Aparece em arquitetos, engenheiros, designers, cirurgiões e qualquer pessoa que pensa visualmente antes de verbalmente.",
      combinacao: "Colérico com inteligência espacial cria o construtor mais eficiente da matriz. Você não apenas visualiza — você planeja a execução ao mesmo tempo em que visualiza. Não há separação entre o sonho e o projeto. Você vê o edifício antes do primeiro tijolo."
    },
    descricao: "Você pensa em espaço, estrutura e forma antes de pensar em palavras. Quando confrontado com um problema — físico, organizacional ou conceitual — você instintivamente o mapeia espacialmente. Onde estão os bloqueios? Onde está a ineficiência? Como redesenhar isso para que funcione melhor?",
    descricao2: "O Arquiteto tem um padrão visual de qualidade que raramente consegue desligar. Você entra em um espaço e imediatamente vê o que está errado — o fluxo inadequado, o desperdício de área, a oportunidade perdida. Isso é inestimável quando você tem poder de transformar.",
    forcas: ["Visualização espacial tridimensional com alta precisão","Capacidade de projetar soluções completas antes de iniciar a execução","Senso estético funcional — belo porque funciona, não apenas porque parece","Alta eficiência na organização de espaços, fluxos e sistemas","Traduz visões complexas em projetos concretos e executáveis"],
    sombra: ["Pode ser excessivamente crítico com ambientes e estruturas que considera inadequados","Dificuldade em aceitar soluções 'boas o suficiente' quando vê a solução ideal","Pode priorizar a estrutura sobre as pessoas que a habitam","Impaciência com processos que não seguem o projeto original","Pode subestimar a complexidade humana que não cabe em nenhum projeto"],
    sobrePressao: "Pressão tende a ativar seu modo de 'redesenho de emergência'. Você rapidamente remapeia a situação, identifica os pontos críticos e propõe uma nova estrutura. O risco é que nem sempre o problema é estrutural — às vezes é humano.",
    pontosCegos: "Você acredita que problemas suficientemente bem-estruturados se resolvem. Mas alguns problemas não têm solução arquitetônica. Relacionamentos, emoções e caos criativo não se encaixam em planta baixa.",
    relacoes: "Você é o parceiro que transforma espaços — físicos e relacionais. Tende a 'projetar' o relacionamento ideal e pode se frustrar quando a realidade não segue o projeto. Aprenda a habitar o espaço que existe, não só o que você projetaria.",
    carreiras: ["Arquitetura e urbanismo","Engenharia civil e estrutural","Design de produto e interfaces","Cirurgia e medicina de precisão","Estratégia organizacional","Cenografia e design de espaços"],
    fatoCurioso: "Arquitetos do seu perfil frequentemente resolvem problemas complexos dormindo — seu cérebro continua a trabalhar no projeto espacialmente mesmo durante o descanso. Acorde com um caderno ao lado.",
    afirmacao: "Você tem o dom de construir o que outros apenas imaginam. Mas as estruturas mais duradouras são aquelas que deixam espaço para o humano crescer dentro delas."
  },
  "Colérico-Existencial": {
    nome: "O Reformador", emoji: "⚡", cor: "#CB4335",
    frase: "Você não aceita o mundo como ele é. Você se pergunta por que deveria ser diferente — e faz algo a respeito.",
    resumo: "Questionamento profundo aliado à urgência de transformar. Você não filosofa por prazer — filosofa para agir.",
    base: {
      arquetipo: "Alta energia de transformação e baixa tolerância para o que considera injusto, ineficiente ou sem sentido. O Colérico não contempla — age.",
      inteligencia: "Gardner descreve a Inteligência Existencial como a capacidade de contemplar questões profundas sobre existência, sentido, morte e o lugar do ser humano no universo. Não é teórica — é uma necessidade visceral de entender o 'porquê' de tudo.",
      combinacao: "Colérico com inteligência existencial cria o perfil mais orientado a transformação sistêmica da matriz. Você não apenas questiona — você age com base nos questionamentos. Sua filosofia tem dentes. Sua indignação tem plano."
    },
    descricao: "Você carrega uma pergunta constante que outros conseguem silenciar mais facilmente: por que isso é assim, se poderia ser diferente? Essa pergunta não é abstrata para você — é urgente. E sua urgência colérica transforma o questionamento em projeto, e o projeto em ação.",
    descricao2: "O Reformador é o perfil que muda instituições, questiona sistemas e incomoda o status quo com uma combinação rara: profundidade intelectual e vontade de fazer algo a respeito. Você não escreve artigos sobre o que deveria mudar — você tenta mudar.",
    forcas: ["Questionamento profundo aliado à capacidade de agir com base nele","Alta tolerância para a complexidade e a ambiguidade das grandes questões","Capacidade de inspirar outros com uma visão de mundo que vai além do imediato","Indignação produtiva — transforma inconformismo em projeto","Perspectiva de longo prazo que perfis mais imediatistas não conseguem sustentar"],
    sombra: ["Pode ficar preso em grandes questões enquanto problemas concretos esperam","Tendência ao absolutismo — dificuldade em aceitar meias-soluções","Pode ser visto como idealista impraticável mesmo quando tem planos concretos","Impaciência com quem não vê as mesmas urgências sistêmicas","Pode sacrificar relacionamentos pelo que considera causas maiores"],
    sobrePressao: "Pressão existencial — a sensação de que o tempo está acabando para mudar algo importante — é o que mais te move. Pressão operacional rotineira pode te paralisar: é difícil se importar com pequenas urgências quando você carrega urgências grandes.",
    pontosCegos: "Nem todo problema sistêmico precisa de reforma total. Às vezes a mudança incremental é mais eficaz do que a revolução. Sua tendência ao absoluto pode te cegar para o valor do gradual.",
    relacoes: "Você busca parceiros que compartilhem sua visão de mundo. Quando encontra, a conexão é profunda e duradoura. Quando não encontra, pode sentir uma solidão particular — a de alguém que vê algo urgente que os outros não conseguem ver.",
    carreiras: ["Filosofia aplicada","Ativismo e políticas públicas","Liderança religiosa e espiritual","Ética em tecnologia e ciência","Educação transformadora","Direito constitucional e direitos humanos"],
    fatoCurioso: "Reformadores do seu perfil frequentemente descrevem um momento específico — uma experiência, uma leitura, uma conversa — que 'mudou tudo'. Antes e depois desse momento, são pessoas diferentes.",
    afirmacao: "Você tem a rara combinação de ver o que está errado e ter coragem de dizer. Use isso com precisão — não toda causa merece toda sua energia."
  },
  "Fleumático-Corporal": {
    nome: "O Artesão", emoji: "🪵", cor: "#117A65",
    frase: "Você não faz — você perfaz. A diferença está em cada detalhe que só você percebe.",
    resumo: "Maestria técnica, paciência com o processo e um padrão de qualidade que não aceita atalhos.",
    base: {
      arquetipo: "Paciência, consistência e alto padrão interno. O Fleumático não abandona o processo antes de estar satisfeito com o resultado.",
      inteligencia: "Em expressão fleumática, aparece não como explosão atlética — mas como maestria artesanal: o cirurgião que opera por seis horas sem perder precisão, o instrumentista que pratica a mesma frase mil vezes.",
      combinacao: "Fleumático com inteligência corporal cria o perfil de maior maestria técnica da matriz. Você tem a paciência para repetir até que saia perfeito e a inteligência corporal para sentir quando chegou lá. É a combinação que cria os maiores especialistas em habilidades físicas do mundo."
    },
    descricao: "Você tem uma relação com o fazer que vai além da técnica. Para você, o processo tem valor em si mesmo — não apenas o resultado. Você não quer fazer algo depressa e bem. Você quer fazer perfeitamente. E você tem a paciência rara para isso.",
    descricao2: "O Artesão não se impressiona com teoria. Impressiona-se com execução. Você respeita quem domina sua arte com o corpo, não apenas com a mente. E você desenvolve esse domínio com uma dedicação que outros frequentemente confundem com obstinação.",
    forcas: ["Maestria técnica de nível excepcional em habilidades físicas específicas","Paciência com o processo de desenvolvimento de habilidade — não desiste","Presença física calma que transmite competência e segurança","Alto padrão de execução que raramente aceita mediocridade","Aprendizado corporal profundo — o que você aprende com o corpo, não esquece"],
    sombra: ["Pode ser excessivamente lento em contextos que exigem adaptação rápida","Dificuldade em ensinar o que faz — o conhecimento está no corpo, não em palavras","Pode se tornar obsoleto se não atualizar técnicas ao longo do tempo","Resistência a novas abordagens que parecem ameaçar a maestria conquistada","Pode subestimar habilidades que não têm componente físico"],
    sobrePressao: "Pressão ativa seu treinamento. Você faz o que praticou — e praticou muito. O risco é quando a situação exige improvisação radical: seu corpo busca o padrão conhecido mesmo quando o padrão não serve.",
    pontosCegos: "Maestria pode criar rigidez. O que funcionou por anos pode ser a razão pela qual você não consegue se adaptar quando o contexto muda.",
    relacoes: "Você demonstra afeto fazendo — consertando, construindo, cuidando fisicamente. Aprenda a complementar com palavras.",
    carreiras: ["Artes e ofícios tradicionais","Cirurgia e procedimentos médicos de precisão","Instrumentos musicais clássicos","Escultura e cerâmica","Culinária de alto nível","Relojoaria e joalheria"],
    fatoCurioso: "Artesãos do seu perfil frequentemente descrevem estados de hiperfoco durante o trabalho — horas passam como minutos. É uma forma de meditação ativa que outros perfis raramente acessam com tanta naturalidade.",
    afirmacao: "Você tem maestria suficiente para criar algo que dura gerações. Cuide de transmitir o que sabe — maestria guardada é maestria desperdiçada."
  },
  "Fleumático-Musical": {
    nome: "O Harmonizador", emoji: "🎵", cor: "#148F77",
    frase: "Você não impõe o ritmo. Você encontra o ritmo de cada um — e cria algo que funciona junto.",
    resumo: "Sensibilidade ao equilíbrio, paciência com a criação coletiva e capacidade rara de fazer coisas diferentes soarem bem juntas.",
    base: {
      arquetipo: "Paciência e orientação por harmonia. O Fleumático suporta o processo longo de afinar — literalmente e metaforicamente.",
      inteligencia: "Em expressão fleumática, a inteligência musical aparece não como performance solo brilhante, mas como sensibilidade ao conjunto. Você ouve o todo, não apenas a parte.",
      combinacao: "Fleumático com inteligência musical cria o harmonizador mais paciente da matriz. Você não impõe — você ajusta. Não domina — você equilibra. Isso é raro e valioso em qualquer ambiente onde múltiplas vozes precisam criar algo coerente juntas."
    },
    descricao: "Você tem uma sensibilidade ao equilíbrio que vai além da música. Em equipes, em relacionamentos, em projetos — você percebe quando algo está fora de lugar e tem a paciência para ajustar sem drama. Sua presença tende a tornar os ambientes mais coesos, mais produtivos e mais agradáveis.",
    descricao2: "O Harmonizador tem um dom especial para o trabalho colaborativo. Você consegue fazer contribuições muito diferentes convergirem em algo coerente — não apagando as diferenças, mas encontrando o ponto onde elas se complementam.",
    forcas: ["Sensibilidade excepcional ao equilíbrio e à harmonia em grupos e processos","Paciência para o processo longo de afinar e ajustar colaborações","Capacidade de integrar perspectivas e vozes muito diferentes","Cria ambientes de trabalho onde as pessoas se sentem ouvidas e valorizadas","Alta memória para padrões de comportamento e dinâmicas relacionais"],
    sombra: ["Pode priorizar a harmonia sobre a necessidade de confrontar o que está errado","Dificuldade em liderar em situações que exigem decisões dissonantes","Pode ser percebido como indeciso quando está, na verdade, ouvindo tudo","Tende a sacrificar a própria voz para manter o conjunto afinado","Pode se esgotar ao tentar harmonizar dinâmicas simplesmente incompatíveis"],
    sobrePressao: "Pressão tende a te fazer buscar harmonia prematuramente. Às vezes a dissonância precisa durar mais do que você suporta para criar algo verdadeiramente novo.",
    pontosCegos: "Nem todo conjunto precisa soar bem. Às vezes a dissonância criativa produz algo melhor que a harmonia fácil.",
    relacoes: "Você é o parceiro que faz o relacionamento funcionar na prática — com cuidado, ajuste constante e paciência. O risco é sacrificar suas próprias necessidades no processo.",
    carreiras: ["Composição e arranjo musical","Facilitação e mediação","Liderança de equipes criativas","Produção de projetos colaborativos","Terapia de grupo","Diplomacia cultural"],
    fatoCurioso: "Harmonizadores do seu perfil frequentemente são a 'cola' invisível de grupos — o elemento que mantém tudo junto sem que ninguém perceba explicitamente. Só percebem quando você sai.",
    afirmacao: "Você tem o dom de fazer coisas diferentes soarem bem juntas. Mas inclua sua própria voz na harmonia — um conjunto sem o seu timbre está incompleto."
  },
  "Fleumático-Naturalista": {
    nome: "O Guardião", emoji: "🌿", cor: "#229954",
    frase: "Você não apenas observa os sistemas. Você os cuida.",
    resumo: "Paciência com processos longos, sensibilidade a equilíbrios delicados e comprometimento profundo com o que precisa ser preservado.",
    base: {
      arquetipo: "Consistência, paciência e orientação por preservação. O Fleumático sustenta o cuidado quando outros já desistiram.",
      inteligencia: "Capacidade de perceber padrões em sistemas complexos, reconhecer equilíbrios delicados e entender as relações de interdependência que sustentam o todo.",
      combinacao: "Fleumático com inteligência naturalista cria o perfil mais orientado à preservação e ao cuidado de longo prazo. Sua paciência com processos longos e sua sensibilidade a desequilíbrios sutis tornam você insubstituível em contextos que exigem atenção sustentada."
    },
    descricao: "Você tem uma relação especial com o tempo longo. Enquanto outros pensam em trimestres, você pensa em gerações. Enquanto outros veem crises, você vê ciclos. Essa perspectiva é rara e cada vez mais necessária em um mundo orientado ao imediato.",
    descricao2: "O Guardião tem um senso de responsabilidade com o que está sob seus cuidados que vai além do dever profissional. Você cuida porque acredita que cuidar importa — e porque entende que os sistemas mais valiosos são os mais frágeis.",
    forcas: ["Comprometimento de longo prazo com o que precisa ser preservado ou desenvolvido","Sensibilidade a desequilíbrios sutis em sistemas complexos","Paciência com processos lentos que produzem resultados duradouros","Confiabilidade excepcional — você está lá quando os outros já foram","Perspectiva ecossistêmica que enxerga consequências de longo prazo"],
    sombra: ["Pode resistir a mudanças necessárias em nome da preservação","Dificuldade em aceitar que alguns sistemas precisam morrer para que novos surjam","Pode se esgotar com o peso do cuidado constante","Tendência a carregar responsabilidades que deveriam ser compartilhadas","Pode ser visto como conservador ou resistente à inovação"],
    sobrePressao: "Pressão de curto prazo conflita com sua orientação de longo prazo. Você se sente mais perturbado por ameaças ao equilíbrio do que por urgências imediatas.",
    pontosCegos: "Preservação não é sempre conservação. Às vezes o cuidado mais profundo com um sistema exige transformá-lo radicalmente.",
    relacoes: "Você é o parceiro mais confiável da matriz. Você fica. Você cuida. Você está lá. O risco é que sua paciência pode ser confundida com passividade.",
    carreiras: ["Biologia e conservação ambiental","Medicina preventiva e saúde pública","Pedagogia e educação de longo prazo","Planejamento urbano sustentável","Silvicultura e agroecologia","Patrimônio histórico e cultural"],
    fatoCurioso: "Guardiões do seu perfil frequentemente escolhem profissões cujos resultados só se manifestam em décadas. Eles plantam árvores à sombra das quais não vão sentar — e fazem isso conscientemente.",
    afirmacao: "Você foi feito para o longo prazo. Em um mundo de gratificação imediata, isso é uma forma de coragem."
  },
  "Fleumático-Espacial": {
    nome: "O Cartógrafo", emoji: "🗺️", cor: "#2471A3",
    frase: "Você não se perde. Você mapeia — e depois cuida para que outros também não se percam.",
    resumo: "Clareza visual e estrutural, paciência para documentar e organizar, capacidade de criar mapas que outros possam seguir.",
    base: {
      arquetipo: "Paciência, consistência e orientação por clareza. O Fleumático não cria sistemas para si — cria para que outros possam usar.",
      inteligencia: "Em expressão fleumática, a inteligência espacial aparece não como visão grandiosa de arquiteto — mas como precisão cartográfica. Você documenta, organiza, estrutura. Você cria o mapa que outros vão precisar.",
      combinacao: "Fleumático com inteligência espacial cria o perfil mais orientado a documentação e estruturação do conhecimento. Você tem a paciência para mapear completamente e a clareza visual para tornar o mapa utilizável. É a combinação que cria sistemas de referência — os guias que outros seguem."
    },
    descricao: "Você tem uma necessidade quase compulsiva de criar ordem no espaço — físico, informacional ou conceitual. Não é perfeccionismo estético: é funcional. Você mapeia porque acredita que a clareza serve às pessoas, e porque não suporta a ineficiência de sistemas que poderiam ser mais legíveis.",
    descricao2: "O Cartógrafo tem uma dádiva específica: consegue tornar complexo em compreensível. Não simplificando em excesso — mas encontrando a estrutura que já estava lá, esperando para ser revelada.",
    forcas: ["Capacidade de criar estruturas visuais e organizacionais claras e utilizáveis","Paciência para documentar completamente — não para no 'bom o suficiente'","Pensamento espacial que identifica relações e padrões em grandes volumes de informação","Cria sistemas de referência que sobrevivem a quem os criou","Transmite clareza sem simplificação excessiva"],
    sombra: ["Pode passar mais tempo mapeando do que agindo","Dificuldade em tolerar sistemas mal-estruturados de outros","Pode se tornar o 'arquivista' que ninguém consulta porque os outros preferem improvisar","Tendência a documentar o que deveria ser vivido","Pode ser visto como excessivamente metódico em contextos que valorizam agilidade"],
    sobrePressao: "Pressão te faz querer criar mais estrutura — o que pode ajudar ou pode atrasar. Quando o mapa não existe e o tempo é curto, você precisa aprender a navegar sem ele.",
    pontosCegos: "Nem tudo pode ser mapeado. Alguns territórios importantes da vida humana — emoções, relacionamentos, criatividade — resistem à cartografia.",
    relacoes: "Você é o parceiro que cria estrutura onde havia caos. O risco é querer mapear o relacionamento quando às vezes o que ele precisa é de presença não-estruturada.",
    carreiras: ["Cartografia e SIG","Arquitetura da informação","UX design e experiência do usuário","Gestão do conhecimento organizacional","Biblioteconomia e documentação","Planejamento estratégico"],
    fatoCurioso: "Cartógrafos do seu perfil frequentemente têm um sistema de organização doméstica ou pessoal que outras pessoas acham excessivo — e secretamente invejam quando precisam encontrar algo rapidamente.",
    afirmacao: "Você cria clareza onde havia confusão. Esse é um dos serviços mais valiosos que uma pessoa pode prestar — especialmente quando ninguém percebe quem o está prestando."
  },
  "Fleumático-Existencial": {
    nome: "O Sábio", emoji: "🌌", cor: "#5499C7",
    frase: "Você não tem pressa para entender. Sabe que as respostas mais importantes levam o tempo que levam.",
    resumo: "Profundidade filosófica, paciência com a incerteza e capacidade de habitar as grandes questões sem precisar resolvê-las.",
    base: {
      arquetipo: "Paciência com processos longos e tolerância à incerteza. O Fleumático não precisa de respostas imediatas.",
      inteligencia: "A capacidade de contemplar questões fundamentais sobre existência, sentido e propósito. Em expressão fleumática, não é urgência existencial — é contemplação serena.",
      combinacao: "Fleumático com inteligência existencial cria o perfil mais capaz de habitar a incerteza com paz. Você não é perturbado pelas grandes questões — é nutrido por elas. Enquanto outros fogem da complexidade existencial, você se sente em casa nela."
    },
    descricao: "Você tem uma relação com o não-saber que a maioria das pessoas nunca desenvolve. Não porque você desistiu de entender — mas porque aprendeu que as perguntas mais importantes têm valor em si mesmas, independentemente da resposta. Essa paz com a incerteza é uma forma rara de maturidade.",
    descricao2: "O Sábio não tem pressa. Você acredita que a compreensão profunda exige tempo — e está disposto a dar esse tempo. Isso pode parecer passividade para quem não entende, mas é, na verdade, uma forma de respeito pela complexidade do que está tentando compreender.",
    forcas: ["Capacidade rara de habitar a incerteza sem ansiedade","Profundidade filosófica que dá contexto ao que parece urgente","Paciência para desenvolver compreensões que resistem ao tempo","Presença tranquilizadora para quem está em crise existencial","Perspectiva de longo prazo que desfaz urgências artificiais"],
    sombra: ["Pode usar a contemplação como substituto para a ação","Dificuldade em se engajar com urgências práticas que parecem pequenas","Pode ser percebido como indiferente ou desengajado","Tende a evitar decisões que parecem arbitrárias diante de questões mais profundas","Pode se isolar em um mundo interior que os outros não conseguem acessar"],
    sobrePressao: "Pressão existencial te move; pressão operacional te entorpece. Situações rotineiras podem parecer fúteis — o que pode criar distância desnecessária com o mundo prático.",
    pontosCegos: "Sabedoria sem engajamento não transforma nada. Você precisa encontrar formas de trazer o que entende para o plano onde as pessoas vivem.",
    relacoes: "Você é um parceiro profundo e tranquilizador — especialmente em crises. Mas no cotidiano, sua desconexão das urgências práticas pode criar fricção. Aprenda a se importar com as coisas pequenas que importam para quem você ama.",
    carreiras: ["Filosofia e história das ideias","Liderança espiritual e religiosa","Aconselhamento e psicologia profunda","Educação em humanidades","Pesquisa em significado e bem-estar","Ética aplicada"],
    fatoCurioso: "Sábios do seu perfil frequentemente são procurados em momentos de crise existencial por pessoas que mal os conhecem. Há algo na sua presença que transmite que as grandes questões não precisam ser apressadas.",
    afirmacao: "Você habita as perguntas que outros fogem. Isso tem um valor imenso — especialmente para quem está perdido. Deixe que te encontrem."
  },
  "Sanguíneo-Corporal": {
    nome: "O Performer", emoji: "🎪", cor: "#EC407A",
    frase: "Seu corpo fala antes de você. E raramente diz a coisa errada.",
    resumo: "Presença física magnética, expressividade corporal natural e capacidade de criar experiências através do corpo.",
    base: {
      arquetipo: "Energia, expressividade e orientação para o outro. O Sanguíneo quer ser visto — e tem a intuição natural de saber como ser visto de formas que cativam.",
      inteligencia: "Em expressão sanguínea, a inteligência corporal aparece como performance e expressividade — não maestria técnica fria, mas comunicação viva através do corpo.",
      combinacao: "Sanguíneo com inteligência corporal cria o performer mais naturalmente cativante da matriz. Você não apenas age com o corpo — você se comunica com ele. Há uma fluidez entre emoção e expressão física que torna sua presença magnética."
    },
    descricao: "Você tem uma relação com o corpo que é ao mesmo tempo instrumento e linguagem. Quando você entra em um espaço, algo muda — na temperatura, na atenção, no ritmo. Você não faz isso conscientemente. É constitucional.",
    descricao2: "O Performer usa o corpo para criar experiências que outros não conseguem criar com palavras. Você traduz emoção em gesto, intenção em movimento, presença em performance. Isso não é superficialidade — é uma forma sofisticada de inteligência que nossa cultura frequentemente subestima.",
    forcas: ["Presença física magnética que transforma ambientes sem esforço aparente","Expressividade corporal que comunica além das palavras","Alta leitura de energia e estado emocional de grupos e ambientes","Capacidade de criar conexão e experiência através da performance","Adaptabilidade física e emocional a diferentes públicos e contextos"],
    sombra: ["Pode usar performance como substituto para profundidade e autenticidade","Dificuldade em ser 'ordinário' — sempre ligado, sempre performando","Pode ter dificuldade em estabelecer limites quando o público quer mais","Pode confundir atenção com afeto e validação com amor","Quando a performance cansa, a vulnerabilidade pode ser esmagadora"],
    sobrePressao: "Pressão ativa sua performance — o que pode ser uma força ou uma fuga. Você fica mais intenso, mais presente, mais 'ligado'. O problema é que você pode continuar performando mesmo quando o que a situação pede é parar e ser vulnerável.",
    pontosCegos: "Não há plateia em relacionamentos verdadeiros. A autenticidade que você busca nas pessoas ao seu redor é a mesma que elas buscam em você — e que a performance, por mais brilhante, não consegue substituir.",
    relacoes: "Você é um parceiro intenso e estimulante. O risco é que você trate relacionamentos como mais uma audiência. As pessoas mais próximas precisam de você fora do palco — às vezes vulnerável, às vezes entediante, sempre real.",
    carreiras: ["Teatro, dança e performance","Esportes de expressão","Facilitação e treinamento vivencial","Fisioterapia e educação somática","Animação e eventos","Fotografia e vídeo de performance"],
    fatoCurioso: "Performers do seu perfil frequentemente descrevem um estado alterado durante a performance — onde o 'eu' desaparece e algo maior assume. É uma forma de acesso a uma inteligência que a mente racional não alcança.",
    afirmacao: "Você tem o dom de criar experiências que as pessoas não esquecem. Mas a experiência mais importante que você pode oferecer é você mesmo — sem performance."
  },
  "Sanguíneo-Musical": {
    nome: "O Improvisador", emoji: "🎺", cor: "#D68910",
    frase: "Você não segue partitura. Você cria o próximo compasso em tempo real.",
    resumo: "Criatividade espontânea, adaptabilidade ao momento e capacidade de transformar qualquer contexto em algo interessante.",
    base: {
      arquetipo: "Espontaneidade, adaptabilidade e orientação para o presente. O Sanguíneo não planeja para meses — age no que está acontecendo agora.",
      inteligencia: "Em expressão sanguínea, a inteligência musical aparece como improvisação — não como leitura rigorosa de partituras, mas como criação responsiva ao momento e ao ambiente.",
      combinacao: "Sanguíneo com inteligência musical cria o improvisador mais natural da matriz. Você responde ao ambiente como um músico de jazz responde aos outros instrumentistas — em tempo real, com sensibilidade ao que está acontecendo agora, criando algo que só existe naquele momento."
    },
    descricao: "Você tem uma capacidade rara: criar no momento. Não improvisa porque não planejou — improvisa porque o presente oferece algo que o plano não poderia antecipar. Sua criatividade é responsiva, viva e nunca exatamente igual duas vezes.",
    descricao2: "O Improvisador não tem medo do inesperado. De fato, o inesperado é onde você brilha. Enquanto outros ficam paralisados quando o plano falha, você encontra a oportunidade que a falha criou. Isso não é ingenuidade — é uma forma de inteligência situacional que perfis mais planejadores raramente acessam.",
    forcas: ["Criatividade em tempo real, responsiva ao contexto e ao momento","Alta tolerância ao inesperado e à mudança de planos","Senso de timing excepcional em situações dinâmicas","Capacidade de criar conexão e energia em qualquer ambiente","Adaptabilidade que parece mágica para quem só conhece o planejamento"],
    sombra: ["Pode usar a improvisação como desculpa para a falta de preparação","Dificuldade em compromissos de longo prazo que exigem consistência","Pode criar caos em situações que precisariam de estrutura","A espontaneidade pode parecer irresponsabilidade para perfis mais planejadores","Pode se entediar com a repetição necessária para consolidar o que criou"],
    sobrePressao: "Pressão é seu elemento natural. Você não apenas funciona bem em crises — você funciona melhor nelas. O risco é criar crises desnecessárias para ter onde brilhar.",
    pontosCegos: "Improvisação sem fundamento técnico é ruído. Os melhores improvisadores do mundo têm décadas de prática antes de 'soltar'. Sua espontaneidade é mais poderosa quando tem estrutura embaixo — mesmo que a estrutura não apareça.",
    relacoes: "Você é um parceiro estimulante e imprevisível — raramente entediante. O risco é que imprevisibilidade pode ser cansativa para quem precisa de segurança. Aprenda a criar consistência nas coisas que importam.",
    carreiras: ["Música de jazz e improvisação","Comédia e teatro de improv","Facilitação criativa","Consultoria em inovação","Comunicação de crise","Design de experiências"],
    fatoCurioso: "Improvisadores do seu perfil frequentemente descrevem seus melhores momentos como algo que 'aconteceu através deles' — não deliberado. É criatividade em estado puro, sem o filtro da intenção consciente.",
    afirmacao: "Você tem o dom do presente. Mas o presente mais rico é construído sobre um passado de prática que ninguém viu. Não pule o treino."
  },
  "Sanguíneo-Naturalista": {
    nome: "O Aventureiro", emoji: "🌍", cor: "#DC7633",
    frase: "O mundo não é um risco a ser evitado. É um território a ser explorado.",
    resumo: "Curiosidade pelo mundo natural e humano, energia para ir onde outros hesitam e capacidade de se adaptar a qualquer ambiente.",
    base: {
      arquetipo: "Abertura ao novo, energia para exploração e capacidade de se conectar com qualquer ambiente ou pessoa.",
      inteligencia: "Em expressão sanguínea, a inteligência naturalista aparece como exploração — não como estudo metódico, mas como imersão ativa e curiosa no mundo físico e humano.",
      combinacao: "Sanguíneo com inteligência naturalista cria o perfil mais orientado à exploração física do mundo. Você não apenas observa — experimenta. Você não estuda ambientes — os habita. Onde outros precisam de teoria, você precisa de imersão."
    },
    descricao: "Você tem uma relação com o mundo que é ao mesmo tempo curiosa e física. Você quer ver, tocar, provar, sentir. A teoria é apenas a preparação para a experiência real — e a experiência real é sempre mais complexa, mais interessante e mais viva do que qualquer teoria previa.",
    descricao2: "O Aventureiro tem uma facilidade rara de se adaptar a ambientes muito diferentes — culturas, climas, comunidades. Você não apenas sobrevive fora da sua zona de conforto: você floresce nela. Cada novo território oferece algo que o anterior não poderia — e você está sempre pronto para o próximo.",
    forcas: ["Alta adaptabilidade a ambientes físicos, culturais e sociais diferentes","Curiosidade genuína que abre portas onde outros encontram resistência","Capacidade de se conectar com pessoas de origens muito diferentes","Energia física e mental para territórios inexplorados","Leitura rápida de novos ambientes e dinâmicas"],
    sombra: ["Pode evitar compromissos sedentários que exigiriam ficar em um lugar","Dificuldade em criar raízes — tanto geográficas quanto relacionais","Pode usar a exploração como fuga de algo que precisa ser enfrentado","Tende a subestimar o valor da familiaridade e da profundidade em um lugar","A aventura pode se tornar um fim em si mesmo, sem conexão com propósito maior"],
    sobrePressao: "Pressão te faz querer se mover — literalmente. Quando situações ficam difíceis, seu instinto é explorar novas opções, novos lugares, novas perspectivas. Isso pode ser genial ou pode ser fuga.",
    pontosCegos: "O mundo não é apenas um território a ser conquistado. Alguns dos ecossistemas mais ricos — relacionamentos, comunidades, culturas — precisam que você fique. A profundidade que a imobilidade cria é diferente e complementar à que o movimento cria.",
    relacoes: "Você é um parceiro estimulante — cheio de histórias, experiências e energia. O desafio é que relacionamentos profundos exigem que você fique — fisicamente e emocionalmente — por mais tempo do que seu instinto permite.",
    carreiras: ["Antropologia e etnografia","Jornalismo de campo e reportagem","Turismo de aventura e expedições","Biologia de campo","Diplomacia e cooperação internacional","Guia e educação ao ar livre"],
    fatoCurioso: "Aventureiros do seu perfil frequentemente descrevem um estado de hiper-presença em ambientes desconhecidos — todos os sentidos ativados, memória fotográfica do que viveram. É o oposto da distração cotidiana.",
    afirmacao: "Você foi feito para territórios inexplorados. Mas os territórios mais inexplorados são às vezes os mais próximos — dentro de você, ou na pessoa que você já conhece há anos."
  },
  "Sanguíneo-Espacial": {
    nome: "O Estilista", emoji: "✨", cor: "#AF7AC5",
    frase: "Você não apenas vê o espaço. Você vê o que ele poderia comunicar.",
    resumo: "Sensibilidade visual aguçada, capacidade de criar estética com facilidade e dom natural para fazer ambientes e pessoas comunicarem o que precisam.",
    base: {
      arquetipo: "Expressividade, orientação para o outro e sensibilidade à impressão que as coisas causam. O Sanguíneo pensa naturalmente em como algo vai ser percebido pelos outros.",
      inteligencia: "Em expressão sanguínea, a inteligência espacial aparece não como precisão técnica de arquiteto, mas como sensibilidade estética — a capacidade de perceber e criar ambientes que comunicam e seduzem.",
      combinacao: "Sanguíneo com inteligência espacial cria o perfil mais orientado à estética e à experiência visual da matriz. Você tem a sensibilidade para perceber o que é belo e o instinto social para entender o que comunica para as pessoas certas."
    },
    descricao: "Você tem uma relação com o visual que é ao mesmo tempo intuitiva e sofisticada. Você percebe o que está errado num ambiente antes de poder articular por quê. Você tem opinião sobre cores, formas, proporções — e raramente está errado.",
    descricao2: "O Estilista não cria apenas pelo prazer estético — cria para comunicar. Você entende que espaços, roupas, imagens e objetos falam. E você tem a habilidade de fazer com que digam exatamente o que precisa ser dito para as pessoas certas no momento certo.",
    forcas: ["Sensibilidade estética excepcional que percebe o que outros não veem","Capacidade de criar ambientes e imagens que comunicam e seduzem","Instinto para o que vai funcionar visualmente antes de testar","Alta adaptabilidade estética — você consegue trabalhar em muitos estilos","Leitura rápida do que um ambiente ou imagem está comunicando"],
    sombra: ["Pode priorizar a aparência sobre a substância","Dificuldade em aceitar o esteticamente 'imperfeito' mesmo quando é funcional","Pode ser superficial em contextos que pedem profundidade técnica","A preocupação com a imagem pode mascarar vulnerabilidade real","Pode subestimar o que não tem valor visual aparente"],
    sobrePressao: "Pressão pode ativar sua necessidade de controlar a aparência das coisas — o que pode ser uma forma de ansiedade disfarçada de produtividade. Às vezes você arruma o ambiente quando deveria enfrentar o problema.",
    pontosCegos: "Beleza sem função é decoração. Você tem sensibilidade para criar o belo — mas o mais duradouro é o belo que serve. Aprenda a equilibrar o que parece com o que funciona.",
    relacoes: "Você é um parceiro atento à experiência — você cria momentos, ambientes e memórias. O risco é que essa atenção à estética pode mascarar dificuldade com o que é feio, imperfeito ou desordenado na vida real.",
    carreiras: ["Moda e design de moda","Design de interiores e ambientes","Fotografia e direção de arte","Branding e identidade visual","Cenografia","Curadoria de arte"],
    fatoCurioso: "Estilistas do seu perfil frequentemente reorganizam espaços quando estão ansiosos — como se a desordem visual fosse uma extensão da desordem interna que precisam resolver.",
    afirmacao: "Você tem o dom de fazer o mundo mais belo. Mas a beleza mais duradoura emerge de dentro para fora — não de fora para dentro."
  },
  "Sanguíneo-Existencial": {
    nome: "O Buscador", emoji: "🔭", cor: "#EC7063",
    frase: "Você não faz perguntas sobre a vida. Você faz perguntas que mudam a vida de quem você encontra.",
    resumo: "Curiosidade existencial combinada com abertura social — você filosofa em voz alta, com pessoas, e raramente em solidão.",
    base: {
      arquetipo: "Expressividade, orientação para o outro e necessidade de compartilhar. O Sanguíneo não pensa em silêncio — pensa em conversa.",
      inteligencia: "Em expressão sanguínea, a inteligência existencial não é contemplação solitária — é diálogo. Você explora as grandes questões com outros, através de conversas, histórias e conexões.",
      combinacao: "Sanguíneo com inteligência existencial cria o filósofo mais social da matriz. Você não apenas contempla o sentido — você o busca ativamente, em conexão com outros, através de experiências e conversas que poucos ousam ter."
    },
    descricao: "Você tem a capacidade rara de trazer questões profundas para conversas cotidianas sem parecer pedante ou pesado. As pessoas saem de encontros com você com perguntas que não tinham antes — e frequentemente agradecem por isso, mesmo sem saber exatamente por quê.",
    descricao2: "O Buscador não se contenta com o superficial — não como exigência, mas como curiosidade genuína. Você quer saber o que as pessoas realmente acreditam, o que as move, o que as assusta. E tem o carisma para fazer essa profundidade parecer confortável e natural.",
    forcas: ["Capacidade de criar conversas profundas com facilidade e naturalidade","Curiosidade existencial que enriquece qualquer conexão","Habilidade de fazer perguntas que revelam o que as pessoas não sabiam que pensavam","Alta tolerância para a ambiguidade das grandes questões","Energia para explorar o sentido em experiências, não apenas em textos"],
    sombra: ["Pode evitar o cotidiano em busca de significado — e o cotidiano também é vida","Dificuldade com relacionamentos que não incluem profundidade filosófica","Pode ser percebido como intenso ou pesado em contextos mais leves","A busca por sentido pode se tornar uma fuga da responsabilidade imediata","Pode colecionar perguntas sem nunca chegar a comprometimentos reais"],
    sobrePressao: "Pressão existencial te energiza; pressão operacional pode paralisá-lo. Você funciona melhor quando as questões são grandes. Detalhes e urgências pequenas podem parecer ruído irrelevante.",
    pontosCegos: "Nem toda conversa precisa de profundidade. Nem toda pessoa está pronta para as questões que você quer fazer. Aprender a ler quando a leveza é o que o momento pede é uma forma de sabedoria que você ainda está desenvolvendo.",
    relacoes: "Você é um parceiro profundo e estimulante — raramente entediante. O risco é exigir que o relacionamento seja sempre significativo. Às vezes amor é silêncio, rotina e a ausência de grandes questões.",
    carreiras: ["Filosofia pública e divulgação","Educação transformadora","Coaching e desenvolvimento pessoal","Jornalismo de ideias","Liderança espiritual e comunitária","Empreendedorismo com propósito"],
    fatoCurioso: "Buscadores do seu perfil frequentemente são lembrados por conversas únicas que tiveram com estranhos em situações inesperadas — aviões, filas, festas. Você cria espaço para profundidade onde ninguém esperava que ela coubesse.",
    afirmacao: "Você tem o dom de fazer as perguntas que importam. Mas as perguntas mais importantes que você pode fazer são aquelas sobre você mesmo — não apenas sobre o mundo."
  },
  "Melancólico-Corporal": {
    nome: "O Asceta", emoji: "🧘", cor: "#5D6D7E",
    frase: "Você usa o corpo para ir além do corpo.",
    resumo: "Disciplina física como caminho de autoconhecimento, maestria através do silêncio e da repetição, e capacidade de habitar o corpo com profundidade que outros não acessam.",
    base: {
      arquetipo: "Profundidade, introspecção e busca de autenticidade. O Melancólico usa o que tem — inclusive o corpo — como instrumento de descoberta, não de exibição.",
      inteligencia: "Em expressão melancólica, a inteligência corporal não é performance — é prática. É a disciplina silenciosa que conduz ao domínio. É o corpo como caminho de autoconhecimento.",
      combinacao: "Melancólico com inteligência corporal cria o perfil mais orientado à maestria interior da matriz. Você não usa o corpo para ser visto — usa o corpo para se conhecer. A prática repetitiva não é tédio para você: é meditação em movimento."
    },
    descricao: "Você tem uma relação com o corpo que é ao mesmo tempo disciplinada e espiritual. Para você, a prática física não é sobre performance ou aparência — é sobre o que emerge quando você está completamente presente no movimento. O que você aprende sobre si mesmo durante uma prática intensa não tem equivalente em palavras.",
    descricao2: "O Asceta encontra nos limites do corpo uma liberdade que outros procuram em outros lugares. A dor, o esforço, a repetição — não são obstáculos para você. São o caminho. Cada limite superado revela algo sobre quem você é que a teoria não conseguia mostrar.",
    forcas: ["Disciplina física excepcional sustentada por motivação interna, não externa","Presença corporal profunda — você habita o corpo completamente","Alta tolerância à dificuldade física e ao desconforto como processo de crescimento","Aprendizado corporal que vai muito além do técnico — é experiencial e duradouro","Capacidade de usar a prática física como instrumento real de autoconhecimento"],
    sombra: ["Pode usar a disciplina física como punição ou como fuga emocional","Tendência ao isolamento — a prática pode se tornar um mundo próprio hermético","Pode ser excessivamente duro consigo mesmo em relação ao corpo","Dificuldade em celebrar conquistas físicas — sempre há mais a alcançar","Pode confundir sofrimento com mérito"],
    sobrePressao: "Pressão te leva para o corpo — você processa emocionalmente através do movimento. Isso pode ser saudável ou pode ser dissociativo. Aprenda a diferenciar quando você está integrando e quando está fugindo.",
    pontosCegos: "O corpo tem limites. Sua tolerância à dor pode te impedir de ouvir quando ele está pedindo pausa. Maestria corporal sustentável inclui recuperação — não apenas esforço. O descanso também é prática.",
    relacoes: "Você é um parceiro comprometido e disciplinado. O risco é que sua introversão e sua dedicação à prática podem criar distâncias. Aprenda a trazer a profundidade que você encontra no silêncio para a conexão com o outro.",
    carreiras: ["Artes marciais tradicionais e meditação em movimento","Yoga e práticas corporais contemplativas","Dança contemporânea e somática","Medicina tradicional e integrativa","Atletismo de resistência","Psicologia somática"],
    fatoCurioso: "Ascetas do seu perfil frequentemente descrevem momentos de clareza intensa durante práticas físicas exigentes — estados que a filosofia e a psicologia chamam de diferentes nomes, mas que você reconhece como encontros consigo mesmo.",
    afirmacao: "Você encontrou no corpo um caminho para o que muitos buscam em outros lugares. Cuide para que o caminho não se torne uma prisão."
  },
  "Melancólico-Musical": {
    nome: "O Compositor", emoji: "🎻", cor: "#5B2C6F",
    frase: "Você não toca para ser ouvido. Toca para dizer o que palavras não alcançam.",
    resumo: "Profundidade emocional expressa através do som, sensibilidade a nuances que outros não percebem e capacidade de criar música que toca onde palavras não chegam.",
    base: {
      arquetipo: "Profundidade emocional e necessidade de expressão autêntica. O Melancólico não cria para agradar — cria para processar e comunicar o que não encontra outro canal adequado.",
      inteligencia: "Em expressão melancólica, a inteligência musical é menos sobre performance técnica e mais sobre expressão emocional precisa. Você usa o som como linguagem direta do que sente.",
      combinacao: "Melancólico com inteligência musical cria o compositor mais emocionalmente profundo da matriz. Você tem o vocabulário emocional interno e a linguagem musical para expressá-lo de forma que ressoa em quem ouve — mesmo que nunca tenha vivido o que você viveu."
    },
    descricao: "Você tem uma relação com a música que vai além do técnico. Para você, a música não é entretenimento — é linguagem. É o modo mais direto de comunicar o que sua vida interior contém de mais verdadeiro e de mais difícil de articular de outra forma.",
    descricao2: "O Compositor não separa vida e obra. O que ele vive, soa. O que ele sente, vira harmonia — ou dissonância deliberada. Há uma autenticidade na sua música que quem ouve sente mesmo sem saber nomear: a sensação de que alguém estava lá, nesse lugar, e sobreviveu para criar algo a partir disso.",
    forcas: ["Expressão musical com profundidade emocional que poucos alcançam","Sensibilidade a nuances harmônicas e melódicas que outros não percebem","Capacidade de criar obras que envelhecem bem — o tempo revela camadas novas","Autenticidade que torna o trabalho reconhecível e inimitável","Processo criativo que transforma experiência vivida em forma sonora universal"],
    sombra: ["Pode usar a música como substituto para processar emocionalmente no presente","Hipersensibilidade à crítica que paralisa a criação ou a partilha","Dificuldade em criar sob demanda ou para fins que não ressoam internamente","Tende a se isolar durante os períodos de criação mais intensa","Pode romantizar o sofrimento como fonte criativa necessária"],
    sobrePressao: "Pressão emocional intensa é, paradoxalmente, seu momento de maior criatividade. Não porque você seja masoquista — mas porque é quando mais precisa da música como linguagem. O que não consegue dizer em palavras encontra forma no som.",
    pontosCegos: "A música mais duradoura combina profundidade emocional com rigor técnico. Sua profundidade está garantida — mas o rigor precisa ser cultivado com a mesma dedicação. A emoção sem forma não chega ao outro com toda a sua força.",
    relacoes: "Você é um parceiro profundo e raramente superficial. O risco é que sua vida interior intensa pode criar distância — você pode estar presente fisicamente mas ausente em algum lugar onde a próxima obra está se formando.",
    carreiras: ["Composição e teoria musical","Cinema e trilha sonora","Musicoterapia","Performance musical intimista","Produção musical autoral","Pesquisa em música e emoção"],
    fatoCurioso: "Compositores do seu perfil frequentemente descrevem obras que 'se escreveram sozinhas' — onde eles eram apenas o veículo. Essa experiência de criação involuntária é um dos estados mais descritos por artistas em flow profundo.",
    afirmacao: "Você tem um vocabulário emocional que a maioria das pessoas não tem acesso. Compartilhe — mesmo que assuste. Especialmente quando assusta."
  },
  "Melancólico-Naturalista": {
    nome: "O Observador", emoji: "🦋", cor: "#1F618D",
    frase: "Você vê o que outros passam sem notar. E isso muda como você entende tudo.",
    resumo: "Atenção minuciosa aos detalhes, capacidade de perceber padrões sutis e profundidade contemplativa diante do mundo natural e humano.",
    base: {
      arquetipo: "Profundidade, atenção e necessidade de compreensão genuína. O Melancólico não observa superficialmente — observa até entender de verdade.",
      inteligencia: "Em expressão melancólica, a inteligência naturalista não é exploração ativa — é contemplação profunda. Você não corre pelo campo. Você se senta e observa até que o campo te revele algo.",
      combinacao: "Melancólico com inteligência naturalista cria o observador mais paciente e mais profundo da matriz. Você tem a paciência para esperar que o mundo mostre o que quer mostrar — e a profundidade para entender o que viu."
    },
    descricao: "Você tem uma atenção ao detalhe que a maioria das pessoas simplesmente não possui. Não porque você force — mas porque você não consegue não notar. A folha que caiu de um jeito diferente, o padrão no comportamento de um animal, a mudança sutil num ecossistema — você vê porque está realmente olhando, não apenas passando os olhos.",
    descricao2: "O Observador não apressa a compreensão. Você sabe que os sistemas mais complexos revelam sua lógica lentamente — e está disposto a dar esse tempo. Isso torna suas conclusões mais confiáveis do que as de quem chegou primeiro mas olhou de longe.",
    forcas: ["Atenção ao detalhe que raramente deixa algo importante escapar","Paciência para observar completamente antes de concluir","Capacidade de perceber padrões e conexões sutis em sistemas complexos","Profundidade contemplativa que produz compreensão genuína, não apenas informação","Perspectiva de longo prazo que enxerga tendências antes que se tornem óbvias"],
    sombra: ["Pode passar tanto tempo observando que esquece de agir","Tende ao isolamento quando os ambientes são muito caóticos ou superficiais","Pode se sentir incompreendido em contextos que valorizam velocidade sobre profundidade","Dificuldade em compartilhar o que vê de formas que os outros consigam acessar","Pode carregar o peso do que observa sem ter onde depositar"],
    sobrePressao: "Pressão te faz querer mais tempo para observar — o que pode ser uma genuína necessidade ou um adiamento. Aprenda a distinguir quando você ainda está coletando dados essenciais e quando está apenas evitando a conclusão que já chegou.",
    pontosCegos: "Observação sem participação é solidão. Os sistemas que você estuda mais intensamente — humanos, ecossistemas, comunidades — precisam de você não apenas como observador, mas como participante.",
    relacoes: "Você é um parceiro atento e cuidadoso — que percebe detalhes que o outro nem sabe que existe. O risco é que sua tendência à observação pode criar distância: você olha de dentro para fora quando a outra pessoa precisa que você esteja simplesmente presente.",
    carreiras: ["Biologia e zoologia de campo","Ecologia e ciências ambientais","Psicologia observacional","Antropologia e etnografia","Fotografia de natureza","Pesquisa em comportamento animal e humano"],
    fatoCurioso: "Observadores do seu perfil frequentemente notam detalhes em ambientes que voltam semanas depois e que outras pessoas nunca perceberam que existiam. Seu processamento visual e perceptual opera em camadas que a maioria nunca acessa conscientemente.",
    afirmacao: "Você foi feito para ver o que outros passam sem notar. Esse dom precisa ser compartilhado — não apenas registrado."
  },
  "Melancólico-Espacial": {
    nome: "O Visionário Silencioso", emoji: "🌑", cor: "#512E5F",
    frase: "Você projeta mundos inteiros antes de dizer uma palavra — e raramente alguém imagina o que está acontecendo dentro de você.",
    resumo: "Imaginação visual intensa e privada, capacidade de criar espaços e imagens que expressam o inexprimível e profundidade estética que vai além do decorativo.",
    base: {
      arquetipo: "Vida interior intensa, processamento antes de compartilhar e orientação por autenticidade. O Melancólico não cria para impressionar — cria para entender e expressar algo que não encontra outro canal.",
      inteligencia: "Em expressão melancólica, a inteligência espacial aparece como imaginação visual interior de grande riqueza. Você não apenas vê o espaço — você cria mundos mentais que poucos conseguem acessar.",
      combinacao: "Melancólico com inteligência espacial cria o artista visual mais profundo da matriz. Você tem a riqueza interior melancólica e a capacidade de expressá-la visualmente com precisão. O resultado é arte e design que transcende o funcional para tocar algo mais fundamental na experiência humana."
    },
    descricao: "Você tem uma vida visual interior de grande riqueza — mundos que existem completamente na sua mente antes de qualquer papel, tela ou espaço físico. Quando você finalmente externaliza o que está lá dentro, as pessoas frequentemente ficam surpresas com o quanto estava acontecendo em silêncio.",
    descricao2: "O Visionário Silencioso não cria para decorar — cria para revelar. Suas obras têm uma qualidade que vai além do estético: há algo que faz o observador sentir que aquele espaço, aquela imagem, aquele objeto sabe algo sobre ele que ele mesmo não sabia.",
    forcas: ["Imaginação visual de grande riqueza e profundidade interior","Capacidade de criar espaços e imagens que expressam o que linguagem não alcança","Profundidade estética que vai além do decorativo — toca algo essencial","Processo criativo introspectivo que produz trabalho com camadas de significado","Precisão visual que traduz estados internos complexos em formas reconhecíveis"],
    sombra: ["Pode demorar muito para externalizar o que está desenvolvendo internamente","Hipersensibilidade à recepção do trabalho — separar obra de si mesmo é difícil","Dificuldade em criar para fins que não ressoam autenticamente","Pode se isolar em mundos visuais internos que funcionam como refúgio permanente","Tende a subestimar o próprio trabalho em comparação com o de outros"],
    sobrePressao: "Pressão bloqueia sua criação. Você precisa de silêncio, de tempo e de espaço interno para criar. Quando esses elementos não existem, o que sai pode parecer vazio — mesmo que tecnicamente correto.",
    pontosCegos: "O trabalho mais poderoso frequentemente precisa ser compartilhado antes de estar 'pronto'. Sua tendência a esperar a versão perfeita do que está na sua cabeça pode significar que o mundo nunca vê o que você viu.",
    relacoes: "Você é um parceiro com vida interior rica e presença cuidadosa. O risco é que o outro sinta que está relacionando-se com alguém que está sempre parcialmente em outro lugar — no mundo visual que existe antes das palavras.",
    carreiras: ["Arte contemporânea e instalações","Arquitetura de conceito","Direção de arte e design editorial","Cenografia e design de exposições","Ilustração e concept art","Fotografia artística"],
    fatoCurioso: "Visionários Silenciosos do seu perfil têm sketchbooks, arquivos ou pastas de referência visual que nunca mostram a ninguém — uma coleção do mundo que existe dentro deles antes de existir fora.",
    afirmacao: "Você tem mundos inteiros vivendo em você. Deixe que existam fora também — mesmo imperfeitos, mesmo antes de estar pronto."
  },
  "Melancólico-Existencial": {
    nome: "O Filósofo", emoji: "∞", cor: "#2C3E50",
    frase: "Você não vive a vida — você a interroga. E é exatamente por isso que a vive com maior profundidade.",
    resumo: "O perfil de maior profundidade existencial da matriz. Você não aceita respostas fáceis para perguntas difíceis — e isso tem um preço e um valor imensos.",
    base: {
      arquetipo: "Profundidade, introspecção e orientação por autenticidade. O Melancólico não se contenta com superfícies. Vai fundo — mesmo quando o fundo é desconfortável ou assustador.",
      inteligencia: "Em expressão melancólica, a inteligência existencial não é busca externa por sentido — é contemplação interna das grandes questões. Você não apenas pensa sobre a vida e a morte: você as habita como perguntas constantes que atravessam cada escolha.",
      combinacao: "Melancólico com inteligência existencial é a combinação de maior profundidade filosófica da matriz — e a que produz tanto a maior sabedoria quanto o maior sofrimento existencial. Você não consegue não pensar sobre o que importa. Isso te torna profundo e te custa caro."
    },
    descricao: "Você tem uma relação com as questões fundamentais da existência que vai além do interesse intelectual. Para você, perguntas sobre sentido, morte, autenticidade e o valor da vida não são abstrações — são urgências reais que atravessam cada escolha, cada relacionamento, cada momento de quietude.",
    descricao2: "O Filósofo melancólico não filosofa para impressionar. Filosofa porque não consegue não filosofar. É uma necessidade constitucional — como outros precisam respirar, você precisa questionar. E essa necessidade, quando encontra espaço, produz compreensão de uma profundidade que poucos alcançam.",
    forcas: ["Profundidade filosófica que ilumina o que outros passam sem perceber","Capacidade de habitar a incerteza e a complexidade sem precisar resolvê-las","Honestidade intelectual que raramente aceita respostas fáceis para questões difíceis","Presença que transmite seriedade e profundidade em momentos de crise existencial","Perspectiva que desafia suposições e convida ao pensamento mais profundo"],
    sombra: ["Pode se perder em questões existenciais ao ponto de paralisia prática","Tendência à melancolia existencial que pode se tornar depressão sem cuidado","Dificuldade em se conectar com pessoas que vivem mais na superfície","Pode criar distância em relacionamentos com a intensidade do questionamento","Pode usar a filosofia como defesa contra o engajamento emocional direto"],
    sobrePressao: "Pressão existencial — a sensação de que algo fundamental está em jogo — é o que mais te mobiliza. Pressão operacional pode parecer irrelevante diante das questões mais profundas que você carrega. Isso pode ser sabedoria ou pode ser dissociação.",
    pontosCegos: "A contemplação que não se conecta com o mundo concreto é introspecção isolada. As respostas que você busca às grandes questões estão, em parte, na vida que você permite acontecer — nos relacionamentos, nas escolhas, nos comprometimentos que você faz apesar da incerteza.",
    relacoes: "Você é um parceiro de rara profundidade — alguém que nunca se contenta com o superficial. O risco é que a intensidade do seu questionamento pode criar peso em relacionamentos. Aprenda a estar presente sem precisar que cada momento seja filosoficamente significativo.",
    carreiras: ["Filosofia e história das ideias","Psicologia profunda e psicoterapia existencial","Teologia e espiritualidade","Bioética e ética aplicada","Literatura de ideias","Liderança contemplativa"],
    fatoCurioso: "Filósofos do seu perfil frequentemente descrevem um momento na adolescência ou infância em que perceberam, de forma aguda, que as pessoas ao seu redor viviam como se as grandes questões não existissem — e que essa percepção mudou tudo. É o momento em que o Filósofo nasce.",
    afirmacao: "Você vive as perguntas que outros fogem. Esse é um dos dons mais raros da consciência humana. Use-o para iluminar — não apenas para questionar."
  }
};

const questions = [
  // Temperamento (5) + Inteligência (9) — cada inteligência aparece exatamente 4x
  { id:1, texto:"Em um grupo, você naturalmente:", opcoes:[{texto:"Assume a liderança e define o rumo",tipo:"colerico"},{texto:"Mantém a harmonia e evita conflitos",tipo:"fleumatico"},{texto:"Anima o ambiente e conecta as pessoas",tipo:"sanguineo"},{texto:"Observa, analisa e contribui com profundidade",tipo:"melancolico"}]},
  { id:2, texto:"Num projeto novo em grupo, qual papel você assume com mais naturalidade?", opcoes:[{texto:"Estruturar o plano, a lógica e os números por trás de tudo",tipo:"logica"},{texto:"Entender as pessoas do time e alinhar o que cada uma precisa",tipo:"interpessoal"},{texto:"Inventar o conceito e propor o que ninguém ainda pensou",tipo:"criativa"},{texto:"Sentir o ritmo do grupo e ajustar o tom para tudo fluir",tipo:"musical"}]},
  { id:3, texto:"O que você nota primeiro ao entrar num ambiente novo?", opcoes:[{texto:"O clima entre as pessoas — quem está conectado com quem",tipo:"interpessoal"},{texto:"As conversas: o que é dito e, principalmente, o que não é",tipo:"linguistica"},{texto:"O espaço físico e como meu corpo se sente nele",tipo:"corporal"},{texto:"Os padrões — o que se repete e o que está fora do lugar",tipo:"naturalista"}]},
  { id:4, texto:"Quando algo não sai como planejado, você:", opcoes:[{texto:"Recalcula e toma o controle da situação rapidamente",tipo:"colerico"},{texto:"Mantém a calma e espera o momento certo para agir",tipo:"fleumatico"},{texto:"Fala sobre isso e busca apoio",tipo:"sanguineo"},{texto:"Internaliza, analisa o que deu errado e sente o peso",tipo:"melancolico"}]},
  { id:5, texto:"Como você prefere dar forma a uma ideia que considera importante?", opcoes:[{texto:"Escrevendo ou falando, com as palavras exatas",tipo:"linguistica"},{texto:"Criando algo original que a traduza",tipo:"criativa"},{texto:"Pelo ritmo e pela cadência — por como aquilo 'soa'",tipo:"musical"},{texto:"Desenhando, mapeando, mostrando de forma visual",tipo:"espacial"}]},
  { id:6, texto:"O que mais te dá a sensação de 'isso faz sentido pra mim'?", opcoes:[{texto:"Criar algo que não existia antes",tipo:"criativa"},{texto:"Usar o corpo com maestria — fazer com as próprias mãos",tipo:"corporal"},{texto:"Entender como os sistemas e a natureza se conectam",tipo:"naturalista"},{texto:"Tocar nas questões profundas sobre o sentido das coisas",tipo:"existencial"}]},
  { id:7, texto:"Qual dessas frases mais representa você?", opcoes:[{texto:"Eu prefiro ser respeitado a ser querido",tipo:"colerico"},{texto:"Eu prefiro paz a ter razão",tipo:"fleumatico"},{texto:"Eu prefiro estar cercado de pessoas a estar sozinho",tipo:"sanguineo"},{texto:"Eu prefiro profundidade a popularidade",tipo:"melancolico"}]},
  { id:8, texto:"Qual habilidade as pessoas mais reconhecem em você?", opcoes:[{texto:"Destreza física, coordenação e presença",tipo:"corporal"},{texto:"Senso de ritmo e de timing",tipo:"musical"},{texto:"Visão espacial — enxergar como as coisas se encaixam",tipo:"espacial"},{texto:"Raciocínio lógico e capacidade de resolver problemas",tipo:"logica"}]},
  { id:9, texto:"O que te absorve a ponto de fazer você perder a noção do tempo?", opcoes:[{texto:"Música, ritmo e som",tipo:"musical"},{texto:"Observar a natureza, os animais, os padrões do mundo",tipo:"naturalista"},{texto:"Refletir sobre a vida, o universo e o sentido de tudo",tipo:"existencial"},{texto:"Uma conversa profunda com alguém",tipo:"interpessoal"}]},
  { id:10, texto:"Qual é sua maior fonte de energia?", opcoes:[{texto:"Conquistar metas e superar desafios",tipo:"colerico"},{texto:"Ambientes estáveis e relacionamentos seguros",tipo:"fleumatico"},{texto:"Interações sociais e novas conexões",tipo:"sanguineo"},{texto:"Tempo sozinho para pensar e criar",tipo:"melancolico"}]},
  { id:11, texto:"Diante de um problema complexo, qual é o seu instinto?", opcoes:[{texto:"Observar o sistema inteiro e como as partes se relacionam",tipo:"naturalista"},{texto:"Visualizar a solução como uma estrutura ou um mapa",tipo:"espacial"},{texto:"Quebrar em partes lógicas e resolver passo a passo",tipo:"logica"},{texto:"Colocar o problema em palavras para enxergá-lo melhor",tipo:"linguistica"}]},
  { id:12, texto:"O que você mais valoriza numa experiência marcante?", opcoes:[{texto:"A beleza visual e como o espaço foi organizado",tipo:"espacial"},{texto:"O significado mais profundo por trás dela",tipo:"existencial"},{texto:"As pessoas e as conexões que você criou ali",tipo:"interpessoal"},{texto:"A originalidade — algo que te surpreendeu",tipo:"criativa"}]},
  { id:13, texto:"No fundo, o que mais te move quando ninguém está olhando?", opcoes:[{texto:"A vontade de vencer e provar do que sou capaz",tipo:"colerico"},{texto:"O desejo de paz e de seguir no meu próprio ritmo",tipo:"fleumatico"},{texto:"A busca por emoção, novidade e pessoas",tipo:"sanguineo"},{texto:"A necessidade de dar sentido profundo ao que vivo",tipo:"melancolico"}]},
  { id:14, texto:"Quando você aprende algo novo, o que mais te motiva?", opcoes:[{texto:"Entender o 'porquê' último daquilo",tipo:"existencial"},{texto:"Dominar a lógica e a estrutura do assunto",tipo:"logica"},{texto:"Conseguir explicar e ensinar com clareza",tipo:"linguistica"},{texto:"Colocar a mão na massa e praticar de verdade",tipo:"corporal"}]}
];

function calcularPerfil(respostas) {
  const s = { logica:0,interpessoal:0,linguistica:0,criativa:0,corporal:0,musical:0,naturalista:0,espacial:0,existencial:0,colerico:0,fleumatico:0,sanguineo:0,melancolico:0 };
  respostas.forEach(r=>{ if(r&&s[r]!==undefined) s[r]++; });
  const iTop = ["logica","interpessoal","linguistica","criativa","corporal","musical","naturalista","espacial","existencial"].reduce((a,b)=>s[a]>=s[b]?a:b);
  const tTop = ["colerico","fleumatico","sanguineo","melancolico"].reduce((a,b)=>s[a]>=s[b]?a:b);
  const tN={colerico:"Colérico",fleumatico:"Fleumático",sanguineo:"Sanguíneo",melancolico:"Melancólico"};
  const iN={logica:"Lógica",interpessoal:"Interpessoal",linguistica:"Linguística",criativa:"Criativa",corporal:"Corporal",musical:"Musical",naturalista:"Naturalista",espacial:"Espacial",existencial:"Existencial"};
  return `${tN[tTop]}-${iN[iTop]}`;
}

function waitForJsPDF(timeout = 6000) {
  return new Promise((resolve, reject) => {
    if (window.jspdf) return resolve();
    const start = Date.now();
    const check = () => {
      if (window.jspdf) return resolve();
      if (Date.now() - start > timeout) return reject(new Error("jsPDF_timeout"));
      setTimeout(check, 100);
    };
    check();
  });
}

async function gerarPDF(perfil, perfilKey, nome) {
  await waitForJsPDF();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W=210, M=18, CW=W-M*2;
  let y=0;
  const hex2rgb = h=>{ const r=parseInt(h.slice(1),16); return [(r>>16)&255,(r>>8)&255,r&255]; };
  const [pr,pg,pb] = hex2rgb(perfil.cor);
  const addPage=()=>{ doc.addPage(); y=20; };
  const checkY=(need=20)=>{ if(y+need>275) addPage(); };
  const wrap=(t,w)=>doc.splitTextToSize(t,w);

  // CAPA
  doc.setFillColor(8,5,15); doc.rect(0,0,W,297,"F");
  doc.setFillColor(pr,pg,pb); doc.rect(0,0,5,297,"F");
  y=50;
  doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(pr,pg,pb);
  doc.text("MINDCODE  ·  SISTEMA DE AUTOCONHECIMENTO", M, y);
  doc.setDrawColor(pr,pg,pb); doc.setLineWidth(0.3); doc.line(M,y+4,W-M,y+4);
  y+=30;
  doc.setFont("helvetica","italic"); doc.setFontSize(36); doc.setTextColor(240,237,232);
  doc.text(perfil.nome, M, y); y+=14;
  doc.setFont("helvetica","normal"); doc.setFontSize(11); doc.setTextColor(pr,pg,pb);
  doc.text(perfilKey.toUpperCase(), M, y); y+=20;
  doc.setFont("helvetica","italic"); doc.setFontSize(13); doc.setTextColor(190,185,178);
  wrap(`"${perfil.frase}"`,CW).forEach(l=>{ doc.text(l,M,y); y+=8; });
  y+=14;
  doc.setFillColor(30,25,45); doc.roundedRect(M,y,CW,22,3,3,"F");
  doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(130,125,140);
  doc.text("Relatório gerado para", M+10, y+7);
  doc.setFont("helvetica","bold"); doc.setFontSize(13); doc.setTextColor(240,237,232);
  doc.text(nome||"Você", M+10, y+16);
  y=270; doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(60,55,70);
  doc.text("mindcode.app  ·  Perfil completo e exclusivo", M, y);

  const drawSection=(title,content,isArr=false)=>{
    checkY(32);
    doc.setFillColor(pr,pg,pb); doc.rect(M,y,3,14,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(pr,pg,pb);
    doc.text(title.toUpperCase(), M+8, y+5);
    doc.setDrawColor(40,35,55); doc.setLineWidth(0.15); doc.line(M+8,y+8,W-M,y+8);
    y+=18;
    if(isArr){ content.forEach(item=>{ checkY(14); doc.setFillColor(pr,pg,pb); doc.circle(M+3,y-1.5,1.1,"F"); doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(195,190,183); wrap(item,CW-10).forEach((l,i)=>{ if(i>0) checkY(7); doc.text(l,M+8,y); y+=6; }); y+=2; });
    } else { doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(195,190,183); wrap(content,CW).forEach(l=>{ checkY(7); doc.text(l,M,y); y+=6; }); }
    y+=8;
  };

  const pageHeader=()=>{ doc.setFillColor(8,5,15); doc.rect(0,0,W,297,"F"); doc.setFillColor(pr,pg,pb); doc.rect(0,0,5,297,"F"); doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(pr,pg,pb); doc.text("MINDCODE",M,y); doc.setFont("helvetica","normal"); doc.setTextColor(70,65,85); doc.text(`  ·  ${perfil.nome}`,M+22,y); doc.setDrawColor(25,20,35); doc.setLineWidth(0.15); doc.line(M,y+3,W-M,y+3); y+=14; };

  addPage(); pageHeader();
  doc.setFont("helvetica","italic"); doc.setFontSize(12); doc.setTextColor(pr,pg,pb);
  wrap(perfil.resumo,CW).forEach(l=>{ doc.text(l,M,y); y+=7; }); y+=10;

  // BASE TEÓRICA
  checkY(20);
  doc.setFillColor(pr,pg,pb); doc.rect(M,y,3,14,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(pr,pg,pb);
  doc.text("A ORIGEM DO SEU PERFIL", M+8, y+5);
  doc.setDrawColor(40,35,55); doc.setLineWidth(0.15); doc.line(M+8,y+8,W-M,y+8);
  y+=18;
  [["Seu temperamento — "+perfilKey.split("-")[0], perfil.base.arquetipo],
   ["Sua inteligência dominante — "+perfilKey.split("-")[1], perfil.base.inteligencia],
   ["Como eles se combinam em você", perfil.base.combinacao]
  ].forEach(([label,text])=>{
    checkY(14);
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(pr,pg,pb);
    doc.text(label.toUpperCase(), M, y); y+=7;
    doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(155,150,143);
    wrap(text,CW).forEach(l=>{ checkY(7); doc.text(l,M,y); y+=6; });
    y+=8;
  });
  y+=4;

  drawSection("Quem você é",perfil.descricao);
  drawSection("Indo mais fundo",perfil.descricao2);

  addPage(); pageHeader();
  drawSection("Seus pontos fortes",perfil.forcas,true);
  drawSection("Sua sombra — o que você evita ver",perfil.sombra,true);

  addPage(); pageHeader();
  drawSection("Você sob pressão",perfil.sobrePressao);
  drawSection("Seus pontos cegos",perfil.pontosCegos);
  drawSection("Você nos relacionamentos",perfil.relacoes);
  drawSection("Onde você prospera",perfil.carreiras,true);

  addPage(); pageHeader();
  drawSection("Fato sobre seu perfil",perfil.fatoCurioso);
  checkY(42);
  doc.setFillColor(pr,pg,pb); doc.setLineWidth(0.4); doc.setDrawColor(pr,pg,pb);
  doc.roundedRect(M,y,CW,38,3,3,"S");
  doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(pr,pg,pb); doc.text("PARA LEVAR",M+8,y+8);
  doc.setFont("helvetica","italic"); doc.setFontSize(10.5); doc.setTextColor(215,210,203);
  wrap(perfil.afirmacao,CW-16).forEach((l,i)=>{ doc.text(l,M+8,y+16+(i*7)); });
  y=268; doc.setDrawColor(25,20,35); doc.setLineWidth(0.15); doc.line(M,y,W-M,y); y+=5;
  doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(55,50,65);
  doc.text("mindcode.app  ·  Este relatório é pessoal e intransferível",M,y);
  if(nome) doc.text(nome,W-M,y,{align:"right"});

  doc.save(`MindCode_${perfil.nome.replace(/\s/g,"_")}_${(nome||"perfil").replace(/\s/g,"_")}.pdf`);
}

const Orb=({color,size,x,y,blur=120})=>(<div style={{position:"absolute",borderRadius:"50%",background:color,width:size,height:size,left:x,top:y,filter:`blur(${blur}px)`,opacity:"var(--orb-op)",pointerEvents:"none"}}/>);
const Sec=({title,cor,children})=>(<div style={{marginBottom:34}}><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><div style={{width:3,height:16,background:cor,borderRadius:2,flexShrink:0}}/><h3 style={{fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--muted)",margin:0,fontWeight:700}}>{title}</h3></div>{children}</div>);
const bg={minHeight:"100vh",background:"var(--bg)",color:"var(--text)",position:"relative",overflow:"hidden",transition:"background 0.3s ease,color 0.3s ease"};

/* Paleta por temperamento (acentos do resultado) */
const TEMP_COLORS={"Colérico":"#EF4444","Sanguíneo":"#F59E0B","Melancólico":"#3B82F6","Fleumático":"#10B981"};
/* Paleta por inteligência (tags) */
const INTEL_COLORS={"Lógica":"#4F46E5","Espacial":"#06B6D4","Musical":"#8B5CF6","Corporal":"#F97316","Naturalista":"#22C55E","Linguística":"#EC4899","Interpessoal":"#0EA5E9","Existencial":"#312E81","Criativa":"#14B8A6"};

/* Ícones minimalistas de linha */
const LineIcon=({name,size=18,stroke=1.7})=>{
  const p={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:stroke,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"};
  if(name==="moon") return(<svg {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>);
  if(name==="sun") return(<svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>);
  if(name==="temperamento") return(<svg {...p}><path d="M12 2C9 5.5 7.5 8 7.5 11.5a4.5 4.5 0 0 0 9 0c0-1.7-.7-3.3-2-4.8-.9 1.6-1.8 1.8-2.6 1C11 6.4 11.4 4.3 12 2z"/></svg>);
  if(name==="inteligencia") return(<svg {...p}><path d="M12 3l1.7 4.1L18 9l-4.3 1.9L12 15l-1.7-4.1L6 9l4.3-1.9z"/><path d="M18 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>);
  if(name==="combinacao") return(<svg {...p}><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>);
  if(name==="download") return(<svg {...p}><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></svg>);
  if(name==="lock") return(<svg {...p}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>);
  return null;
};

/* ─── Ícones oficiais das marcas (SVG) ─── */
const BrandIcon=({name,size=16})=>{
  if(name==="WhatsApp") return(
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#25D366" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.999zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/></svg>
  );
  if(name==="Instagram") return(
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <defs><linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FED576"/><stop offset="26%" stopColor="#F47133"/><stop offset="61%" stopColor="#BC3081"/><stop offset="100%" stopColor="#4C63D2"/></linearGradient></defs>
      <path fill="url(#igGrad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.585 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.418 2.175 8.797 2.163 12 2.163zm0 1.802c-3.15 0-3.522.012-4.764.069-1.024.047-1.58.218-1.95.362-.49.19-.84.418-1.207.785-.367.367-.595.717-.785 1.207-.144.37-.315.926-.362 1.95-.057 1.242-.069 1.614-.069 4.764s.012 3.522.069 4.764c.047 1.024.218 1.58.362 1.95.19.49.418.84.785 1.207.367.367.717.595 1.207.785.37.144.926.315 1.95.362 1.242.057 1.614.069 4.764.069s3.522-.012 4.764-.069c1.024-.047 1.58-.218 1.95-.362.49-.19.84-.418 1.207-.785.367-.367.595-.717.785-1.207.144-.37.315-.926.362-1.95.057-1.242.069-1.614.069-4.764s-.012-3.522-.069-4.764c-.047-1.024-.218-1.58-.362-1.95-.19-.49-.418-.84-.785-1.207-.367-.367-.717-.595-1.207-.785-.37-.144-.926-.315-1.95-.362-1.242-.057-1.614-.069-4.764-.069zm0 3.064a4.971 4.971 0 110 9.942 4.971 4.971 0 010-9.942zm0 8.198a3.227 3.227 0 100-6.454 3.227 3.227 0 000 6.454zm6.323-8.392a1.162 1.162 0 11-2.324 0 1.162 1.162 0 012.324 0z"/>
    </svg>
  );
  if(name==="TikTok") return(
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill="#fff" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  );
  // Copiar link — ícone de corrente/link
  return(
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
  );
};

export default function MindCode() {
  const [tela,setTela]=useState("intro");
  const [pergunta,setPergunta]=useState(0);
  const [respostas,setRespostas]=useState(Array(questions.length).fill(null));
  const [perfilKey,setPerfilKey]=useState(null);
  const [nome,setNome]=useState("");
  const [nomeInput,setNomeInput]=useState("");
  const [sel,setSel]=useState(null);
  const [anim,setAnim]=useState(false);
  const [pixOk,setPixOk]=useState(false);
  const [gerando,setGerando]=useState(false);
  const [copiado,setCopiado]=useState(null);
  const [tema,setTema]=useState(()=> (typeof document!=="undefined" && document.documentElement.getAttribute("data-theme")) || "light");
  const top=useRef(null);
  const perfil=perfilKey?profiles[perfilKey]:null;
  const temperamento=perfilKey?perfilKey.split("-")[0]:null;
  const inteligencia=perfilKey?perfilKey.split("-")[1]:null;
  const cor=perfil?(TEMP_COLORS[temperamento]||"#6366F1"):"#6366F1";
  const intelCor=perfil?(INTEL_COLORS[inteligencia]||cor):cor;

  function toggleTema(){
    const novo = tema==="dark"?"light":"dark";
    setTema(novo);
    document.documentElement.setAttribute("data-theme",novo);
    try{ localStorage.setItem("mc-theme",novo); }catch(e){}
  }
  const themeToggle=(
    <button onClick={toggleTema} aria-label="Alternar tema claro e escuro" title="Alternar tema"
      style={{position:"fixed",top:16,right:16,zIndex:50,width:42,height:42,borderRadius:"50%",background:"var(--surface)",border:"1px solid var(--border)",color:"var(--muted)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"var(--shadow)"}}>
      <LineIcon name={tema==="dark"?"sun":"moon"} size={18}/>
    </button>
  );
  const prog=Math.round((respostas.filter(r=>r!==null).length/questions.length)*100);
  const ir=t=>{ setTela(t); setTimeout(()=>top.current?.scrollIntoView({behavior:"smooth"}),50); };

  function responder(tipo){
    if(anim) return; setSel(tipo); setAnim(true);
    const n=[...respostas]; n[pergunta]=tipo; setRespostas(n);
    setTimeout(()=>{ if(pergunta<questions.length-1){ setPergunta(p=>p+1); setSel(null); setAnim(false); } else { setPerfilKey(calcularPerfil(n)); ir("preview"); setAnim(false); } },380);
  }
  async function baixarPDF() {
    if (!perfil) return;
    setGerando(true);
    try {
      await gerarPDF(perfil, perfilKey, nome);
    } catch (e) {
      if (e.message === "jsPDF_timeout") {
        alert("Não foi possível carregar o gerador de PDF. Verifique sua conexão e recarregue a página.");
      } else {
        alert("Erro ao gerar PDF. Tente novamente.");
      }
    }
    setGerando(false);
  }

  // ─── Compartilhamento ───
  const linkSite = "https://mindcode.app";
  function compartilhar(rede) {
    const texto = perfil
      ? `Acabei de descobrir meu perfil no MindCode: ${perfil.nome} (${perfilKey}). "${perfil.frase}" Descubra o seu 👇`
      : "Descobri meu perfil no MindCode. Descubra o seu 👇";
    const full = `${texto} ${linkSite}`;
    const feedback = r => { setCopiado(r); setTimeout(() => setCopiado(null), 2500); };

    if (rede === "WhatsApp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(full)}`, "_blank", "noopener");
    } else if (rede === "Copiar link") {
      navigator.clipboard?.writeText(linkSite).catch(() => {});
      feedback(rede);
    } else {
      // Instagram e TikTok não aceitam texto pré-preenchido via web:
      // copiamos a legenda e abrimos o app/site para o usuário colar.
      navigator.clipboard?.writeText(full).catch(() => {});
      feedback(rede);
      const dest = rede === "Instagram" ? "https://www.instagram.com" : "https://www.tiktok.com";
      window.open(dest, "_blank", "noopener");
    }
  }

  if(tela==="intro") return(
    <div style={bg} ref={top}>
      {themeToggle}
      <Orb color="#6366F1" size={500} x="-8%" y="-8%"/><Orb color="#8B5CF6" size={380} x="58%" y="28%"/><Orb color="#06B6D4" size={280} x="18%" y="68%"/>
      <div className="mc-pad" style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 24px",textAlign:"center"}}>
        <div style={{letterSpacing:"0.28em",fontSize:12,color:"var(--faint)",textTransform:"uppercase",marginBottom:18,fontWeight:600}}>Sistema de Autoconhecimento</div>
        <h1 style={{fontSize:"clamp(48px,9vw,84px)",fontWeight:800,letterSpacing:"-0.03em",margin:"0 0 10px",lineHeight:1}}><span style={{color:"var(--text)"}}>Mind</span><span style={{color:"var(--cta)"}}>Code</span></h1>
        <div style={{width:60,height:3,borderRadius:3,background:"linear-gradient(90deg,var(--cta),var(--cta-2))",margin:"20px auto 24px"}}/>
        <p style={{fontSize:"clamp(16px,2.3vw,20px)",color:"var(--muted)",maxWidth:520,lineHeight:1.7,margin:"0 0 44px"}}>Descubra o código único da sua mente — onde seu temperamento encontra sua inteligência dominante.</p>
        <div style={{display:"flex",gap:36,marginBottom:46,flexWrap:"wrap",justifyContent:"center"}}>
          {[["14","perguntas"],["36","perfis únicos"],["5","minutos"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}><div style={{fontSize:30,fontWeight:700,color:"var(--cta)",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{n}</div><div style={{fontSize:12,color:"var(--faint)",letterSpacing:"0.08em",marginTop:2}}>{l}</div></div>
          ))}
        </div>
        <button onClick={()=>ir("nome")} style={{background:"linear-gradient(135deg,var(--cta),var(--cta-2))",border:"none",color:"#fff",padding:"17px 52px",fontSize:16,letterSpacing:"0.02em",cursor:"pointer",borderRadius:12,fontWeight:600,boxShadow:"0 10px 30px rgba(99,102,241,0.35)"}}>Iniciar o Teste</button>
        <p style={{marginTop:22,fontSize:12,color:"var(--faint)"}}>Gratuito · Resultado disponível ao final</p>
      </div>
    </div>
  );

  if(tela==="nome") return(
    <div style={bg} ref={top}>
      {themeToggle}
      <Orb color="#6366F1" size={400} x="50%" y="0%" blur={160}/>
      <div className="mc-pad" style={{position:"relative",zIndex:1,maxWidth:520,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}>
        <div style={{fontSize:12,letterSpacing:"0.28em",color:"var(--faint)",textTransform:"uppercase",marginBottom:20,fontWeight:600}}>Antes de começar</div>
        <h2 style={{fontSize:"clamp(26px,5vw,38px)",fontWeight:700,margin:"0 0 14px",letterSpacing:"-0.02em"}}>Como posso te chamar?</h2>
        <p style={{color:"var(--muted)",fontSize:15,marginBottom:40,lineHeight:1.7}}>Seu nome tornará a análise mais pessoal — e o relatório PDF gerado ao final será personalizado para você.</p>
        <input type="text" value={nomeInput} onChange={e=>setNomeInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&nomeInput.trim()&&(setNome(nomeInput.trim()),ir("teste"))} placeholder="Digite seu primeiro nome..." autoFocus
          style={{width:"100%",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"16px 20px",color:"var(--text)",fontSize:18,textAlign:"center",outline:"none",boxSizing:"border-box",marginBottom:28,boxShadow:"var(--shadow)"}}/>
        <button onClick={()=>{ if(nomeInput.trim()){ setNome(nomeInput.trim()); ir("teste"); }}} disabled={!nomeInput.trim()}
          style={{background:nomeInput.trim()?"linear-gradient(135deg,var(--cta),var(--cta-2))":"var(--surface-2)",border:nomeInput.trim()?"none":"1px solid var(--border)",color:nomeInput.trim()?"#fff":"var(--faint)",padding:"16px 52px",fontSize:15,letterSpacing:"0.02em",cursor:nomeInput.trim()?"pointer":"default",borderRadius:12,fontWeight:600,transition:"all 0.3s",marginBottom:16,display:"block",width:"100%",boxShadow:nomeInput.trim()?"0 10px 30px rgba(99,102,241,0.30)":"none"}}>
          Continuar
        </button>
        <button onClick={()=>{ setNome(""); ir("teste"); }} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer",fontSize:13}}>Continuar sem informar nome</button>
      </div>
    </div>
  );

  if(tela==="teste"){
    const q=questions[pergunta];
    return(
      <div style={bg} ref={top}>
        {themeToggle}
        <Orb color="#6366F1" size={380} x="-5%" y="5%" blur={150}/><Orb color="#8B5CF6" size={280} x="68%" y="55%" blur={150}/>
        <div className="mc-pad" style={{position:"relative",zIndex:1,maxWidth:680,margin:"0 auto",padding:"56px 24px 40px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:44}}>
            <div style={{flex:1,height:6,borderRadius:6,background:"var(--track)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:6,background:"linear-gradient(90deg,var(--cta),var(--cta-2))",width:`${prog}%`,transition:"width 0.4s ease"}}/></div>
            <span style={{fontSize:12,color:"var(--faint)",whiteSpace:"nowrap",fontWeight:600}}>{pergunta+1} / {questions.length}</span>
          </div>
          {nome&&<div style={{fontSize:13,color:"var(--faint)",marginBottom:6}}>Olá, <span style={{color:"var(--muted)",fontWeight:600}}>{nome}</span></div>}
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <div style={{fontSize:12,letterSpacing:"0.22em",color:"var(--cta)",textTransform:"uppercase",marginBottom:18,fontWeight:700}}>Pergunta {pergunta+1}</div>
            <h2 style={{fontSize:"clamp(20px,2.8vw,26px)",fontWeight:700,lineHeight:1.45,marginBottom:30,letterSpacing:"-0.01em"}}>{q.texto}</h2>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {q.opcoes.map((op,i)=>(
                <button key={i} onClick={()=>responder(op.tipo)} style={{background:sel===op.tipo?"rgba(99,102,241,0.10)":"var(--surface)",border:sel===op.tipo?"1.5px solid var(--cta)":"1px solid var(--border)",color:"var(--text)",padding:"17px 20px",textAlign:"left",cursor:"pointer",fontSize:15,lineHeight:1.5,borderRadius:12,transition:"all 0.18s",opacity:anim&&sel!==op.tipo?0.35:1,boxShadow:sel===op.tipo?"0 6px 18px rgba(99,102,241,0.18)":"var(--shadow)",display:"flex",alignItems:"flex-start",gap:10}}
                  onMouseEnter={e=>{ if(!anim&&sel!==op.tipo){e.currentTarget.style.borderColor="var(--cta)";}}}
                  onMouseLeave={e=>{ if(sel!==op.tipo){e.currentTarget.style.borderColor="var(--border)";}}}
                ><span style={{color:"var(--cta)",fontWeight:700,flexShrink:0}}>{String.fromCharCode(65+i)}.</span>{op.texto}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(tela==="preview"&&perfil) return(
    <div style={bg} ref={top}>
      {themeToggle}
      <Orb color={cor} size={480} x="18%" y="-8%" blur={180}/><Orb color="#6366F1" size={280} x="-8%" y="55%"/>
      <div className="mc-pad" style={{position:"relative",zIndex:1,maxWidth:660,margin:"0 auto",padding:"60px 24px",textAlign:"center"}}>
        {nome&&<div style={{fontSize:13,color:"var(--faint)",marginBottom:8}}>Resultado de <span style={{color:"var(--muted)",fontWeight:600}}>{nome}</span></div>}
        <div style={{fontSize:12,letterSpacing:"0.24em",color:"var(--faint)",textTransform:"uppercase",marginBottom:16,fontWeight:600}}>Seu perfil foi identificado</div>
        <h2 style={{fontSize:"clamp(30px,6vw,50px)",fontWeight:800,margin:"0 0 14px",letterSpacing:"-0.02em"}}>{perfil.nome}</h2>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
          <span style={{padding:"5px 14px",borderRadius:999,background:`${cor}1A`,border:`1px solid ${cor}44`,color:cor,fontSize:12,letterSpacing:"0.04em",fontWeight:600}}>{temperamento}</span>
          <span style={{padding:"5px 14px",borderRadius:999,background:`${intelCor}1A`,border:`1px solid ${intelCor}44`,color:intelCor,fontSize:12,letterSpacing:"0.04em",fontWeight:600}}>{inteligencia}</span>
        </div>
        <p style={{fontSize:18,color:"var(--text)",lineHeight:1.6,marginBottom:12,fontWeight:500}}>“{perfil.frase}”</p>
        <p style={{fontSize:15,color:"var(--muted)",lineHeight:1.7,maxWidth:480,margin:"0 auto 38px"}}>{perfil.resumo}</p>
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:"26px 22px",marginBottom:34,textAlign:"left",boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:12,color:"var(--muted)",marginBottom:14,letterSpacing:"0.04em",fontWeight:600}}>O relatório completo inclui:</div>
          <div className="mc-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 14px"}}>
            {["Quem você é — análise profunda","Indo mais fundo","Pontos fortes detalhados","Sua sombra","Você sob pressão","Pontos cegos","Você nos relacionamentos","Carreiras ideais","Fato único sobre seu perfil","Download PDF personalizado"].map(it=>(
              <div key={it} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"var(--faint)"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:cor,flexShrink:0,opacity:0.55}}/><span style={{filter:"blur(2px)"}}>{it}</span>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:16,paddingTop:14,borderTop:"1px solid var(--border-2)",fontSize:12,color:"var(--faint)"}}>Conteúdo completo disponível após desbloqueio</div>
        </div>
        {/* ─── CHAMADA PERSUASIVA (PNL) ─── */}
        <div style={{marginBottom:30,textAlign:"left",maxWidth:540,marginLeft:"auto",marginRight:"auto"}}>
          <h3 style={{fontSize:"clamp(21px,3.4vw,28px)",fontWeight:700,color:"var(--text)",lineHeight:1.35,marginBottom:18,textAlign:"center",letterSpacing:"-0.02em"}}>
            {nome?`${nome}, você acabou de ver apenas a ponta do iceberg.`:"Você acabou de ver apenas a ponta do iceberg."}
          </h3>
          <p style={{fontSize:16,color:"var(--muted)",lineHeight:1.8,marginBottom:14}}>
            Tudo o que você sempre sentiu sobre si mesmo — mas nunca conseguiu colocar em palavras — está descrito, com precisão, no seu relatório completo. Não é horóscopo. É o mapa de como a sua mente realmente funciona.
          </p>
          <p style={{fontSize:16,color:"var(--muted)",lineHeight:1.8,marginBottom:14}}>
            <span style={{color:"var(--text)",fontWeight:600}}>Imagine</span> abrir esse documento e finalmente entender por que você reage do jeito que reage, onde está a sua maior força e qual é o ponto cego que vem te custando caro há anos. Quando você se enxerga com clareza, decisões que pareciam difíceis simplesmente se resolvem.
          </p>
          <p style={{fontSize:16,color:"var(--muted)",lineHeight:1.8}}>
            A maioria das pessoas atravessa a vida inteira sem nunca se conhecer de verdade. <span style={{color:"var(--text)",fontWeight:600}}>Você está a um clique de não ser uma delas.</span>
          </p>
        </div>

        <div style={{background:"var(--surface)",border:`1px solid ${cor}33`,borderRadius:16,padding:"30px 22px",marginBottom:16,boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:12,letterSpacing:"0.14em",color:"var(--muted)",textTransform:"uppercase",marginBottom:12,fontWeight:600}}>Seu relatório completo · {perfil.nome}</div>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:10,marginBottom:6}}>
            <span style={{fontSize:16,color:"var(--faint)",textDecoration:"line-through"}}>R$ 47</span>
            <span style={{fontSize:40,fontWeight:800,color:"var(--cta)",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>R$ 19,90</span>
          </div>
          <div style={{fontSize:13,color:"var(--faint)",marginBottom:22}}>pagamento único · acesso imediato + PDF personalizado para {nome||"você"}</div>
          <button onClick={()=>ir("pagamento")} style={{background:"linear-gradient(135deg,var(--cta),var(--cta-2))",border:"none",color:"#fff",padding:"17px 44px",fontSize:16,letterSpacing:"0.01em",cursor:"pointer",borderRadius:12,width:"100%",fontWeight:600,boxShadow:"0 10px 30px rgba(99,102,241,0.35)"}}>Quero Conhecer Minha Mente Agora</button>
          <div style={{fontSize:12,color:"var(--faint)",marginTop:14,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><LineIcon name="lock" size={13}/> Compra 100% segura · Você recebe o acesso na hora</div>
        </div>
        <p style={{fontSize:12,color:"var(--faint)"}}>Menos que um café por semana — por algo que você leva para o resto da vida.</p>
      </div>
    </div>
  );

  if(tela==="pagamento") return(
    <div style={bg} ref={top}>
      {themeToggle}
      <Orb color="#6366F1" size={380} x="48%" y="-2%" blur={180}/>
      <div className="mc-pad" style={{position:"relative",zIndex:1,maxWidth:460,margin:"0 auto",padding:"60px 24px",textAlign:"center"}}>
        <button onClick={()=>ir("preview")} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer",fontSize:13,marginBottom:28}}>← Voltar</button>
        <div style={{fontSize:12,letterSpacing:"0.24em",color:"var(--faint)",textTransform:"uppercase",marginBottom:18,fontWeight:600}}>Último passo</div>
        <h2 style={{fontSize:"clamp(24px,4.5vw,32px)",fontWeight:700,marginBottom:14,lineHeight:1.3,letterSpacing:"-0.02em"}}>{nome?`${nome}, seu relatório já está pronto.`:"Seu relatório já está pronto."}</h2>
        <p style={{color:"var(--muted)",fontSize:15,lineHeight:1.75,marginBottom:30,maxWidth:400,marginLeft:"auto",marginRight:"auto"}}>Falta só um PIX para você desbloquear tudo o que descobrimos sobre a sua mente. Em segundos, ele estará na sua tela — e você não vai mais olhar para si mesmo da mesma forma.</p>
        <div style={{fontSize:12,letterSpacing:"0.2em",color:"var(--faint)",textTransform:"uppercase",marginBottom:8,fontWeight:600}}>Pague com PIX</div>
        <p style={{color:"var(--faint)",fontSize:13,marginBottom:26}}>Aprovação imediata · 100% seguro · Sem cadastro</p>
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:28,marginBottom:20,boxShadow:"var(--shadow)"}}>
          <div style={{background:"#fff",padding:14,borderRadius:12,display:"inline-block",marginBottom:18,boxShadow:"0 2px 10px rgba(15,23,42,0.10)"}}>
            <div style={{width:150,height:150,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:6}}>
              <svg width="120" height="120" viewBox="0 0 120 120">{[...Array(6)].map((_,r)=>[...Array(6)].map((_,c)=>(<rect key={`${r}-${c}`} x={c*20} y={r*20} width={18} height={18} fill={(r+c)%3===0?"#111":"transparent"} rx={1}/>)))}</svg>
            </div>
          </div>
          <div style={{fontSize:32,fontWeight:800,color:"var(--cta)",marginBottom:4,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>R$ 19,90</div>
          <div style={{fontSize:12,color:"var(--faint)",marginBottom:18}}>MindCode · {nome||"Autoconhecimento"}</div>
          <button onClick={()=>{ navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136mindcode@email.com.br520400005303986580 2BR5925MindCode6009SAOPAULO62070503***6304ABCD").catch(()=>{}); setPixOk(true); setTimeout(()=>setPixOk(false),3000); }} style={{background:"rgba(99,102,241,0.10)",border:"1px solid rgba(99,102,241,0.30)",color:"var(--cta)",padding:"12px 22px",fontSize:13,cursor:"pointer",borderRadius:10,width:"100%",fontWeight:600}}>
            {pixOk?"✓ Código copiado!":"Copiar código PIX"}
          </button>
        </div>
        <div style={{background:"var(--surface-2)",border:"1px solid var(--border-2)",borderRadius:12,padding:"18px 22px",marginBottom:22,textAlign:"left",fontSize:13,color:"var(--muted)",lineHeight:2}}>
          <div>1. Abra o app do seu banco</div><div>2. Escolha pagar com PIX</div><div>3. Escaneie o QR ou cole o código</div><div>4. Confirme o pagamento de R$ 19,90</div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:24,fontSize:12,color:"var(--faint)"}}>
          <span>✓ Acesso imediato</span><span style={{color:"var(--ghost)"}}>·</span><span>✓ PDF para sempre</span><span style={{color:"var(--ghost)"}}>·</span><span>✓ Pagamento único</span>
        </div>
        <button onClick={()=>{ ir("resultado"); }} style={{background:"linear-gradient(135deg,#10B981,#059669)",border:"none",color:"#fff",padding:"17px 44px",fontSize:16,letterSpacing:"0.01em",cursor:"pointer",borderRadius:12,width:"100%",fontWeight:600,boxShadow:"0 10px 30px rgba(16,185,129,0.32)"}}>Já paguei · Liberar meu resultado</button>
        <p style={{fontSize:13,color:"var(--faint)",marginTop:16}}>O autoconhecimento é a única decisão que você nunca se arrepende de tomar.</p>
        <p style={{fontSize:11,color:"var(--ghost)",marginTop:10}}>Em produção: confirmação automática via webhook PIX</p>
      </div>
    </div>
  );

  if(tela==="resultado"&&perfil) return(
    <div style={bg} ref={top}>
      {themeToggle}
      <Orb color={cor} size={580} x="8%" y="-4%" blur={200}/><Orb color="#6366F1" size={380} x="58%" y="48%" blur={150}/>
      <div className="mc-pad" style={{position:"relative",zIndex:1,maxWidth:720,margin:"0 auto",padding:"60px 24px 80px"}}>
        <div style={{textAlign:"center",marginBottom:50}}>
          <div style={{fontSize:12,letterSpacing:"0.24em",color:"var(--faint)",textTransform:"uppercase",marginBottom:14,fontWeight:600}}>MindCode · Perfil Completo</div>
          {nome&&<div style={{fontSize:14,color:"var(--faint)",marginBottom:14}}>Análise de <span style={{color:"var(--muted)",fontWeight:600}}>{nome}</span></div>}
          <h1 style={{fontSize:"clamp(34px,6vw,58px)",fontWeight:800,margin:"0 0 16px",letterSpacing:"-0.02em"}}>{perfil.nome}</h1>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
            <span style={{padding:"6px 16px",borderRadius:999,background:`${cor}1A`,border:`1px solid ${cor}44`,color:cor,fontSize:12,letterSpacing:"0.04em",fontWeight:600}}>{temperamento}</span>
            <span style={{padding:"6px 16px",borderRadius:999,background:`${intelCor}1A`,border:`1px solid ${intelCor}44`,color:intelCor,fontSize:12,letterSpacing:"0.04em",fontWeight:600}}>{inteligencia}</span>
          </div>
          <p style={{fontSize:"clamp(16px,2.3vw,19px)",color:"var(--text)",lineHeight:1.6,maxWidth:540,margin:"0 auto 10px",fontWeight:500}}>“{perfil.frase}”</p>
          <p style={{fontSize:15,color:"var(--muted)",maxWidth:480,margin:"0 auto",lineHeight:1.7}}>{perfil.resumo}</p>
        </div>

        {/* BASE TEÓRICA */}
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:18,padding:"28px 26px",marginBottom:36,boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:12,letterSpacing:"0.2em",color:"var(--muted)",textTransform:"uppercase",marginBottom:22,fontWeight:700}}>A origem do seu perfil</div>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {[["temperamento",cor,`Seu temperamento — ${temperamento}`,perfil.base.arquetipo],
              ["inteligencia",intelCor,`Sua inteligência dominante — ${inteligencia}`,perfil.base.inteligencia],
              ["combinacao","#6366F1","Como eles se combinam em você",perfil.base.combinacao]].map(([ic,c,label,texto],idx)=>(
              <div key={ic}>
                {idx>0&&<div style={{height:1,background:"var(--border-2)",marginBottom:20}}/>}
                <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:10}}>
                  <div style={{width:30,height:30,borderRadius:9,background:`${c}18`,border:`1px solid ${c}38`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:c}}>
                    <LineIcon name={ic} size={16}/>
                  </div>
                  <span style={{fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",color:c,fontWeight:700}}>{label}</span>
                </div>
                <p style={{fontSize:15,lineHeight:1.8,color:"var(--muted)",margin:0,paddingLeft:41}}>{texto}</p>
              </div>
            ))}
          </div>
        </div>

        <Sec title="Quem você é" cor={cor}>
          <p style={{fontSize:16,lineHeight:1.85,color:"var(--text)",marginBottom:14}}>{perfil.descricao}</p>
          <p style={{fontSize:16,lineHeight:1.85,color:"var(--muted)"}}>{perfil.descricao2}</p>
        </Sec>
        <Sec title="Seus pontos fortes" cor={cor}>
          {perfil.forcas.map((f,i)=>(<div key={i} style={{display:"flex",gap:13,marginBottom:13,alignItems:"flex-start"}}><div style={{width:18,height:18,borderRadius:"50%",background:`${cor}1A`,border:`1px solid ${cor}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:3}}><div style={{width:5,height:5,borderRadius:"50%",background:cor}}/></div><p style={{fontSize:15,lineHeight:1.7,color:"var(--text)",margin:0}}>{f}</p></div>))}
        </Sec>
        <Sec title="Sua sombra — o que você evita ver" cor={cor}>
          {perfil.sombra.map((s,i)=>(<div key={i} style={{display:"flex",gap:13,marginBottom:13,alignItems:"flex-start"}}><div style={{width:18,height:18,borderRadius:"50%",background:"rgba(239,68,68,0.10)",border:"1px solid rgba(239,68,68,0.30)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:3}}><div style={{width:5,height:5,borderRadius:"50%",background:"#EF4444"}}/></div><p style={{fontSize:15,lineHeight:1.7,color:"var(--text)",margin:0}}>{s}</p></div>))}
        </Sec>
        <Sec title="Você sob pressão" cor={cor}><p style={{fontSize:16,lineHeight:1.85,color:"var(--text)"}}>{perfil.sobrePressao}</p></Sec>
        <Sec title="Seus pontos cegos" cor={cor}><p style={{fontSize:16,lineHeight:1.85,color:"var(--text)"}}>{perfil.pontosCegos}</p></Sec>
        <Sec title="Você nos relacionamentos" cor={cor}><p style={{fontSize:16,lineHeight:1.85,color:"var(--text)"}}>{perfil.relacoes}</p></Sec>
        <Sec title="Onde você prospera" cor={cor}>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{perfil.carreiras.map((c,i)=>(<span key={i} style={{padding:"8px 14px",background:`${cor}14`,border:`1px solid ${cor}33`,borderRadius:999,fontSize:13,color:"var(--text)"}}>{c}</span>))}</div>
        </Sec>
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:"22px 24px",marginBottom:24,boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:11,letterSpacing:"0.2em",color:intelCor,textTransform:"uppercase",marginBottom:12,fontWeight:700}}>Fato sobre seu perfil</div>
          <p style={{fontSize:16,lineHeight:1.8,color:"var(--text)",margin:0}}>{perfil.fatoCurioso}</p>
        </div>
        <div style={{background:"var(--surface)",border:`1px solid ${cor}33`,borderRadius:16,padding:"24px 24px",marginBottom:46,boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:11,letterSpacing:"0.2em",color:cor,textTransform:"uppercase",marginBottom:12,fontWeight:700}}>Para levar</div>
          <p style={{fontSize:17,lineHeight:1.75,color:"var(--text)",margin:0,fontWeight:500}}>{perfil.afirmacao}</p>
        </div>

        <div style={{borderTop:"1px solid var(--border)",paddingTop:34,textAlign:"center"}}>
          <div style={{fontSize:11,letterSpacing:"0.14em",color:"var(--faint)",marginBottom:18,textTransform:"uppercase",fontWeight:600}}>Salve e compartilhe</div>
          <button onClick={baixarPDF} disabled={gerando} style={{background:gerando?"var(--surface-2)":"linear-gradient(135deg,var(--cta),var(--cta-2))",border:gerando?"1px solid var(--border)":"none",color:gerando?"var(--faint)":"#fff",padding:"16px 40px",fontSize:15,letterSpacing:"0.01em",cursor:gerando?"default":"pointer",borderRadius:12,fontWeight:600,marginBottom:18,boxShadow:gerando?"none":"0 10px 30px rgba(99,102,241,0.30)",width:"100%",maxWidth:380,display:"flex",alignItems:"center",justifyContent:"center",gap:9,marginLeft:"auto",marginRight:"auto"}}>
            {gerando?"Gerando PDF...":(<><LineIcon name="download" size={18}/> Baixar PDF Personalizado</>)}
          </button>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            {["WhatsApp","Instagram","TikTok","Copiar link"].map(b=>(
              <button key={b} onClick={()=>compartilhar(b)} style={{background:copiado===b?"rgba(99,102,241,0.10)":"var(--surface)",border:copiado===b?"1px solid var(--cta)":"1px solid var(--border)",color:copiado===b?"var(--cta)":"var(--muted)",padding:"11px 18px",fontSize:12,cursor:"pointer",borderRadius:10,letterSpacing:"0.02em",transition:"all 0.2s",display:"flex",alignItems:"center",gap:7,fontWeight:500,boxShadow:"var(--shadow)"}}
                onMouseEnter={e=>{ if(copiado!==b){e.currentTarget.style.borderColor="var(--cta)";} }}
                onMouseLeave={e=>{ if(copiado!==b){e.currentTarget.style.borderColor="var(--border)";} }}
              ><BrandIcon name={b}/>{copiado===b?(b==="Copiar link"?"Link copiado!":"Legenda copiada!"):b}</button>
            ))}
          </div>
          <p style={{marginTop:12,fontSize:11,color:"var(--faint)",lineHeight:1.6}}>No Instagram e TikTok, a legenda é copiada automaticamente — é só colar na sua publicação.</p>
          {nome&&<p style={{marginTop:26,fontSize:12,color:"var(--faint)"}}>Análise gerada para <span style={{color:"var(--muted)",fontWeight:600}}>{nome}</span> · MindCode</p>}
        </div>
      </div>
    </div>
  );

  return null;
}
