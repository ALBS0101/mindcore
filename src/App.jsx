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
  }
};

const questions = [
  { id:1, texto:"Quando você precisa resolver um problema complexo, sua primeira reação é:", opcoes:[{texto:"Analisar todas as variáveis e montar um plano de ação",tipo:"logica"},{texto:"Conversar com alguém de confiança para pensar junto",tipo:"interpessoal"},{texto:"Escrever ou verbalizar o problema para organizar as ideias",tipo:"linguistica"},{texto:"Buscar uma solução diferente, fora do padrão",tipo:"criativa"}]},
  { id:2, texto:"Em um grupo, você naturalmente:", opcoes:[{texto:"Assume a liderança e define o rumo",tipo:"colerico"},{texto:"Mantém a harmonia e evita conflitos",tipo:"fleumatico"},{texto:"Anima o ambiente e conecta as pessoas",tipo:"sanguineo"},{texto:"Observa, analisa e contribui com profundidade",tipo:"melancolico"}]},
  { id:3, texto:"O que mais te satisfaz em um trabalho bem feito?", opcoes:[{texto:"A eficiência — chegou ao resultado no menor tempo possível",tipo:"logica"},{texto:"O impacto nas pessoas envolvidas",tipo:"interpessoal"},{texto:"A forma como foi comunicado e apresentado",tipo:"linguistica"},{texto:"A originalidade da abordagem",tipo:"criativa"}]},
  { id:4, texto:"Quando algo não sai como planejado, você:", opcoes:[{texto:"Recalcula e toma o controle da situação rapidamente",tipo:"colerico"},{texto:"Mantém a calma e espera o momento certo para agir",tipo:"fleumatico"},{texto:"Fala sobre isso e busca apoio",tipo:"sanguineo"},{texto:"Internaliza, analisa o que deu errado e sente o peso",tipo:"melancolico"}]},
  { id:5, texto:"Como você aprende melhor?", opcoes:[{texto:"Lendo, pesquisando e estruturando o conhecimento",tipo:"logica"},{texto:"Observando e conversando com quem já sabe",tipo:"interpessoal"},{texto:"Escrevendo, explicando ou ensinando para alguém",tipo:"linguistica"},{texto:"Experimentando, errando e descobrindo na prática",tipo:"criativa"}]},
  { id:6, texto:"Qual dessas frases mais representa você?", opcoes:[{texto:"Eu prefiro ser respeitado a ser querido",tipo:"colerico"},{texto:"Eu prefiro paz a ter razão",tipo:"fleumatico"},{texto:"Eu prefiro estar cercado de pessoas a estar sozinho",tipo:"sanguineo"},{texto:"Eu prefiro profundidade a popularidade",tipo:"melancolico"}]},
  { id:7, texto:"Diante de uma decisão importante, você:", opcoes:[{texto:"Confia nos dados e na lógica acima de tudo",tipo:"logica"},{texto:"Considera como vai afetar as pessoas envolvidas",tipo:"interpessoal"},{texto:"Pensa em como vai comunicar e justificar a decisão",tipo:"linguistica"},{texto:"Busca uma terceira via que ninguém considerou",tipo:"criativa"}]},
  { id:8, texto:"Qual é sua maior fonte de energia?", opcoes:[{texto:"Conquistar metas e superar desafios",tipo:"colerico"},{texto:"Ambientes estáveis e relacionamentos seguros",tipo:"fleumatico"},{texto:"Interações sociais e novas conexões",tipo:"sanguineo"},{texto:"Tempo sozinho para pensar e criar",tipo:"melancolico"}]},
  { id:9, texto:"Quando você tem uma tarde inteira só para você, o que te atrai primeiro?", opcoes:[{texto:"Desvendar como algo funciona — montar, calcular ou resolver",tipo:"logica"},{texto:"Encontrar pessoas, ouvir histórias e fortalecer laços",tipo:"interpessoal"},{texto:"Ler, escrever ou mergulhar em uma conversa profunda",tipo:"linguistica"},{texto:"Criar, imaginar ou dar forma a algo que ainda não existe",tipo:"criativa"}]},
  { id:10, texto:"No fundo, o que mais te move quando ninguém está olhando?", opcoes:[{texto:"A vontade de vencer e provar do que sou capaz",tipo:"colerico"},{texto:"O desejo de paz e de seguir no meu próprio ritmo",tipo:"fleumatico"},{texto:"A busca por emoção, novidade e pessoas",tipo:"sanguineo"},{texto:"A necessidade de dar sentido profundo ao que vivo",tipo:"melancolico"}]}
];

