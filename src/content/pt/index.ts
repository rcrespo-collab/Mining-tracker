/**
 * Portuguese (pt-PT) site content.
 *
 * Structural mirror of ../en/index.ts. Same object keys, array lengths and
 * non-text identifiers (key/sectorKey/serviceKeys/linkKey/n/duration); only
 * human-readable copy is translated. See NOTES.md.
 */
import type { SiteContent } from '../types';

export const pt: SiteContent = {
  home: {
    meta: {
      title: 'Nyawira | Consultoria estratégica e de investimento',
      description:
        'A Nyawira aconselha na decisão, capta o capital e gere a entrega — uma empresa boutique de consultoria para instituições públicas e privadas nos mercados africanos.',
    },
    heroH1: 'Aconselhamos na decisão, captamos o capital e gerimos a entrega.',
    heroSub: 'Uma empresa boutique de consultoria para instituições públicas e privadas nos mercados africanos.',
    pillarsEyebrow: 'O que fazemos',
    pillarsIntro: 'Uma equipa, em sequência — da decisão até à entrega.',
    pillars: [
      {
        key: 'strategic',
        title: 'Consultoria Estratégica',
        body: 'Aconselhamos instituições públicas e privadas em questões estratégicas e desenvolvemos oportunidades de negócio para os nossos parceiros.',
      },
      {
        key: 'investment',
        title: 'Consultoria de Investimento',
        body: 'Estruturamos e aconselhamos os nossos clientes em transações de capital e dívida que maximizam o seu valor.',
      },
      {
        key: 'project',
        title: 'Gestão de Projetos',
        body: 'Gerimos projetos para garantir que são entregues dentro do prazo, dentro do orçamento e com os mais elevados padrões de qualidade.',
      },
    ],
    proofEyebrow: 'Historial',
    proof: [
      { value: '20+', label: 'transações de private equity em sell-side' },
      { value: '30+', label: 'transações de private equity em buy-side' },
      {
        value: '—',
        label: 'Avaliações independentes em banca, mineração, indústria transformadora e retalho em Angola',
      },
    ],
    whyEyebrow: 'Porquê a Nyawira',
    whyIntro: 'Quatro razões pelas quais as instituições escolhem trabalhar connosco.',
    why: [
      { title: 'Equipas experientes no terreno' },
      { title: 'Acesso à nossa rede global de especialistas' },
      { title: 'Mobilização colaborativa' },
      { title: 'Integridade' },
    ],
    approachTeaserEyebrow: 'A nossa abordagem',
    approachTeaser:
      'A maioria dos processos de sell-side começa com uma avaliação arbitrária e uma lista de vinte contactos. O nosso começa com os seus geradores de valor e um mapa regulatório.',
    approachTeaserCta: 'Como trabalhamos',
    sectorsEyebrow: 'Setores',
    sectorsIntro: 'Concentramo-nos onde já executámos.',
    teamEyebrow: 'A equipa',
    teamParagraph:
      'A nossa equipa traz experiência da IFC, BCG, Lazard, PJT Partners, Perella Weinberg Partners, Credit Suisse, Morgan Stanley, BNP Paribas, Mediobanca, Houlihan Lokey e Deloitte — combinada com um profundo conhecimento operacional dos mercados africanos. Os líderes seniores da nossa equipa têm décadas de experiência na gestão de transações complexas em mercados emergentes, complementada por uma rede internacional de especialistas setoriais.',
    logoCaption: 'Onde a nossa equipa trabalhou',
    closingHeading: 'Curioso? Fale connosco.',
    closingBody: 'Fale-nos sobre a decisão, a transação ou o projeto. Respondemos no prazo de dois dias úteis.',
  },

  about: {
    meta: {
      title: 'Sobre nós | Nyawira',
      description:
        'Uma empresa boutique focada em consultoria estratégica, consultoria de investimento e gestão de projetos para entidades dos setores público e privado nos mercados africanos.',
    },
    heading: 'Quem somos',
    opening:
      'A Nyawira é uma empresa boutique focada em consultoria estratégica, consultoria de investimentos e gestão de projetos para entidades dos setores público e privado. A Nyawira está posicionada de forma única nos mercados africanos, reunindo profissionais experientes da indústria com exposição global e uma compreensão das especificidades dos mercados locais.',
    missionLabel: 'Missão',
    mission:
      'A nossa missão é desbloquear o crescimento sustentável das economias de mercado emergentes, navegando em soluções e conectando oportunidades que causam impacto.',
    visionLabel: 'Visão',
    vision: 'Ser o parceiro de crescimento ideal para os nossos clientes, fornecendo as melhores soluções personalizadas da sua classe.',
    valuesLabel: 'Valores',
    values: [
      { title: 'Entrega de valor', body: 'Excelência na entrega de soluções.' },
      { title: 'O cliente vem em primeiro lugar', body: 'O sucesso do cliente é o nosso sucesso.' },
      { title: 'Parceria', body: 'Visão de longo prazo orientando as relações internas e externas.' },
      { title: 'Fiabilidade', body: 'Um parceiro fiável, honesto e de confiança para os nossos stakeholders.' },
    ],
    apartLabel: 'O que nos distingue',
    apart: [
      {
        title: 'Equipas experientes no terreno',
        body: 'Acesso direto a redes de especialistas seniores, com equipas globais reunidas para levar os recursos e a experiência da Nyawira aos nossos clientes.',
      },
      {
        title: 'Mobilização colaborativa',
        body: 'Trabalhamos com a equipa existente, e não sobre ela. Focamo-nos na mobilização e na gestão da mudança, e na cultura e nos valores do cliente.',
      },
      {
        title: 'Criação de valor, impacto sustentado',
        body: 'Um compromisso intenso com a criação de valor mensurável, incluindo através de iniciativas de conteúdo local com impacto sustentável. Orientados para resultados, garantindo que o impacto é alcançado rapidamente, com foco nas capacidades para um impacto sustentado.',
      },
      {
        title: 'Integridade',
        body: 'Honestidade intelectual — humilde perante os factos. O que você precisa ouvir, e não o que você quer ouvir.',
      },
    ],
    integrityQuote: 'O que você precisa ouvir, e não o que você quer ouvir.',
    teamLabel: 'A nossa equipa',
    teamParagraph:
      'A nossa equipa traz experiência da IFC, BCG, Lazard, PJT Partners, Perella Weinberg Partners, Credit Suisse, Morgan Stanley, BNP Paribas, Mediobanca, Houlihan Lokey e Deloitte — combinada com um profundo conhecimento operacional dos mercados africanos. Os líderes seniores da nossa equipa têm décadas de experiência na gestão de transações complexas em mercados emergentes, complementada por uma rede internacional de especialistas setoriais.',
    logoCaption: 'Onde a nossa equipa trabalhou',
  },

  whatWeDo: {
    meta: {
      title: 'O que fazemos | Nyawira',
      description:
        'Aconselhamos na decisão, financiamo-la e entregamo-la — consultoria estratégica, consultoria de investimento e gestão de projetos, em sequência, com a mesma equipa.',
    },
    heading: 'Como ajudamos',
    opening:
      'A maioria dos consultores faz uma de três coisas: ajuda-o a decidir, ajuda-o a financiar ou ajuda-o a entregar. Nós fazemos as três, em sequência, com a mesma equipa.',
    lifecycleLabel: 'O ciclo de vida da transação',
    lifecycle: [
      'Estratégia corporativa, de portefólio e de transação',
      'Estratégia de transação',
      'Preparação de materiais',
      'Due diligence',
      'Estruturação',
      'Documentação e fecho',
      'Execução da integração',
    ],
    services: [
      {
        key: 'strategic',
        title: 'Consultoria Estratégica',
        body: 'Aconselhamento em grandes decisões estratégicas de negócio e no desenvolvimento de novas oportunidades para os nossos parceiros.',
      },
      {
        key: 'investment',
        title: 'Consultoria de Investimento',
        body: 'Estruturação e aconselhamento em transações de capital e dívida, da estratégia até ao fecho.',
      },
      {
        key: 'project',
        title: 'Gestão de Projetos',
        body: 'Entrega de projetos complexos dentro do prazo, dentro do orçamento e com os mais elevados padrões de qualidade.',
      },
    ],
    specialistLabel: 'Ofertas especializadas',
    specialist: [
      {
        key: 'angola-market-entry',
        title: 'Entrada no mercado angolano',
        body: 'Mapeamento regulatório, procura de parceiros e estruturação de empreendimentos para entrantes estrangeiros.',
      },
      {
        key: 'ai-readiness',
        title: 'AI Readiness',
        body: 'Avaliação e preparação — estabelecendo o que é realmente viável antes da adoção.',
      },
    ],
  },

  strategicAdvisory: {
    meta: {
      title: 'Consultoria Estratégica | Nyawira',
      description:
        'Aconselhamos em grandes decisões estratégicas de negócio e apoiamos o desenvolvimento de novas oportunidades para os nossos parceiros nos mercados africanos.',
    },
    heading: 'Consultoria Estratégica',
    serviceName: 'Consultoria Estratégica',
    serviceType: 'Consultoria estratégica',
    opening:
      'A Nyawira pode aconselhá-lo sobre as principais decisões estratégicas de negócios, bem como apoiar o desenvolvimento de novas oportunidades para os nossos parceiros.',
    capabilitiesLabel: 'Capacidades',
    capabilities: [
      { text: 'Planos estratégicos para entidades dos setores público e privado' },
      { text: 'Desenho organizacional e operacional que maximiza a eficiência e a eficácia' },
      { text: 'Planeamento, estruturação e implementação de novos empreendimentos' },
      {
        text: 'Investigação de mercado aprofundada e conhecimento dos clientes, permitindo às empresas resolver problemas de negócio urgentes e captar oportunidades de crescimento',
      },
      { text: 'Desenvolvimento de negócio para empresas que entram no mercado angolano', linkKey: 'angola-market-entry' },
      { text: 'Avaliação e preparação de AI readiness', linkKey: 'ai-readiness' },
      { text: 'Desenvolvimento de casos de uso e ferramentas de IA' },
    ],
    blocks: [
      {
        title: 'Consultoria de crescimento',
        body: 'Avaliar a estratégia do cliente, os principais geradores de crescimento e as áreas de valor a desbloquear. Definir uma estratégia de crescimento personalizada com um roteiro claro e acionável.',
      },
      {
        title: 'Estudos e análises de mercado',
        body: 'Produzir informação de mercado granular e relevante. Fornecer acesso único a informação local de qualidade. Compreender as principais áreas de valor e crescimento dos nossos clientes.',
      },
    ],
    note: 'As capacidades listadas não são exaustivas.',
    closingHeading: 'Fale connosco sobre a sua estratégia.',
  },

  investmentAdvisory: {
    meta: {
      title: 'Consultoria de Investimento | Nyawira',
      description:
        'Consultoria sell-side e buy-side, captação de capital, PPP, due diligence e avaliações independentes — ajudando os clientes a navegar em transações complexas.',
    },
    heading: 'Consultoria de Investimento',
    serviceName: 'Consultoria de Investimento',
    serviceType: 'Consultoria de investimento',
    opening:
      'A nossa equipa de especialistas pode ajudar a navegar em negócios complexos e fornecer informações valiosas durante todo o processo de transação, garantindo que os nossos clientes tomem decisões informadas e alcancem os resultados desejados.',
    capabilitiesLabel: 'Capacidades',
    capabilities: [
      { text: 'Consultoria sell-side e buy-side para empresas privadas e públicas — estruturação de projetos, due diligence, captação de fundos' },
      { text: 'Captação de capital próprio e de dívida para projetos privados e de PPP' },
      { text: 'Organização e estruturação de Parcerias Público-Privadas' },
      { text: 'Due diligence para garantir a robustez comercial e financeira da sua transação' },
      { text: 'Procura de parceiros financeiros e estratégicos' },
      { text: 'Avaliação independente e justa de mercado de ativos e empresas' },
    ],
    areasLabel: 'Quatro áreas de serviço',
    areas: [
      'Captação de capital e dívida',
      'Fusões, aquisições e alienações',
      'Consultoria estratégica',
      'Reestruturação',
    ],
    howLabel: 'Como trabalhamos numa transação',
    how: [
      {
        title: 'Estratégia e estruturação da transação',
        body: 'Conceber a estrutura e o instrumento de transação ótimos e justos para os nossos clientes. Minimizar o risco da transação através de uma análise e negociação proativas e críticas.',
      },
      {
        title: 'Avaliação',
        body: 'Realizar avaliações de empresas e ativos. Preparar modelos financeiros da melhor qualidade para negócios e projetos complexos.',
      },
      {
        title: 'Due diligence',
        body: 'Supervisionar todo o processo de due diligence com todos os stakeholders.',
      },
      {
        title: 'Negociação da transação',
        body: 'Aconselhar os nossos clientes para maximizar o valor da transação e garantir resultados que funcionem para todas as partes.',
      },
      {
        title: 'Gestão da documentação',
        body: 'Trabalhar em estreita colaboração com prestadores externos para garantir uma execução e conclusão eficientes. Apoiar o processo de fecho com gestão de projeto e assistência no cumprimento das Condições Precedentes e das Condições Subsequentes.',
      },
      {
        title: 'Gestão de projeto',
        body: 'Gerir proativamente o contacto e as relações para garantir o envolvimento do investidor ou comprador. Maximizar a velocidade de transações estruturadas complexas, mitigando atrasos, evitando ineficiências e gerindo numerosos stakeholders e investidores.',
      },
    ],
    processLinkLabel: 'O nosso processo, em detalhe',
    sellSideLabel: 'Processo sell-side',
    buySideLabel: 'Processo buy-side',
  },

  projectManagement: {
    meta: {
      title: 'Gestão de Projetos | Nyawira',
      description:
        'Gerimos projetos para garantir que são entregues dentro do prazo, dentro do orçamento e em linha com os mais elevados padrões de qualidade.',
    },
    heading: 'Gestão de Projetos',
    serviceName: 'Gestão de Projetos',
    serviceType: 'Gestão de projetos',
    opening:
      'Gerimos projetos, garantindo que são entregues dentro do prazo, dentro do orçamento e em linha com os mais elevados padrões de qualidade.',
    contentLabel: 'Como gerimos a entrega',
    content: [
      'Gestão proativa de stakeholders e relações.',
      'Maximização da velocidade em processos complexos e estruturados.',
      'Mitigação de atrasos e prevenção de ineficiências.',
      'Gestão de numerosos stakeholders e investidores.',
      'Coordenação com prestadores externos para garantir uma execução e conclusão eficientes.',
    ],
    empowermentLabel: 'Capacitação',
    empowerment:
      'Capacitar os clientes é uma parte fundamental da nossa proposta de valor. Não os tornamos dependentes de nós.',
    closingHeading: 'Fale connosco sobre o seu projeto.',
  },

  angolaMarketEntry: {
    meta: {
      title: 'Entrada no mercado angolano | Nyawira',
      description:
        'Mapeamento regulatório, informação de mercado local, procura de parceiros e estruturação de joint ventures para entrantes estrangeiros no mercado angolano.',
    },
    heading: 'Entrar no mercado angolano',
    opening:
      'Angola é uma das maiores economias da África subsariana, com procura concentrada no setor extrativo, serviços financeiros, infraestruturas, agronegócio e indústria. Para os entrantes estrangeiros, a oportunidade é real mas raramente acessível a partir do exterior.',
    sections: [
      {
        title: 'A oportunidade',
        paras: [
          'Angola é uma das maiores economias da África subsariana, com um mercado interno considerável e procura no setor extrativo, serviços financeiros, infraestruturas, agronegócio e indústria. A reforma do quadro de investimento e cambial alargou a gama de setores abertos ao capital estrangeiro.',
          'O acesso continua a depender do conhecimento local. Os parceiros adequados, as estruturas viáveis e os termos aceitáveis são difíceis de avaliar sem uma presença no terreno e uma compreensão de como cada setor é regulado na prática.',
        ],
      },
      {
        title: 'O que torna a entrada difícil',
        points: [
          'Complexidade regulatória entre jurisdições.',
          'Identificação e seleção de parceiros locais adequados.',
          'Presença e rede locais limitadas para conduzir uma análise e negociação adequadas.',
          'Ausência de presença no terreno para orientar a avaliação sobre termos aceitáveis.',
        ],
      },
      {
        title: 'Como ajudamos',
        points: [
          'Mapeamento regulatório.',
          'Estudos de mercado e informação local granular.',
          'Procura de parceiros financeiros e estratégicos.',
          'Estruturação de joint ventures.',
          'Planeamento, estruturação e implementação de novos empreendimentos.',
        ],
      },
      {
        title: 'Experiência relevante',
        points: [
          'Facilitação e estruturação de um acordo de joint venture entre uma empresa angolana e uma empresa suíça no setor do petróleo e gás.',
          'Assessoria a um player industrial local numa joint venture com um investidor estratégico estrangeiro.',
        ],
      },
    ],
    closingHeading: 'Fale connosco sobre entrar em Angola.',
  },

  aiReadiness: {
    meta: {
      title: 'Avaliação de AI Readiness | Nyawira',
      description:
        'Uma avaliação que estabelece o que é realmente viável — dados, processos, governação e competências — antes de uma instituição adotar IA, priorizando depois os casos de uso.',
    },
    heading: 'Avaliação e preparação de AI readiness',
    opening:
      'A avaliação estabelece o que é realmente viável antes de uma instituição se comprometer a adotar IA.',
    sections: [
      {
        title: 'Porque é que a preparação vem primeiro',
        paras: [
          'Às instituições dos mercados emergentes está a ser pedido que adotem IA antes de os seus dados, processos e governação a poderem suportar. A pressão para agir ultrapassa muitas vezes as condições necessárias para agir bem.',
          'A avaliação estabelece o que é realmente viável. Fundamenta a decisão no estado dos dados, processos e governação da instituição, e não na ambição da tecnologia.',
        ],
      },
      {
        title: 'O que a avaliação abrange',
        points: [
          'Disponibilidade e qualidade dos dados.',
          'Maturidade dos processos.',
          'Restrições de governação e regulatórias.',
          'Implicações ao nível das competências e do modelo operacional.',
        ],
      },
      {
        title: 'Da avaliação ao caso de uso',
        paras: [
          'Desenvolvimento de casos de uso e ferramentas de IA, priorizados por viabilidade e valor.',
        ],
      },
      {
        title: 'Como se liga ao desenho do modelo operacional',
        paras: [
          'As conclusões da avaliação alimentam diretamente o modelo operacional e o desenho organizacional, parte do nosso trabalho de consultoria estratégica.',
        ],
        linkKey: 'strategic-advisory',
        linkLabel: 'Consultoria Estratégica',
      },
    ],
    closingHeading: 'Fale connosco sobre a sua AI readiness.',
  },

  sectors: {
    meta: {
      title: 'Setores | Nyawira',
      description:
        'A nossa experiência setorial é mais profunda no setor extrativo, serviços financeiros e setor público, com trabalho adicional em tecnologia e agronegócio.',
    },
    heading: 'Setores',
    opening:
      'Concentramo-nos onde já executámos. A nossa experiência setorial é mais profunda no setor extrativo, serviços financeiros e setor público.',
    items: [
      { key: 'extractives', label: 'Setor Extrativo' },
      { key: 'financial-services', label: 'Serviços Financeiros' },
      { key: 'public-sector', label: 'Setor Público' },
      { key: 'ict', label: 'Tecnologia, Informação e Telecomunicações' },
      { key: 'agribusiness-industry', label: 'Agronegócio e Indústria' },
    ],
  },

  sectorPages: {
    extractives: {
      meta: {
        title: 'Setor Extrativo | Nyawira',
        description:
          'Consultoria em mineração e petróleo e gás nos mercados africanos — assessoria de IPO, avaliação buy-side, estruturação de joint ventures e avaliações independentes para minas.',
      },
      sectorKey: 'extractives',
      heading: 'Setor Extrativo nos mercados africanos',
      paras: [
        'A nossa experiência no setor extrativo abrange mineração e petróleo e gás, tanto em sell-side como em buy-side. Assessorámos uma empresa mineira internacional nas negociações com um governo para definir o seu plano e calendário de IPO, e concluímos uma avaliação buy-side completa de uma empresa de petróleo e gás em Angola.',
        'Facilitámos e estruturámos também um acordo de joint venture entre uma empresa angolana e uma empresa suíça no setor do petróleo e gás, e realizámos avaliações independentes para minas em Angola. Ao longo destes trabalhos, a atividade combina rigor financeiro com uma compreensão de como o setor é regulado na prática.',
      ],
      servicesLabel: 'Serviços mais relevantes aqui',
      serviceKeys: ['investment', 'strategic'],
      credentialsLabel: 'Credenciais relacionadas',
    },
    ict: {
      meta: {
        title: 'Tecnologia, Informação e Telecom | Nyawira',
        description:
          'Transações em tecnologia e análise de dados nos mercados africanos — consultoria buy-side e due diligence, incluindo a aquisição de uma plataforma KYC.',
      },
      sectorKey: 'ict',
      heading: 'Tecnologia, Informação e Telecomunicações nos mercados africanos',
      paras: [
        'Em tecnologia, a nossa experiência concentra-se no buy-side. Assessorámos em transações de private equity em buy-side em tecnologia e análise de dados, e conduzimos a due diligence para a aquisição de uma plataforma KYC para integração vertical.',
        'Este trabalho baseia-se na mesma disciplina de transação que aplicamos noutros contextos — avaliando a robustez comercial e financeira, e estruturando aquisições que criam valor para além da própria transação.',
      ],
      servicesLabel: 'Serviços mais relevantes aqui',
      serviceKeys: ['investment', 'project'],
      credentialsLabel: 'Credenciais relacionadas',
    },
    'financial-services': {
      meta: {
        title: 'Serviços Financeiros | Nyawira',
        description:
          'Consultoria em banca e serviços financeiros nos mercados africanos — colocações privadas, avaliações, procura de linhas de dívida e due diligence de plataforma KYC.',
      },
      sectorKey: 'financial',
      heading: 'Serviços Financeiros nos mercados africanos',
      paras: [
        'Os serviços financeiros são uma das nossas áreas de experiência mais profundas. Assessorámos um importante banco da África subsariana numa colocação privada por um investidor internacional, preparámos um pitch deck para investidores e uma avaliação independente para um importante banco privado em Angola, e assessorámos um banco local na procura, negociação e fecho de uma linha de financiamento de dívida.',
        'O nosso trabalho de avaliação no setor inclui avaliações independentes para bancos em Angola, e a nossa experiência em due diligence inclui uma plataforma KYC. A combinação de captação de capital, avaliação e diligência permite-nos apoiar as instituições ao longo de toda a transação.',
      ],
      servicesLabel: 'Serviços mais relevantes aqui',
      serviceKeys: ['investment', 'strategic'],
      credentialsLabel: 'Credenciais relacionadas',
    },
    'public-sector': {
      meta: {
        title: 'Setor Público | Nyawira',
        description:
          'Consultoria ao setor público nos mercados africanos — estruturação de PPP, planos estratégicos para entidades públicas e negociações governamentais sobre calendários de IPO.',
      },
      sectorKey: 'public',
      heading: 'Setor Público nos mercados africanos',
      paras: [
        'O nosso trabalho no setor público combina consultoria de transações com estratégia. Assessorámos em negociações com um governo para definir o plano e o calendário de IPO de uma empresa mineira internacional, articulando os interesses de stakeholders públicos e privados.',
        'Estruturamos também Parcerias Público-Privadas e desenvolvemos planos estratégicos para entidades do setor público, levando às instituições públicas a mesma disciplina comercial que aplicamos às transações privadas.',
      ],
      servicesLabel: 'Serviços mais relevantes aqui',
      serviceKeys: ['investment', 'strategic'],
      credentialsLabel: 'Credenciais relacionadas',
    },
    'agribusiness-industry': {
      meta: {
        title: 'Agronegócio e Indústria | Nyawira',
        description:
          'Consultoria em agronegócio e indústria nos mercados africanos — estruturação de fundos de investimento, joint ventures industriais e avaliações de fábricas e retalho.',
      },
      sectorKey: 'agri',
      heading: 'Agronegócio e Indústria nos mercados africanos',
      paras: [
        'Em agronegócio e indústria, estruturámos um fundo de investimento com mecanismos de risco focado na cadeia de valor avícola, e assessorámos um player industrial local numa joint venture com um investidor estratégico estrangeiro.',
        'A nossa experiência de avaliação no setor inclui fábricas e retalhistas em Angola. Este trabalho combina a estruturação de fundos e transações com uma compreensão prática das operações industriais.',
      ],
      servicesLabel: 'Serviços mais relevantes aqui',
      serviceKeys: ['investment', 'strategic'],
      credentialsLabel: 'Credenciais relacionadas',
    },
  },

  approach: {
    meta: {
      title: 'A nossa abordagem | Nyawira',
      description:
        'Trabalhamos em equipas conjuntas, partilhamos a responsabilidade pela entrega e deixamos o cliente mais capaz do que o encontrámos.',
    },
    heading: 'Como trabalhamos',
    opening:
      'Trabalhamos em equipas conjuntas, partilhamos a responsabilidade pela entrega e deixamos o cliente mais capaz do que o encontrámos.',
    stagesLabel: 'Um modelo em três fases',
    stages: [
      { title: 'Análise', body: 'Trabalhamos em equipas conjuntas. Valorizamos as opiniões dos nossos clientes e também as desafiamos.' },
      { title: 'Recomendações', body: 'Equipas conjuntas produzem resultados conjuntos. Sem desvios, total transparência.' },
      { title: 'Implementação', body: 'Forte compromisso com a implementação. Responsabilidade partilhada pela entrega e pelos resultados.' },
      {
        title: 'Capacitação',
        body: 'Capacitar os clientes é uma parte fundamental da nossa proposta de valor. Não os tornamos dependentes de nós.',
      },
    ],
    processLinksLabel: 'Os nossos processos de transação',
    sellSideTitle: 'Processo sell-side',
    sellSideBody: 'Como criamos valor para clientes que vendem ou captam capital.',
    buySideTitle: 'Processo buy-side',
    buySideBody: 'Como identificamos e garantimos os alvos certos para os adquirentes.',
  },

  sellSide: {
    meta: {
      title: 'Processo sell-side | Nyawira',
      description:
        'O nosso processo sell-side começa com os seus geradores de valor e um mapa regulatório — não com uma avaliação arbitrária e uma lista de contactos.',
    },
    heading: 'O nosso processo sell-side cria valor para os nossos clientes',
    outcomeLabel: 'Avaliação da transação otimizada',
    phases: [
      {
        n: 1,
        phase: 'Avaliação financeira inicial',
        duration: '2 meses',
        detail: 'Análise da informação relevante e definição da estratégia financeira. Mapeamento regulatório.',
      },
      {
        n: 2,
        phase: 'Análise e estruturação',
        detail: 'Definição da estrutura ótima adaptada às expectativas do investidor. Uma proposta de valor clara para o investidor.',
      },
      {
        n: 3,
        phase: 'Materiais da melhor qualidade',
        duration: '1 mês',
        detail: 'Estudos e análises de mercado. Materiais de investimento personalizados, incluindo Information Memorandum, teaser e modelo financeiro.',
      },
      {
        n: 4,
        phase: 'Rede de investidores',
        detail: 'Acesso a uma vasta gama de investidores internacionais e regionais — bancos, fundos, family offices, empresas. Sondagem de mercado para um primeiro feedback sobre a transação, para ajustar e melhorar a equity story. Lista restrita de investidores interessados.',
      },
      {
        n: 5,
        phase: 'Execução do processo',
        duration: '3–9 meses',
        detail: 'Gestão do processo com os investidores — dataroom, due diligence, Q&A, fecho. Apoio à negociação. Gestão de investidores e terceiros, particularmente durante a due diligence. Total cumprimento dos requisitos legais e regulatórios.',
      },
    ],
    contrastTitle: 'O serviço de intermediação típico',
    contrastPoints: [
      'Sem análise dos geradores de valor da empresa',
      'Avaliação arbitrária, sem base na realidade',
      'Uma lista aleatória de 20 contactos para enviar o teaser',
      'Fraco conhecimento da regulação local',
      'Sem apoio nas negociações ou na execução da transação',
    ],
    tailoredTitle: 'Os nossos serviços personalizados',
    tailoredPoints: [
      'Identificação dos principais geradores de valor da empresa',
      'Uma avaliação refinada e otimizada, baseada num plano de negócios robusto que reflete a estratégia da empresa',
      'Seleção de investidores relevantes e direcionados com base no seu perfil, apetite e no valor que podem trazer aos nossos clientes',
      'Apoio em todas as fases do processo, da primeira análise até ao fecho',
    ],
  },

  buySide: {
    meta: {
      title: 'Processo buy-side | Nyawira',
      description:
        'O nosso processo buy-side identifica e garante os alvos certos — com presença local para avaliar termos aceitáveis e o preço certo.',
    },
    heading: 'O nosso processo buy-side identifica e garante os alvos certos',
    outcomeLabel: 'Avaliação aceitável do alvo, custo de transação controlado',
    phases: [
      {
        n: 1,
        phase: 'Estratégia e seleção',
        duration: '1 mês',
        detail: 'Determinação da estratégia de aquisição e dos critérios relevantes. Identificação e seleção de potenciais alvos.',
      },
      {
        n: 2,
        phase: 'Avaliação do alvo',
        duration: '2 meses',
        detail: 'Abordagem às empresas-alvo. Recolha de informação e materiais relevantes. Coordenação com parceiros e especialistas regionais e locais para avaliar os alvos.',
      },
      {
        n: 3,
        phase: 'Seleção e avaliação',
        detail: 'Visitas às instalações e gestão de Q&A. Avaliação das opções de financiamento. Determinação de termos e preço aceitáveis.',
      },
      {
        n: 4,
        phase: 'Negociação e fecho',
        duration: '2–9 meses',
        detail: 'Condução do processo de negociação — reuniões, ofertas iniciais, due diligence, Q&A, documentação. Coordenação com outros consultores, incluindo jurídico, fiscal e auditoria. Apresentação da oferta final.',
      },
    ],
    contrastTitle: 'A situação típica do comprador',
    contrastPoints: [
      'Sem uma estratégia de M&A claramente definida ou critérios de aquisição relevantes',
      'Dificuldade em identificar e selecionar empresas-alvo adequadas',
      'Presença e rede locais limitadas para conduzir uma análise e negociação adequadas',
      'Ausência de presença no terreno para orientar a avaliação sobre termos aceitáveis e o preço certo a oferecer',
    ],
    tailoredTitle: 'Os nossos serviços personalizados',
    tailoredPoints: [
      'Identificação de alvos alinhados com a estratégia de M&A e os critérios de aquisição do cliente',
      'Determinação dos principais geradores de valor do alvo',
      'Avaliação de sinergias e de termos e preço aceitáveis, criando valor tanto para o alvo como para o cliente após a transação',
      'Assistência em todas as fases, da definição da estratégia de M&A até ao fecho',
    ],
  },

  credentials: {
    meta: {
      title: 'Credenciais | Nyawira',
      description:
        'Uma seleção de trabalhos liderados pela nossa equipa em sell-side, buy-side, joint ventures e fundos de investimento. Os nomes dos clientes são omitidos quando se aplica confidencialidade.',
    },
    heading: 'Credenciais',
    opening: 'Uma seleção de trabalhos liderados pela nossa equipa. Os nomes dos clientes são omitidos quando se aplica confidencialidade.',
  },

  contact: {
    meta: {
      title: 'Contacto | Nyawira',
      description:
        'Fale-nos sobre a decisão, a transação ou o projeto. Respondemos no prazo de dois dias úteis. info@nyawiraconsulting.com.',
    },
    heading: 'Curioso? Fale connosco.',
    lede: 'Diga-nos em que está a trabalhar — a decisão, a transação ou o projeto. Respondemos no prazo de dois dias úteis.',
    directLabel: 'Direto',
    email: 'info@nyawiraconsulting.com',
    address: '[ADDRESS]',
    linkedin: '[LINKEDIN_URL]',
  },

  notFound: {
    meta: {
      title: 'Página não encontrada | Nyawira',
      description: 'Essa página não está aqui. Experimente os nossos serviços, credenciais ou entre em contacto.',
    },
    heading: 'Essa página não está aqui.',
    body: 'A ligação pode estar desatualizada. Experimente os nossos serviços, credenciais ou entre em contacto.',
  },

  privacy: {
    meta: {
      title: 'Política de privacidade | Nyawira',
      description: 'Como a Nyawira Consulting trata os dados pessoais submetidos através deste website.',
    },
    heading: 'Política de privacidade',
    body: '[A FORNECER: texto completo da política de privacidade, revisto por assessoria jurídica.] Este site recolhe apenas a informação que opta por enviar através do formulário de contacto (nome, empresa, email e mensagem), utilizada exclusivamente para responder ao seu pedido. Não utilizamos rastreadores de análise ou de publicidade e não fazemos pedidos de rede externos em tempo de execução. Para qualquer questão sobre os seus dados, envie um email para info@nyawiraconsulting.com.',
  },

  cookies: {
    meta: {
      title: 'Política de cookies | Nyawira',
      description: 'Como a Nyawira Consulting utiliza o armazenamento do navegador neste website.',
    },
    heading: 'Política de cookies',
    body: '[A FORNECER: texto completo da política de cookies, revisto por assessoria jurídica.] Este site não define quaisquer cookies de rastreamento ou de publicidade. O único armazenamento do navegador utilizado é uma única entrada de localStorage que regista o idioma escolhido, para que o site o possa recordar na sua próxima visita. Nunca é utilizado para o redirecionar automaticamente. Para qualquer questão, envie um email para info@nyawiraconsulting.com.',
  },
};

export default pt;
