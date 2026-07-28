/**
 * Shared content types and cross-locale taxonomy.
 * Per-page prose lives in src/content/{en,pt}/*. Taxonomy that must never
 * drift between locales (service/sector keys, the credentials list) lives here.
 */
import type { Locale } from '../i18n/routes';

export type ServiceKey = 'strategic' | 'investment' | 'project';
export type SectorKey = 'extractives' | 'ict' | 'financial' | 'public' | 'agri';

export interface Meta {
  title: string;
  description: string;
}

/** Route keys (from i18n/routes.ts) for each service and sector page. */
export const serviceRouteKey: Record<ServiceKey, string> = {
  strategic: 'strategic-advisory',
  investment: 'investment-advisory',
  project: 'project-management',
};

export const sectorRouteKey: Record<SectorKey, string> = {
  extractives: 'extractives',
  ict: 'ict',
  financial: 'financial-services',
  public: 'public-sector',
  agri: 'agribusiness-industry',
};

/** Text-based placeholder logo marks (see public/logos/README.txt). */
export const teamLogos: string[] = [
  'IFC',
  'BCG',
  'Lazard',
  'PJT Partners',
  'Perella Weinberg',
  'Credit Suisse',
  'Morgan Stanley',
  'BNP Paribas',
  'Mediobanca',
  'Houlihan Lokey',
  'Deloitte',
];

export type CredentialGroup = 'sell-side' | 'buy-side' | 'jv' | 'fund';

export interface Credential {
  id: number;
  group: CredentialGroup;
  services: ServiceKey[];
  sectors: SectorKey[];
  /** mono metadata */
  geography: string;
  type: { en: string; pt: string };
  status: { en: string; pt: string };
  text: { en: string; pt: string };
}

const COMPLETED = { en: 'Completed', pt: 'Concluído' };
const TRACK = { en: 'Track record', pt: 'Historial' };

/**
 * The twelve canonical engagements. No deal values, dates or client names are
 * fabricated. Service tags are interpretive (all are transaction/valuation work
 * = Investment Advisory; strategic/project tags added where the engagement
 * genuinely carries that dimension). See NOTES.md.
 */