function calcularPerfil(respostas) {
  const s = { logica:0,interpessoal:0,linguistica:0,criativa:0,colerico:0,fleumatico:0,sanguineo:0,melancolico:0 };
  respostas.forEach(r=>{ if(r&&s[r]!==undefined) s[r]++; });
  const iTop = ["logica","interpessoal","linguistica","criativa"].reduce((a,b)=>s[a]>=s[b]?a:b);
  const tTop = ["colerico","fleumatico","sanguineo","melancolico"].reduce((a,b)=>s[a]>=s[b]?a:b);
  const tN={colerico:"Colérico",fleumatico:"Fleumático",sanguineo:"Sanguíneo",melancolico:"Melancólico"};
  const iN={logica:"Lógica",interpessoal:"Interpessoal",linguistica:"Linguística",criativa:"Criativa"};
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

const Orb=({color,size,x,y,blur=120})=>(<div style={{position:"absolute",borderRadius:"50%",background:color,width:size,height:size,left:x,top:y,filter:`blur(${blur}px)`,opacity:0.13,pointerEvents:"none"}}/>);
const Sec=({title,cor,children})=>(<div style={{marginBottom:34}}><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><div style={{width:3,height:16,background:cor,borderRadius:2,flexShrink:0}}/><h3 style={{fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",color:"#9CA3AF",margin:0}}>{title}</h3></div>{children}</div>);
const bg={minHeight:"100vh",background:"#060409",fontFamily:"'Georgia','Times New Roman',serif",color:"#f0ede8",position:"relative",overflow:"hidden"};

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
  const top=useRef(null);
  const perfil=perfilKey?profiles[perfilKey]:null;
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
      <Orb color="#7C3AED" size={500} x="-8%" y="-8%"/><Orb color="#DB2777" size={380} x="58%" y="28%"/><Orb color="#1D4ED8" size={280} x="18%" y="68%"/>
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 24px",textAlign:"center"}}>
        <div style={{letterSpacing:"0.3em",fontSize:10,color:"#6B7280",textTransform:"uppercase",marginBottom:16}}>Sistema de Autoconhecimento</div>
        <h1 style={{fontSize:"clamp(52px,10vw,88px)",fontWeight:400,letterSpacing:"-0.02em",margin:"0 0 8px",lineHeight:1,fontStyle:"italic"}}><span style={{color:"#f0ede8"}}>Mind</span><span style={{color:"#7C3AED"}}>Code</span></h1>
        <div style={{width:60,height:1,background:"linear-gradient(90deg,transparent,#7C3AED,transparent)",margin:"22px auto"}}/>
        <p style={{fontSize:"clamp(15px,2.3vw,19px)",color:"#C4C0BB",maxWidth:500,lineHeight:1.8,margin:"0 0 44px",fontStyle:"italic"}}>Descubra o código único da sua mente — onde seu temperamento encontra sua inteligência dominante.</p>
        <div style={{display:"flex",gap:36,marginBottom:44,flexWrap:"wrap",justifyContent:"center"}}>
          {[["10","perguntas"],["16","perfis únicos"],["5","minutos"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:300,color:"#7C3AED"}}>{n}</div><div style={{fontSize:11,color:"#4B5563",letterSpacing:"0.1em"}}>{l}</div></div>
          ))}
        </div>
        <button onClick={()=>ir("nome")} style={{background:"linear-gradient(135deg,#7C3AED,#DB2777)",border:"none",color:"white",padding:"17px 52px",fontSize:15,letterSpacing:"0.1em",cursor:"pointer",borderRadius:2,fontFamily:"inherit",textTransform:"uppercase",boxShadow:"0 0 40px rgba(124,58,237,0.4)"}}>Iniciar o Teste</button>
        <p style={{marginTop:22,fontSize:11,color:"#374151"}}>Gratuito · Resultado disponível ao final</p>
      </div>
    </div>
  );

  if(tela==="nome") return(
    <div style={bg} ref={top}>
      <Orb color="#7C3AED" size={400} x="50%" y="0%" blur={160}/>
      <div style={{position:"relative",zIndex:1,maxWidth:520,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}>
        <div style={{fontSize:10,letterSpacing:"0.3em",color:"#6B7280",textTransform:"uppercase",marginBottom:20}}>Antes de começar</div>
        <h2 style={{fontSize:"clamp(24px,5vw,36px)",fontWeight:400,fontStyle:"italic",margin:"0 0 12px"}}>Como posso te chamar?</h2>
        <p style={{color:"#6B7280",fontSize:14,marginBottom:40,lineHeight:1.75}}>Seu nome tornará a análise mais pessoal — e o relatório PDF gerado ao final será personalizado para você.</p>
        <input type="text" value={nomeInput} onChange={e=>setNomeInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&nomeInput.trim()&&(setNome(nomeInput.trim()),ir("teste"))} placeholder="Digite seu primeiro nome..." autoFocus
          style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:3,padding:"16px 20px",color:"#f0ede8",fontSize:18,fontFamily:"inherit",textAlign:"center",outline:"none",boxSizing:"border-box",marginBottom:28}}/>
        <button onClick={()=>{ if(nomeInput.trim()){ setNome(nomeInput.trim()); ir("teste"); }}} disabled={!nomeInput.trim()}
          style={{background:nomeInput.trim()?"linear-gradient(135deg,#7C3AED,#DB2777)":"rgba(255,255,255,0.04)",border:"none",color:nomeInput.trim()?"white":"#374151",padding:"15px 52px",fontSize:14,letterSpacing:"0.1em",cursor:nomeInput.trim()?"pointer":"default",borderRadius:2,fontFamily:"inherit",textTransform:"uppercase",transition:"all 0.3s",marginBottom:14,display:"block",width:"100%"}}>
          Continuar
        </button>
        <button onClick={()=>{ setNome(""); ir("teste"); }} style={{background:"none",border:"none",color:"#2D3748",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Continuar sem informar nome</button>
      </div>
    </div>
  );

  if(tela==="teste"){
    const q=questions[pergunta];
    return(
      <div style={bg} ref={top}>
        <Orb color="#7C3AED" size={380} x="-5%" y="5%" blur={150}/><Orb color="#DB2777" size={280} x="68%" y="55%" blur={150}/>
        <div style={{position:"relative",zIndex:1,maxWidth:660,margin:"0 auto",padding:"40px 24px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:44}}>
            <div style={{flex:1,height:2,background:"#0f0c18"}}><div style={{height:"100%",background:"linear-gradient(90deg,#7C3AED,#DB2777)",width:`${prog}%`,transition:"width 0.4s ease"}}/></div>
            <span style={{fontSize:11,color:"#4B5563",whiteSpace:"nowrap"}}>{pergunta+1} / {questions.length}</span>
          </div>
          {nome&&<div style={{fontSize:12,color:"#374151",marginBottom:6}}>Olá, <span style={{color:"#9CA3AF"}}>{nome}</span></div>}
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <div style={{fontSize:10,letterSpacing:"0.3em",color:"#374151",textTransform:"uppercase",marginBottom:18}}>Pergunta {pergunta+1}</div>
            <h2 style={{fontSize:"clamp(18px,2.8vw,24px)",fontWeight:400,lineHeight:1.6,marginBottom:34,fontStyle:"italic"}}>{q.texto}</h2>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {q.opcoes.map((op,i)=>(
                <button key={i} onClick={()=>responder(op.tipo)} style={{background:sel===op.tipo?"rgba(124,58,237,0.2)":"rgba(255,255,255,0.025)",border:sel===op.tipo?"1px solid rgba(124,58,237,0.55)":"1px solid rgba(255,255,255,0.07)",color:"#f0ede8",padding:"16px 22px",textAlign:"left",cursor:"pointer",fontSize:14,fontFamily:"inherit",lineHeight:1.55,borderRadius:3,transition:"all 0.18s",opacity:anim&&sel!==op.tipo?0.3:1}}
                  onMouseEnter={e=>{ if(!anim){e.currentTarget.style.background="rgba(124,58,237,0.08)";e.currentTarget.style.borderColor="rgba(124,58,237,0.35)";}}}
                  onMouseLeave={e=>{ if(sel!==op.tipo){e.currentTarget.style.background="rgba(255,255,255,0.025)";e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";}}}
                ><span style={{color:"#7C3AED",marginRight:10}}>{String.fromCharCode(65+i)}.</span>{op.texto}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(tela==="preview"&&perfil) return(
    <div style={bg} ref={top}>
      <Orb color={perfil.cor} size={480} x="18%" y="-8%" blur={180}/><Orb color="#7C3AED" size={280} x="-8%" y="55%"/>
      <div style={{position:"relative",zIndex:1,maxWidth:660,margin:"0 auto",padding:"60px 24px",textAlign:"center"}}>
        {nome&&<div style={{fontSize:13,color:"#4B5563",marginBottom:8}}>Resultado de <span style={{color:"#9CA3AF"}}>{nome}</span></div>}
        <div style={{fontSize:10,letterSpacing:"0.3em",color:"#4B5563",textTransform:"uppercase",marginBottom:14}}>Seu perfil foi identificado</div>
        <div style={{fontSize:52,marginBottom:14}}>{perfil.emoji}</div>
        <h2 style={{fontSize:"clamp(28px,6vw,48px)",fontWeight:400,fontStyle:"italic",margin:"0 0 8px"}}>{perfil.nome}</h2>
        <div style={{display:"inline-block",padding:"4px 16px",borderRadius:2,border:`1px solid ${perfil.cor}38`,color:perfil.cor,fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:26}}>{perfilKey}</div>
        <div style={{width:55,height:1,background:`linear-gradient(90deg,transparent,${perfil.cor},transparent)`,margin:"0 auto 26px"}}/>
        <p style={{fontSize:17,fontStyle:"italic",color:"#D1D5DB",lineHeight:1.75,marginBottom:12}}>"{perfil.frase}"</p>
        <p style={{fontSize:14,color:"#6B7280",lineHeight:1.75,maxWidth:480,margin:"0 auto 40px"}}>{perfil.resumo}</p>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:4,padding:"26px 22px",marginBottom:34,textAlign:"left"}}>
          <div style={{fontSize:11,color:"#2D3748",marginBottom:14,letterSpacing:"0.05em"}}>O relatório completo inclui:</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px 14px"}}>
            {["Quem você é — análise profunda","Indo mais fundo","Pontos fortes detalhados","Sua sombra","Você sob pressão","Pontos cegos","Você nos relacionamentos","Carreiras ideais","Fato único sobre seu perfil","Download PDF personalizado"].map(it=>(
              <div key={it} style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"#374151"}}>
                <div style={{width:4,height:4,borderRadius:"50%",background:"#1F2937",flexShrink:0}}/><span style={{filter:"blur(2px)"}}>{it}</span>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:16,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.04)",fontSize:11,color:"#2D3748"}}>Conteúdo completo disponível após desbloqueio</div>
        </div>
        {/* ─── CHAMADA PERSUASIVA (PNL) ─── */}
        <div style={{marginBottom:30,textAlign:"left",maxWidth:540,marginLeft:"auto",marginRight:"auto"}}>
          <h3 style={{fontSize:"clamp(20px,3.4vw,27px)",fontWeight:400,fontStyle:"italic",color:"#f0ede8",lineHeight:1.45,marginBottom:18,textAlign:"center"}}>
            {nome?`${nome}, você acabou de ver apenas a ponta do iceberg.`:"Você acabou de ver apenas a ponta do iceberg."}
          </h3>
          <p style={{fontSize:15,color:"#C4C0BB",lineHeight:1.85,marginBottom:14}}>
            Tudo o que você sempre sentiu sobre si mesmo — mas nunca conseguiu colocar em palavras — está descrito, com precisão, no seu relatório completo. Não é horóscopo. É o mapa de como a sua mente realmente funciona.
          </p>
          <p style={{fontSize:15,color:"#C4C0BB",lineHeight:1.85,marginBottom:14}}>
            <span style={{color:"#f0ede8"}}>Imagine</span> abrir esse documento e finalmente entender por que você reage do jeito que reage, onde está a sua maior força e qual é o ponto cego que vem te custando caro há anos. Quando você se enxerga com clareza, decisões que pareciam difíceis simplesmente se resolvem.
          </p>
          <p style={{fontSize:15,color:"#9CA3AF",lineHeight:1.85}}>
            A maioria das pessoas atravessa a vida inteira sem nunca se conhecer de verdade. <span style={{color:"#f0ede8"}}>Você está a um clique de não ser uma delas.</span>
          </p>
        </div>

        <div style={{background:`linear-gradient(135deg,${perfil.cor}10,rgba(124,58,237,0.07))`,border:`1px solid ${perfil.cor}25`,borderRadius:4,padding:"30px 22px",marginBottom:16}}>
          <div style={{fontSize:11,letterSpacing:"0.18em",color:"#9CA3AF",textTransform:"uppercase",marginBottom:10}}>Seu relatório completo · {perfil.nome}</div>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:10,marginBottom:4}}>
            <span style={{fontSize:15,color:"#6B7280",textDecoration:"line-through"}}>R$ 47</span>
            <span style={{fontSize:36,fontWeight:300,color:perfil.cor}}>R$ 19,90</span>
          </div>
          <div style={{fontSize:12,color:"#4B5563",marginBottom:22}}>pagamento único · acesso imediato + PDF personalizado para {nome||"você"}</div>
          <button onClick={()=>ir("pagamento")} style={{background:`linear-gradient(135deg,${perfil.cor},#7C3AED)`,border:"none",color:"white",padding:"17px 44px",fontSize:15,letterSpacing:"0.08em",cursor:"pointer",borderRadius:2,fontFamily:"inherit",textTransform:"uppercase",width:"100%",fontWeight:600,boxShadow:`0 0 32px ${perfil.cor}45`}}>Quero Conhecer Minha Mente Agora</button>
          <div style={{fontSize:11,color:"#6B7280",marginTop:14}}>🔒 Compra 100% segura · Você recebe o acesso na hora</div>
        </div>
        <p style={{fontSize:11,color:"#374151"}}>Menos que um café por semana — por algo que você leva para o resto da vida.</p>
      </div>
    </div>
  );

  if(tela==="pagamento") return(
    <div style={bg} ref={top}>
      <Orb color="#7C3AED" size={380} x="48%" y="-2%" blur={180}/>
      <div style={{position:"relative",zIndex:1,maxWidth:460,margin:"0 auto",padding:"60px 24px",textAlign:"center"}}>
        <button onClick={()=>ir("preview")} style={{background:"none",border:"none",color:"#4B5563",cursor:"pointer",fontSize:12,marginBottom:28,fontFamily:"inherit"}}>← Voltar</button>
        <div style={{fontSize:10,letterSpacing:"0.3em",color:"#4B5563",textTransform:"uppercase",marginBottom:20}}>Último passo</div>
        <h2 style={{fontSize:"clamp(23px,4.5vw,30px)",fontWeight:400,fontStyle:"italic",marginBottom:14,lineHeight:1.4}}>{nome?`${nome}, seu relatório já está pronto.`:"Seu relatório já está pronto."}</h2>
        <p style={{color:"#9CA3AF",fontSize:14,lineHeight:1.8,marginBottom:30,maxWidth:400,marginLeft:"auto",marginRight:"auto"}}>Falta só um PIX para você desbloquear tudo o que descobrimos sobre a sua mente. Em segundos, ele estará na sua tela — e você não vai mais olhar para si mesmo da mesma forma.</p>
        <div style={{fontSize:10,letterSpacing:"0.25em",color:"#4B5563",textTransform:"uppercase",marginBottom:8}}>Pague com PIX</div>
        <p style={{color:"#374151",fontSize:13,marginBottom:30}}>Aprovação imediata · 100% seguro · Sem cadastro</p>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:4,padding:28,marginBottom:20}}>
          <div style={{background:"white",padding:14,borderRadius:3,display:"inline-block",marginBottom:18}}>
            <div style={{width:150,height:150,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="120" height="120" viewBox="0 0 120 120">{[...Array(6)].map((_,r)=>[...Array(6)].map((_,c)=>(<rect key={`${r}-${c}`} x={c*20} y={r*20} width={18} height={18} fill={(r+c)%3===0?"#111":"transparent"} rx={1}/>)))}</svg>
            </div>
          </div>
          <div style={{fontSize:30,fontWeight:300,color:"#7C3AED",marginBottom:4}}>R$ 19,90</div>
          <div style={{fontSize:11,color:"#374151",marginBottom:18}}>MindCode · {nome||"Autoconhecimento"}</div>
          <button onClick={()=>{ navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136mindcode@email.com.br520400005303986580 2BR5925MindCode6009SAOPAULO62070503***6304ABCD").catch(()=>{}); setPixOk(true); setTimeout(()=>setPixOk(false),3000); }} style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.22)",color:"#A78BFA",padding:"11px 22px",fontSize:12,cursor:"pointer",borderRadius:2,fontFamily:"inherit",width:"100%"}}>
            {pixOk?"✓ Código copiado!":"Copiar código PIX"}
          </button>
        </div>
        <div style={{background:"rgba(255,255,255,0.015)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:3,padding:"18px 22px",marginBottom:22,textAlign:"left",fontSize:12,color:"#4B5563",lineHeight:2.1}}>
          <div>1. Abra o app do seu banco</div><div>2. Escolha pagar com PIX</div><div>3. Escaneie o QR ou cole o código</div><div>4. Confirme o pagamento de R$ 19,90</div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:26,fontSize:11,color:"#6B7280"}}>
          <span>✓ Acesso imediato</span><span style={{color:"#2D3748"}}>·</span><span>✓ PDF para sempre</span><span style={{color:"#2D3748"}}>·</span><span>✓ Pagamento único</span>
        </div>
        <button onClick={()=>{ ir("resultado"); }} style={{background:"linear-gradient(135deg,#059669,#047857)",border:"none",color:"white",padding:"17px 44px",fontSize:15,letterSpacing:"0.08em",cursor:"pointer",borderRadius:2,fontFamily:"inherit",textTransform:"uppercase",width:"100%",fontWeight:600,boxShadow:"0 0 28px rgba(5,150,105,0.3)"}}>Já paguei · Liberar meu resultado</button>
        <p style={{fontSize:12,color:"#4B5563",marginTop:16,fontStyle:"italic"}}>O autoconhecimento é a única decisão que você nunca se arrepende de tomar.</p>
        <p style={{fontSize:10,color:"#1F2937",marginTop:10}}>Em produção: confirmação automática via webhook PIX</p>
      </div>
    </div>
  );

  if(tela==="resultado"&&perfil) return(
    <div style={bg} ref={top}>
      <Orb color={perfil.cor} size={580} x="8%" y="-4%" blur={200}/><Orb color="#7C3AED" size={380} x="58%" y="48%" blur={150}/>
      <div style={{position:"relative",zIndex:1,maxWidth:700,margin:"0 auto",padding:"60px 24px 80px"}}>
        <div style={{textAlign:"center",marginBottom:54}}>
          <div style={{fontSize:10,letterSpacing:"0.3em",color:"#4B5563",textTransform:"uppercase",marginBottom:14}}>MindCode · Perfil Completo</div>
          {nome&&<div style={{fontSize:14,color:"#4B5563",marginBottom:12}}>Análise de <span style={{color:"#C4C0BB",fontStyle:"italic"}}>{nome}</span></div>}
          <div style={{fontSize:58,marginBottom:14}}>{perfil.emoji}</div>
          <h1 style={{fontSize:"clamp(32px,6vw,56px)",fontWeight:400,fontStyle:"italic",margin:"0 0 10px"}}>{perfil.nome}</h1>
          <div style={{display:"inline-block",padding:"4px 18px",border:`1px solid ${perfil.cor}50`,color:perfil.cor,fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:26}}>{perfilKey}</div>
          <div style={{width:72,height:1,background:`linear-gradient(90deg,transparent,${perfil.cor},transparent)`,margin:"0 auto 26px"}}/>
          <p style={{fontSize:"clamp(15px,2.3vw,18px)",fontStyle:"italic",color:"#E5E7EB",lineHeight:1.8,maxWidth:530,margin:"0 auto 10px"}}>"{perfil.frase}"</p>
          <p style={{fontSize:14,color:"#6B7280",fontStyle:"italic",maxWidth:470,margin:"0 auto"}}>{perfil.resumo}</p>
        </div>

        {/* BASE TEÓRICA */}
        <div style={{background:"rgba(255,255,255,0.015)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:6,padding:"28px 26px",marginBottom:36}}>
          <div style={{fontSize:10,letterSpacing:"0.28em",color:"#6B7280",textTransform:"uppercase",marginBottom:22}}>A origem do seu perfil</div>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:`${perfil.cor}18`,border:`1px solid ${perfil.cor}35`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:13}}>🌡</span>
                </div>
                <span style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:perfil.cor}}>Seu temperamento — {perfilKey.split("-")[0]}</span>
              </div>
              <p style={{fontSize:14,lineHeight:1.85,color:"#9CA3AF",margin:0,paddingLeft:38}}>{perfil.base.arquetipo}</p>
            </div>
            <div style={{height:1,background:"rgba(255,255,255,0.04)"}}/>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:`${perfil.cor}18`,border:`1px solid ${perfil.cor}35`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:13}}>🧠</span>
                </div>
                <span style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:perfil.cor}}>Sua inteligência dominante — {perfilKey.split("-")[1]}</span>
              </div>
              <p style={{fontSize:14,lineHeight:1.85,color:"#9CA3AF",margin:0,paddingLeft:38}}>{perfil.base.inteligencia}</p>
            </div>
            <div style={{height:1,background:"rgba(255,255,255,0.04)"}}/>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:`${perfil.cor}25`,border:`1px solid ${perfil.cor}50`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:13}}>⚡</span>
                </div>
                <span style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:perfil.cor}}>Como eles se combinam em você</span>
              </div>
              <p style={{fontSize:14,lineHeight:1.85,color:"#C4C0BB",margin:0,paddingLeft:38}}>{perfil.base.combinacao}</p>
            </div>
          </div>
        </div>

        <Sec title="Quem você é" cor={perfil.cor}>
          <p style={{fontSize:15,lineHeight:1.9,color:"#D1D5DB",marginBottom:14}}>{perfil.descricao}</p>
          <p style={{fontSize:15,lineHeight:1.9,color:"#C4C0BB"}}>{perfil.descricao2}</p>
        </Sec>
        <Sec title="Seus pontos fortes" cor={perfil.cor}>
          {perfil.forcas.map((f,i)=>(<div key={i} style={{display:"flex",gap:13,marginBottom:13,alignItems:"flex-start"}}><div style={{width:17,height:17,borderRadius:"50%",background:`${perfil.cor}15`,border:`1px solid ${perfil.cor}35`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:3}}><div style={{width:5,height:5,borderRadius:"50%",background:perfil.cor}}/></div><p style={{fontSize:14,lineHeight:1.75,color:"#D1D5DB",margin:0}}>{f}</p></div>))}
        </Sec>
        <Sec title="Sua sombra — o que você evita ver" cor={perfil.cor}>
          {perfil.sombra.map((s,i)=>(<div key={i} style={{display:"flex",gap:13,marginBottom:13,alignItems:"flex-start"}}><div style={{width:17,height:17,borderRadius:"50%",background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.22)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:3}}><div style={{width:5,height:5,borderRadius:"50%",background:"#EF4444"}}/></div><p style={{fontSize:14,lineHeight:1.75,color:"#D1D5DB",margin:0}}>{s}</p></div>))}
        </Sec>
        <Sec title="Você sob pressão" cor={perfil.cor}><p style={{fontSize:15,lineHeight:1.9,color:"#D1D5DB"}}>{perfil.sobrePressao}</p></Sec>
        <Sec title="Seus pontos cegos" cor={perfil.cor}><p style={{fontSize:15,lineHeight:1.9,color:"#D1D5DB"}}>{perfil.pontosCegos}</p></Sec>
        <Sec title="Você nos relacionamentos" cor={perfil.cor}><p style={{fontSize:15,lineHeight:1.9,color:"#D1D5DB"}}>{perfil.relacoes}</p></Sec>
        <Sec title="Onde você prospera" cor={perfil.cor}>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{perfil.carreiras.map((c,i)=>(<span key={i} style={{padding:"7px 14px",background:`${perfil.cor}10`,border:`1px solid ${perfil.cor}25`,borderRadius:2,fontSize:12,color:"#D1D5DB"}}>{c}</span>))}</div>
        </Sec>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:4,padding:"22px 24px",marginBottom:32}}>
          <div style={{fontSize:10,letterSpacing:"0.25em",color:perfil.cor,textTransform:"uppercase",marginBottom:12}}>Fato sobre seu perfil</div>
          <p style={{fontSize:15,fontStyle:"italic",lineHeight:1.85,color:"#E5E7EB",margin:0}}>{perfil.fatoCurioso}</p>
        </div>
        <div style={{background:`linear-gradient(135deg,${perfil.cor}08,rgba(124,58,237,0.06))`,border:`1px solid ${perfil.cor}20`,borderRadius:4,padding:"24px 24px",marginBottom:46}}>
          <div style={{fontSize:10,letterSpacing:"0.25em",color:perfil.cor,textTransform:"uppercase",marginBottom:12}}>Para levar</div>
          <p style={{fontSize:16,fontStyle:"italic",lineHeight:1.85,color:"#E5E7EB",margin:0}}>{perfil.afirmacao}</p>
        </div>

        <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:34,textAlign:"center"}}>
          <div style={{fontSize:10,letterSpacing:"0.15em",color:"#374151",marginBottom:18,textTransform:"uppercase"}}>Salve e compartilhe</div>
          <button onClick={baixarPDF} disabled={gerando} style={{background:gerando?"rgba(255,255,255,0.03)":`linear-gradient(135deg,${perfil.cor},#7C3AED)`,border:"none",color:gerando?"#374151":"white",padding:"15px 40px",fontSize:14,letterSpacing:"0.1em",cursor:gerando?"default":"pointer",borderRadius:2,fontFamily:"inherit",textTransform:"uppercase",marginBottom:18,boxShadow:gerando?"none":`0 0 28px ${perfil.cor}28`,width:"100%",maxWidth:380,display:"block",margin:"0 auto 18px"}}>
            {gerando?"Gerando PDF...":"⬇  Baixar PDF Personalizado"}
          </button>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            {["WhatsApp","Instagram","TikTok","Copiar link"].map(b=>(
              <button key={b} onClick={()=>compartilhar(b)} style={{background:copiado===b?"rgba(124,58,237,0.12)":"rgba(255,255,255,0.025)",border:copiado===b?"1px solid rgba(124,58,237,0.35)":"1px solid rgba(255,255,255,0.07)",color:copiado===b?"#A78BFA":"#9CA3AF",padding:"10px 18px",fontSize:11,cursor:"pointer",borderRadius:2,fontFamily:"inherit",letterSpacing:"0.08em",transition:"all 0.2s",display:"flex",alignItems:"center",gap:7}}
                onMouseEnter={e=>{ if(copiado!==b){e.currentTarget.style.borderColor="rgba(124,58,237,0.3)";e.currentTarget.style.color="#D1D5DB";} }}
                onMouseLeave={e=>{ if(copiado!==b){e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";e.currentTarget.style.color="#9CA3AF";} }}
              ><BrandIcon name={b}/>{copiado===b?(b==="Copiar link"?"Link copiado!":"Legenda copiada!"):b}</button>
            ))}
          </div>
          <p style={{marginTop:12,fontSize:10,color:"#374151",lineHeight:1.6}}>No Instagram e TikTok, a legenda é copiada automaticamente — é só colar na sua publicação.</p>
          {nome&&<p style={{marginTop:26,fontSize:12,color:"#1F2937",fontStyle:"italic"}}>Análise gerada para <span style={{color:"#2D3748"}}>{nome}</span> · MindCode</p>}
        </div>
      </div>
    </div>
  );

  return null;
}
