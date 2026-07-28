/**
 * English site content.
 *
 * Consolidated into one typed module per locale (this file + ../pt/index.ts)
 * rather than 38 single-page files — see NOTES.md. Page components read the
 * object for their page key; the PT module mirrors this shape exactly.
 *
 * All canonical copy from the brief is used verbatim.
 */
import type { SiteContent } from '../types';

export const en: SiteContent = {
  home: {
    meta: {
      title: 'Nyawira | Strategic & investment advisory in Africa',
      description:
        'Nyawira advises on the decision, raises the capital, and manages the delivery — a boutique advisory firm for public and private institutions across African markets.',
    },
    heroH1: 'We advise on the decision, raise the capital, and manage the delivery.',
    heroSub: 'A boutique advisory firm for public and private institutions across African markets.',
    pillarsEyebrow: 'What we do',
    pillarsIntro: 'One team, in sequence — from the decision through to delivery.',
    pillars: [
      {
        key: 'strategic',
        title: 'Strategic Advisory',
        body: 'We advise leading public and private institutions on strategic matters and develop business opportunities for our partners.',
      },
      {
        key: 'investment',
        title: 'Investment Advisory',
        body: 'We structure and advise our clients on equity and debt transactions that maximise their value.',
      },
      {
        key: 'project',
        title: 'Project Management',
        body: 'We manage projects to ensure they are delivered on time, on budget, and to the highest quality standards.',
      },
    ],
    proofEyebrow: 'Track record',
    proof: [
      { value: '20+', label: 'sell-side private equity transactions' },
      { value: '30+', label: 'buy-side private equity transactions' },
      {
        value: '—',
        label: 'Independent valuations across banking, mining, manufacturing and retail in Angola',
      },
    ],
    whyEyebrow: 'Why Nyawira',
    whyIntro: 'Four reasons institutions choose to work with us.',
    why: [
      { title: 'Experienced teams on the ground' },
      { title: 'Access to our global network of specialists' },
      { title: 'Collaborative mobilization' },
      { title: 'Integrity' },
    ],
    approachTeaserEyebrow: 'Our approach',
    approachTeaser:
      'Most sell-side processes begin with an arbitrary valuation and a list of twenty contacts. Ours begins with your value drivers and a regulatory map.',
    approachTeaserCta: 'How we work',
    sectorsEyebrow: 'Sectors',
    sectorsIntro: 'We concentrate where we have executed.',
    teamEyebrow: 'The team',
    teamParagraph:
      'Our team brings experience from IFC, BCG, Lazard, PJT Partners, Perella Weinberg Partners, Credit Suisse, Morgan Stanley, BNP Paribas, Mediobanca, Houlihan Lokey and Deloitte — combined with deep operating knowledge of African markets. Senior leaders on our team have decades of experience managing complex transactions in emerging markets, complemented by an international network of sector specialists.',
    logoCaption: 'Where our team has worked',
    closingHeading: 'Curious? Reach out to us.',
    closingBody: 'Tell us about the decision, the transaction, or the project. We reply within two business days.',
  },

  about: {
    meta: {
      title: 'About us | Nyawira',
      description:
        'A boutique firm focused on strategic advisory, investment advisory and project management for public and private sector entities across African markets.',
    },
    heading: 'Who we are',
    opening:
      'Nyawira is a boutique firm focused on strategic advisory, investment advisory and project management for public and private sector entities. We are uniquely positioned in African markets, bringing together experienced industry professionals with global exposure and an understanding of local market specificities.',
    missionLabel: 'Mission',
    mission:
      'To unlock sustainable growth in emerging market economies by navigating solutions and connecting opportunities that create impact.',
    visionLabel: 'Vision',
    vision: 'To be the ideal growth partner for our clients, delivering best-in-class tailored solutions.',
    valuesLabel: 'Values',
    values: [
      { title: 'Value delivery', body: 'Excellence in the delivery of solutions.' },
      { title: 'Client first', body: "Our client's success is our success." },
      { title: 'Partnership', body: 'A long-term view guiding our internal and external relationships.' },
      { title: 'Reliability', body: 'A dependable, honest and trustworthy partner for our stakeholders.' },
    ],
    apartLabel: 'What sets us apart',
    apart: [
      {
        title: 'Experienced teams on the ground',
        body: "Direct access to senior specialist networks, with global teams assembled to bring Nyawira's resources and experience to our clients.",
      },
      {
        title: 'Collaborative mobilization',
        body: "We work with the established team, not over it. We focus on mobilization and change management, and on the client's culture and values.",
      },
      {
        title: 'Value creation, sustained impact',
        body: 'An intense commitment to measurable value creation, including through local content initiatives with sustainable impact. Results-oriented, ensuring impact is achieved quickly, with focus on capabilities for sustained impact.',
      },
      {
        title: 'Integrity',
        body: 'Intellectual honesty. Humble before the facts. We tell you what you need to hear, not what you want to hear.',
      },
    ],
    integrityQuote: 'We tell you what you need to hear, not what you want to hear.',
    teamLabel: 'Our team',
    teamParagraph:
      'Our team brings experience from IFC, BCG, Lazard, PJT Partners, Perella Weinberg Partners, Credit Suisse, Morgan Stanley, BNP Paribas, Mediobanca, Houlihan Lokey and Deloitte — combined with deep operating knowledge of African markets. Senior leaders on our team have decades of experience managing complex transactions in emerging markets, complemented by an international network of sector specialists.',
    logoCaption: 'Where our team has worked',
  },

  whatWeDo: {
    meta: {
      title: 'What we do | Nyawira',
      description:
        'We advise on the decision, fund it, and deliver it — strategic advisory, investment advisory and project management, in sequence, with the same team.',
    },
    heading: 'How we help',
    opening:
      'Most advisers do one of three things: they help you decide, they help you fund it, or they help you deliver it. We do all three, in sequence, with the same team.',
    lifecycleLabel: 'The transaction lifecycle',
    lifecycle: [
      'Corporate, portfolio and transaction strategy',
      'Transaction strategy',
      'Materials preparation',
      'Due diligence',
      'Structuring',
      'Documentation and closing',
      'Integration execution',
    ],
    services: [
      {
        key: 'strategic',
        title: 'Strategic Advisory',
        body: 'Advice on major strategic business decisions and the development of new opportunities for our partners.',
      },
      {
        key: 'investment',
        title: 'Investment Advisory',
        body: 'Structuring and advising on equity and debt transactions, from strategy through to closing.',
      },
      {
        key: 'project',
        title: 'Project Management',
        body: 'Delivery of complex projects on time, on budget, and to the highest quality standards.',
      },
    ],
    specialistLabel: 'Specialist offers',
    specialist: [
      {
        key: 'angola-market-entry',
        title: 'Angola Market Entry',
        body: 'Regulatory mapping, partner sourcing and venture structuring for foreign entrants.',
      },
      {
        key: 'ai-readiness',
        title: 'AI Readiness',
        body: 'Assessment and preparation — establishing what is actually feasible before adoption.',
      },
    ],
  },

  strategicAdvisory: {
    meta: {
      title: 'Strategic Advisory | Nyawira',
      description:
        'We advise on major strategic business decisions and support the development of new opportunities for our partners across African markets.',
    },
    heading: 'Strategic Advisory',
    serviceName: 'Strategic Advisory',
    serviceType: 'Strategic advisory',
    opening:
      'Nyawira advises on major strategic business decisions and supports the development of new opportunities for our partners.',
    capabilitiesLabel: 'Capabilities',
    capabilities: [
      { text: 'Strategic plans for public and private sector entities' },
      { text: 'Organizational and operational design maximising efficiency and effectiveness' },
      { text: 'Planning, structuring and implementation of new ventures' },
      {
        text: 'In-depth market research and customer insights, enabling companies to solve urgent business problems and capture growth opportunities',
      },
      { text: 'Business development for companies entering the Angolan market', linkKey: 'angola-market-entry' },
      { text: 'AI readiness assessment and preparation', linkKey: 'ai-readiness' },
      { text: 'Development of AI use cases and tools' },
    ],
    blocks: [
      {
        title: 'Growth advisory',
        body: "Assess the client's strategy, key growth drivers and areas of value to unlock. Define a tailored growth strategy with a clear, actionable roadmap.",
      },
      {
        title: 'Market studies and analysis',
        body: 'Produce granular, relevant market intelligence. Provide unique access to quality local information. Understand the principal areas of value and growth for our clients.',
      },
    ],
    note: 'Capabilities listed are non-exhaustive.',
    closingHeading: 'Talk to us about your strategy.',
  },

  investmentAdvisory: {
    meta: {
      title: 'Investment Advisory | Nyawira',
      description:
        'Sell-side and buy-side advisory, capital raising, PPPs, due diligence and independent valuations — helping clients navigate complex transactions.',
    },
    heading: 'Investment Advisory',
    serviceName: 'Investment Advisory',
    serviceType: 'Investment advisory',
    opening:
      'Our team of specialists helps clients navigate complex deals and provides valuable insight throughout the transaction process, ensuring our clients make informed decisions and achieve their desired outcomes.',
    capabilitiesLabel: 'Capabilities',
    capabilities: [
      { text: 'Sell-side and buy-side advisory for private and public companies — project structuring, due diligence, fundraising' },
      { text: 'Equity and debt capital raising for private and PPP projects' },
      { text: 'Public-Private Partnership arrangement and structuring' },
      { text: 'Due diligence to ensure the commercial and financial robustness of your transaction' },
      { text: 'Sourcing of financial and strategic partners' },
      { text: 'Independent, fair market valuation of assets and companies' },
    ],
    areasLabel: 'Four service areas',
    areas: [
      'Capital and debt raising',
      'Mergers, acquisitions and divestitures',
      'Strategic advisory',
      'Restructuring',
    ],
    howLabel: 'How we work on a transaction',
    how: [
      {
        title: 'Transaction strategy and structuring',
        body: 'Design the optimal and fair transaction structure and instrument for our clients. Minimise transaction risk through proactive and critical analysis and negotiation.',
      },
      {
        title: 'Valuation',
        body: 'Perform company and asset valuations. Prepare best-in-class financial models for complex businesses and projects.',
      },
      {
        title: 'Due diligence',
        body: 'Oversee the entire due diligence process with all stakeholders.',
      },
      {
        title: 'Transaction negotiation',
        body: 'Advise our clients to maximise transaction value and secure outcomes that work for all parties.',
      },
      {
        title: 'Documentation management',
        body: 'Work closely with third-party providers to ensure efficient execution and completion. Support the closing process with project management and assistance in meeting Conditions Precedent and Conditions Subsequent.',
      },
      {
        title: 'Project management',
        body: 'Proactively manage contact and relationships to secure investor or buyer engagement. Maximise the speed of complex structured transactions, mitigating delays, avoiding inefficiencies and managing numerous stakeholders and investors.',
      },
    ],
    processLinkLabel: 'Our process, in detail',
    sellSideLabel: 'Sell-side process',
    buySideLabel: 'Buy-side process',
  },

  projectManagement: {
    meta: {
      title: 'Project Management | Nyawira',
      description:
        'We manage projects to ensure they are delivered on time, on budget, and in line with the highest quality standards.',
    },
    heading: 'Project Management',
    serviceName: 'Project Management',
    serviceType: 'Project management',
    opening:
      'We manage projects to ensure they are delivered on time, on budget, and in line with the highest quality standards.',
    contentLabel: 'How we manage delivery',
    content: [
      'Proactive stakeholder and relationship management.',
      'Maximising speed on complex, structured processes.',
      'Mitigating delays and avoiding inefficiencies.',
      'Managing numerous stakeholders and investors.',
      'Coordination with third-party providers to ensure efficient execution and completion.',
    ],
    empowermentLabel: 'Empowerment',
    empowerment:
      "Building our clients' capability is a fundamental part of our value proposition. We do not make our clients dependent on us.",
    closingHeading: 'Talk to us about your project.',
  },

  angolaMarketEntry: {
    meta: {
      title: 'Angola Market Entry | Nyawira',
      description:
        'Regulatory mapping, local market intelligence, partner sourcing and joint venture structuring for foreign entrants to the Angolan market.',
    },
    heading: 'Entering the Angolan market',
    opening:
      'Angola is one of sub-Saharan Africa’s larger economies, with demand concentrated in extractives, financial services, infrastructure, agribusiness and industry. For foreign entrants, the opportunity is real but rarely accessible from the outside.',
    sections: [
      {
        title: 'The opportunity',
        paras: [
          'Angola is one of sub-Saharan Africa’s larger economies, with a sizeable domestic market and demand across extractives, financial services, infrastructure, agribusiness and industry. Reform of the investment and foreign-exchange framework has widened the range of sectors open to foreign capital.',
          'Access still depends on local knowledge. Suitable partners, workable structures and acceptable terms are difficult to judge without a presence on the ground and an understanding of how each sector is regulated in practice.',
        ],
      },
      {
        title: 'What makes entry difficult',
        points: [
          'Regulatory complexity across jurisdictions.',
          'Identifying and screening suitable local partners.',
          'Limited local presence and network to conduct proper analysis and negotiation.',
          'No presence on the ground to guide judgement on acceptable terms.',
        ],
      },
      {
        title: 'How we help',
        points: [
          'Regulatory mapping.',
          'Market studies and granular local intelligence.',
          'Financial and strategic partner sourcing.',
          'Joint venture structuring.',
          'Planning, structuring and implementation of new ventures.',
        ],
      },
      {
        title: 'Relevant experience',
        points: [
          'Facilitated and structured a joint venture agreement between an Angolan and a Swiss company in the oil and gas sector.',
          'Advised a local industrial player on a joint venture with a foreign strategic investor.',
        ],
      },
    ],
    closingHeading: 'Talk to us about entering Angola.',
  },

  aiReadiness: {
    meta: {
      title: 'AI Readiness | Nyawira',
      description:
        'An assessment that establishes what is actually feasible — data, process, governance and skills — before an institution adopts AI, then prioritises use cases.',
    },
    heading: 'AI Readiness Assessment & Preparation',
    opening:
      'The assessment establishes what is actually feasible before an institution commits to adopting AI.',
    sections: [
      {
        title: 'Why readiness comes first',
        paras: [
          'Institutions in emerging markets are being asked to adopt AI before their data, processes and governance can support it. The pressure to act often runs ahead of the conditions needed to act well.',
          'The assessment establishes what is actually feasible. It grounds the decision in the state of the institution’s data, processes and governance, rather than in the ambition of the technology.',
        ],
      },
      {
        title: 'What the assessment covers',
        points: [
          'Data availability and quality.',
          'Process maturity.',
          'Governance and regulatory constraints.',
          'Skills and operating model implications.',
        ],
      },
      {
        title: 'From assessment to use case',
        paras: [
          'Development of AI use cases and tools, prioritised by feasibility and value.',
        ],
      },
      {
        title: 'How it connects to operating model design',
        paras: [
          'Readiness findings feed directly into operating model and organizational design, part of our strategic advisory work.',
        ],
        linkKey: 'strategic-advisory',
        linkLabel: 'Strategic Advisory',
      },
    ],
    closingHeading: 'Talk to us about your AI readiness.',
  },

  sectors: {
    meta: {
      title: 'Sectors | Nyawira',
      description:
        'Our sector experience is deepest in extractives, financial services and the public sector, with further work in technology and agribusiness.',
    },
    heading: 'Sectors',
    opening:
      'We concentrate where we have executed. Our sector experience is deepest in extractives, financial services and the public sector.',
    items: [
      { key: 'extractives', label: 'Extractives' },
      { key: 'financial-services', label: 'Financial Services' },
      { key: 'public-sector', label: 'Public Sector' },
      { key: 'ict', label: 'Technology, Information & Telecom' },
      { key: 'agribusiness-industry', label: 'Agribusiness & Industry' },
    ],
  },

  sectorPages: {
    extractives: {
      meta: {
        title: 'Extractives | Nyawira',
        description:
          'Mining and oil & gas advisory in African markets — IPO advisory, buy-side valuation, joint venture structuring and independent valuations for mines.',
      },
      sectorKey: 'extractives',
      heading: 'Extractives in African markets',
      paras: [
        'Our extractives experience spans mining and oil and gas, on both the sell-side and the buy-side. We have advised an international mining company in negotiations with a government to define its IPO plan and timetable, and completed a full buy-side valuation of an oil and gas company in Angola.',
        'We have also facilitated and structured a joint venture agreement between an Angolan and a Swiss company in the oil and gas sector, and carried out independent valuations for mines in Angola. Across these engagements, the work combines financial rigour with an understanding of how the sector is regulated in practice.',
      ],
      servicesLabel: 'Services that matter most here',
      serviceKeys: ['investment', 'strategic'],
      credentialsLabel: 'Related credentials',
    },
    ict: {
      meta: {
        title: 'Technology, Information & Telecom | Nyawira',
        description:
          'Technology and data analytics transactions in African markets — buy-side advisory and due diligence, including the acquisition of a KYC platform.',
      },
      sectorKey: 'ict',
      heading: 'Technology, Information & Telecom in African markets',
      paras: [
        'In technology, our experience is concentrated on the buy-side. We have advised on buy-side private equity transactions in technology and data analytics, and led due diligence for the acquisition of a KYC platform for vertical integration.',
        'This work draws on the same transaction discipline we apply elsewhere — assessing commercial and financial robustness, and structuring acquisitions that create value beyond the transaction itself.',
      ],
      servicesLabel: 'Services that matter most here',
      serviceKeys: ['investment', 'project'],
      credentialsLabel: 'Related credentials',
    },
    'financial-services': {
      meta: {
        title: 'Financial Services | Nyawira',
        description:
          'Banking and financial services advisory in African markets — private placements, valuations, debt line sourcing and KYC platform due diligence.',
      },
      sectorKey: 'financial',
      heading: 'Financial Services in African markets',
      paras: [
        'Financial services is one of our deepest areas of experience. We have advised a leading sub-Saharan bank on a private placement by an international investor, prepared an investor pitch deck and independent valuation for a leading private bank in Angola, and advised a local bank on the sourcing, negotiation and closing of a debt financing line.',
        'Our valuation work in the sector includes independent valuations for banks in Angola, and our due diligence experience includes a KYC platform. The combination of capital raising, valuation and diligence lets us support institutions across the full transaction.',
      ],
      servicesLabel: 'Services that matter most here',
      serviceKeys: ['investment', 'strategic'],
      credentialsLabel: 'Related credentials',
    },
    'public-sector': {
      meta: {
        title: 'Public Sector | Nyawira',
        description:
          'Public sector advisory in African markets — PPP structuring, strategic plans for public entities and government negotiations on IPO timetables.',
      },
      sectorKey: 'public',
      heading: 'Public Sector in African markets',
      paras: [
        'Our public sector work combines transaction advisory with strategy. We have advised in negotiations with a government to define an international mining company’s IPO plan and timetable, working across the interests of public and private stakeholders.',
        'We also structure Public-Private Partnerships and develop strategic plans for public sector entities, bringing the same commercial discipline to public institutions that we apply to private transactions.',
      ],
      servicesLabel: 'Services that matter most here',
      serviceKeys: ['investment', 'strategic'],
      credentialsLabel: 'Related credentials',
    },
    'agribusiness-industry': {
      meta: {
        title: 'Agribusiness & Industry | Nyawira',
        description:
          'Agribusiness and industrial advisory in African markets — investment fund structuring, industrial joint ventures and factory and retail valuations.',
      },
      sectorKey: 'agri',
      heading: 'Agribusiness & Industry in African markets',
      paras: [
        'In agribusiness and industry, we have structured an investment fund with risk mechanisms focused on the poultry value chain, and advised a local industrial player on a joint venture with a foreign strategic investor.',
        'Our valuation experience in the sector includes factories and retailers in Angola. This work pairs fund and transaction structuring with a practical understanding of industrial operations.',
      ],
      servicesLabel: 'Services that matter most here',
      serviceKeys: ['investment', 'strategic'],
      credentialsLabel: 'Related credentials',
    },
  },

  approach: {
    meta: {
      title: 'Our approach | Nyawira',
      description:
        'We work in joint teams, share accountability for delivery, and leave the client more capable than we found them.',
    },
    heading: 'How we work',
    opening:
      'We work in joint teams, share accountability for delivery, and leave the client more capable than we found them.',
    stagesLabel: 'A three-stage model',
    stages: [
      { title: 'Analysis', body: 'We work in joint teams. We value our clients’ views, and we also challenge them.' },
      { title: 'Recommendations', body: 'Joint teams produce joint outputs. No deviation, full transparency.' },
      { title: 'Implementation', body: 'Strong commitment to implementation. Shared accountability for delivery and for results.' },
      {
        title: 'Empowerment',
        body: "Building our clients' capability is a fundamental part of our value proposition. We do not make our clients dependent on us.",
      },
    ],
    processLinksLabel: 'Our transaction processes',
    sellSideTitle: 'Sell-side process',
    sellSideBody: 'How we create value for clients selling or raising capital.',
    buySideTitle: 'Buy-side process',
    buySideBody: 'How we identify and secure the right targets for acquirers.',
  },

  sellSide: {
    meta: {
      title: 'Sell-side process | Nyawira',
      description:
        'Our sell-side process starts with your value drivers and a regulatory map — not an arbitrary valuation and a list of contacts.',
    },
    heading: 'Our sell-side process creates value for our clients',
    outcomeLabel: 'Optimised transaction valuation',
    phases: [
      {
        n: 1,
        phase: 'Initial financial valuation',
        duration: '2 months',
        detail: 'Analysis of relevant information and definition of the financial strategy. Regulatory mapping.',
      },
      {
        n: 2,
        phase: 'Analysis and structuring',
        detail: 'Definition of the optimal structure adapted to investor expectations. A clear value proposition for the investor.',
      },
      {
        n: 3,
        phase: 'Best-in-class deliverables',
        duration: '1 month',
        detail: 'Market studies and analysis. Tailored investment materials including Information Memorandum, teaser and financial model.',
      },
      {
        n: 4,
        phase: 'Investor network',
        detail: 'Access to a wide range of international and regional investors — banks, funds, family offices, corporates. Market sounding for first feedback on the transaction, to adjust and improve the equity story. Shortlist of interested investors.',
      },
      {
        n: 5,
        phase: 'Process execution',
        duration: '3–9 months',
        detail: 'Management of the process with investors — dataroom, due diligence, Q&A, closing. Negotiation support. Management of investors and third parties, particularly during due diligence. Full compliance with legal and regulatory requirements.',
      },
    ],
    contrastTitle: 'The typical brokerage service',
    contrastPoints: [
      'No analysis of the company’s value drivers',
      'Arbitrary valuation, with no basis in reality',
      'A random list of 20 contacts to send the teaser to',
      'Weak knowledge of local regulation',
      'No support in negotiations or in transaction execution',
    ],
    tailoredTitle: 'Our tailored services',
    tailoredPoints: [
      'Identification of the company’s key value drivers',
      'A refined, optimised valuation based on a robust business plan reflecting the company’s strategy',
      'Selection of relevant, targeted investors based on their profile, appetite, and the value they can bring to our clients',
      'Support at every stage of the process, from first analysis through to closing',
    ],
  },

  buySide: {
    meta: {
      title: 'Buy-side process | Nyawira',
      description:
        'Our buy-side process identifies and secures the right targets — with local presence to judge acceptable terms and the right price.',
    },
    heading: 'Our buy-side process identifies and secures the right targets',
    outcomeLabel: 'Acceptable target valuation, controlled transaction cost',
    phases: [
      {
        n: 1,
        phase: 'Strategy and screening',
        duration: '1 month',
        detail: 'Determination of the acquisition strategy and relevant criteria. Identification and screening of potential targets.',
      },
      {
        n: 2,
        phase: 'Target assessment',
        duration: '2 months',
        detail: 'Approach to target companies. Collection of relevant information and materials. Coordination with regional and local partners and specialists to assess targets.',
      },
      {
        n: 3,
        phase: 'Selection and valuation',
        detail: 'Site visits and Q&A management. Assessment of financing options. Determination of acceptable terms and price.',
      },
      {
        n: 4,
        phase: 'Negotiation and closing',
        duration: '2–9 months',
        detail: 'Running the negotiation process — meetings, initial offers, due diligence, Q&A, documentation. Coordination with other advisers including legal, tax and audit. Presentation of the final offer.',
      },
    ],
    contrastTitle: 'The typical buyer situation',
    contrastPoints: [
      'No clearly defined M&A strategy or relevant acquisition criteria',
      'Difficulty identifying and screening suitable target companies',
      'Limited local presence and network to conduct proper analysis and negotiation',
      'No presence on the ground to guide judgement on acceptable terms and the right price to offer',
    ],
    tailoredTitle: 'Our tailored services',
    tailoredPoints: [
      'Identification of targets aligned with the client’s M&A strategy and acquisition criteria',
      'Determination of the target’s key value drivers',
      'Assessment of synergies and of acceptable terms and price, creating value for both the target and the client post-transaction',
      'Assistance at every stage, from definition of the M&A strategy through to closing',
    ],
  },

  credentials: {
    meta: {
      title: 'Credentials | Nyawira',
      description:
        'A selection of engagements led by our team across sell-side, buy-side, joint ventures and investment funds. Client names withheld where confidentiality applies.',
    },
    heading: 'Credentials',
    opening: 'A selection of engagements led by our team. Client names are withheld where confidentiality applies.',
  },

  contact: {
    meta: {
      title: 'Contact | Nyawira',
      description:
        'Tell us about the decision, the transaction or the project. We reply within two business days. info@nyawiraconsulting.com.',
    },
    heading: 'Curious? Reach out to us.',
    lede: 'Tell us what you’re working on — the decision, the transaction, or the project. We reply within two business days.',
    directLabel: 'Direct',
    email: 'info@nyawiraconsulting.com',
    address: '[ADDRESS]',
    linkedin: '[LINKEDIN_URL]',
  },

  notFound: {
    meta: {
      title: 'Page not found | Nyawira',
      description: 'That page isn’t here. Try our services, credentials, or get in touch.',
    },
    heading: 'That page isn’t here.',
    body: 'The link may be out of date. Try our services, credentials, or get in touch.',
  },

  privacy: {
    meta: {
      title: 'Privacy policy | Nyawira',
      description: 'How Nyawira Consulting handles personal data submitted through this website.',
    },
    heading: 'Privacy policy',
    body: '[TO BE SUPPLIED: full privacy policy text, reviewed by counsel.] This site collects only the information you choose to send through the contact form (name, company, email and message), used solely to respond to your enquiry. We do not run analytics or advertising trackers, and we make no external network requests at runtime. For any question about your data, email info@nyawiraconsulting.com.',
  },

  cookies: {
    meta: {
      title: 'Cookie policy | Nyawira',
      description: 'How Nyawira Consulting uses browser storage on this website.',
    },
    heading: 'Cookie policy',
    body: '[TO BE SUPPLIED: full cookie policy text, reviewed by counsel.] This site sets no tracking or advertising cookies. The only browser storage used is a single localStorage entry recording your chosen language, so the site can remember it on your next visit. It is never used to redirect you automatically. For any question, email info@nyawiraconsulting.com.',
  },
};

export default en;