export const credentials: Credential[] = [
  {
    id: 1,
    group: 'sell-side',
    services: ['investment'],
    sectors: ['extractives', 'financial', 'ict', 'agri'],
    geography: 'African markets',
    type: { en: 'Sell-side advisory', pt: 'Assessoria sell-side' },
    status: TRACK,
    text: {
      en: '20+ sell-side private equity transactions, principally in mining, finance, technology, oil and gas, and industrials.',
      pt: 'Mais de 20 transações de private equity em sell-side, sobretudo em mineração, finanças, tecnologia, petróleo e gás, e indústria.',
    },
  },
  {
    id: 2,
    group: 'sell-side',
    services: ['investment', 'strategic'],
    sectors: ['extractives', 'public'],
    geography: 'African markets',
    type: { en: 'IPO advisory', pt: 'Assessoria de IPO' },
    status: COMPLETED,
    text: {
      en: 'Advised an international mining company in negotiations with a government to define its IPO plan and timetable.',
      pt: 'Assessoria a uma empresa mineira internacional nas negociações com um governo para definir o seu plano e calendário de IPO.',
    },
  },
  {
    id: 3,
    group: 'sell-side',
    services: ['investment'],
    sectors: ['financial'],
    geography: 'Sub-Saharan Africa',
    type: { en: 'Private placement', pt: 'Colocação privada' },
    status: COMPLETED,
    text: {
      en: 'Advised a leading sub-Saharan bank on a private placement by an international investor.',
      pt: 'Assessoria a um importante banco da África subsariana numa colocação privada por um investidor internacional.',
    },
  },
  {
    id: 4,
    group: 'sell-side',
    services: ['investment'],
    sectors: ['financial'],
    geography: 'Angola',
    type: { en: 'Valuation & materials', pt: 'Avaliação e materiais' },
    status: COMPLETED,
    text: {
      en: 'Investor pitch deck and independent valuation for a leading private bank in Angola.',
      pt: 'Pitch deck para investidores e avaliação independente para um importante banco privado em Angola.',
    },
  },
  {
    id: 5,
    group: 'sell-side',
    services: ['investment', 'project'],
    sectors: ['financial'],
    geography: 'Angola',
    type: { en: 'Debt raising', pt: 'Captação de dívida' },
    status: COMPLETED,
    text: {
      en: 'Advised a local bank on the sourcing, negotiation and closing of a debt financing line.',
      pt: 'Assessoria a um banco local na procura, negociação e fecho de uma linha de financiamento de dívida.',
    },
  },
  {
    id: 6,
    group: 'sell-side',
    services: ['investment'],
    sectors: ['financial', 'extractives', 'agri'],
    geography: 'Angola',
    type: { en: 'Independent valuation', pt: 'Avaliação independente' },
    status: TRACK,
    text: {
      en: 'Independent valuations for banks, factories, mines, retailers and service companies in Angola.',
      pt: 'Avaliações independentes para bancos, fábricas, minas, retalhistas e empresas de serviços em Angola.',
    },
  },
  {
    id: 7,
    group: 'buy-side',
    services: ['investment'],
    sectors: ['financial', 'ict'],
    geography: 'African markets',
    type: { en: 'Buy-side advisory', pt: 'Assessoria buy-side' },
    status: TRACK,
    text: {
      en: '30+ buy-side private equity transactions in financial services, technology and data analytics.',
      pt: 'Mais de 30 transações de private equity em buy-side em serviços financeiros, tecnologia e análise de dados.',
    },
  },
  {
    id: 8,
    group: 'buy-side',
    services: ['investment'],
    sectors: ['extractives'],
    geography: 'Angola',
    type: { en: 'Buy-side valuation', pt: 'Avaliação buy-side' },
    status: COMPLETED,
    text: {
      en: 'Full buy-side valuation of an oil and gas company in Angola.',
      pt: 'Avaliação buy-side completa de uma empresa de petróleo e gás em Angola.',
    },
  },
  {
    id: 9,
    group: 'buy-side',
    services: ['investment', 'project'],
    sectors: ['ict', 'financial'],
    geography: 'African markets',
    type: { en: 'Buy-side due diligence', pt: 'Due diligence buy-side' },
    status: COMPLETED,
    text: {
      en: 'Due diligence for the acquisition of a KYC platform for vertical integration.',
      pt: 'Due diligence para a aquisição de uma plataforma KYC para integração vertical.',
    },
  },
  {
    id: 10,
    group: 'jv',
    services: ['investment', 'strategic'],
    sectors: ['agri'],
    geography: 'Angola',
    type: { en: 'Joint venture', pt: 'Joint venture' },
    status: COMPLETED,
    text: {
      en: 'Advised a local industrial player on a joint venture with a foreign strategic investor.',
      pt: 'Assessoria a um player industrial local numa joint venture com um investidor estratégico estrangeiro.',
    },
  },
  {
    id: 11,
    group: 'jv',
    services: ['investment', 'strategic'],
    sectors: ['extractives'],
    geography: 'Angola / Switzerland',
    type: { en: 'Joint venture', pt: 'Joint venture' },
    status: COMPLETED,
    text: {
      en: 'Facilitated and structured a joint venture agreement between an Angolan and a Swiss company in the oil and gas sector.',
      pt: 'Facilitação e estruturação de um acordo de joint venture entre uma empresa angolana e uma empresa suíça no setor do petróleo e gás.',
    },
  },
  {
    id: 12,
    group: 'fund',
    services: ['investment'],
    sectors: ['agri'],
    geography: 'African markets',
    type: { en: 'Fund structuring', pt: 'Estruturação de fundo' },
    status: COMPLETED,
    text: {
      en: 'Structured an investment fund with risk mechanisms focused on the poultry value chain.',
      pt: 'Estruturação de um fundo de investimento com mecanismos de risco focado na cadeia de valor avícola.',
    },
  },
];

export function credentialsForSector(sector: SectorKey): Credential[] {
  return credentials.filter((c) => c.sectors.includes(sector));
}

/** Localised group heading for credential grouping on the credentials page. */
export const credentialGroupLabel: Record<CredentialGroup, Record<Locale, string>> = {
  'sell-side': { en: 'Sell-side advisory', pt: 'Assessoria sell-side' },
  'buy-side': { en: 'Buy-side advisory', pt: 'Assessoria buy-side' },
  jv: { en: 'Joint ventures', pt: 'Joint ventures' },
  fund: { en: 'Investment funds', pt: 'Fundos de investimento' },
};
