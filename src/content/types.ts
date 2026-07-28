/**
 * Shared content shape. Both locale modules (content/en, content/pt) implement
 * SiteContent, guaranteeing the PT mirror never drifts from EN structurally.
 */
import type { Meta, ServiceKey, SectorKey } from './shared';

export interface TitledBlock {
  title: string;
  body: string;
}

export interface Pillar {
  key: ServiceKey;
  title: string;
  body: string;
}

export interface CapabilityItem {
  text: string;
  /** route key to link this capability to, if any */
  linkKey?: string;
}

export interface SectionBlock {
  title: string;
  paras?: string[];
  points?: string[];
  linkKey?: string;
  linkLabel?: string;
}

export interface HomeContent {
  meta: Meta;
  heroH1: string;
  heroSub: string;
  pillarsEyebrow: string;
  pillarsIntro: string;
  pillars: Pillar[];
  proofEyebrow: string;
  proof: { value: string; label: string }[];
  whyEyebrow: string;
  whyIntro: string;
  why: { title: string }[];
  approachTeaserEyebrow: string;
  approachTeaser: string;
  approachTeaserCta: string;
  sectorsEyebrow: string;
  sectorsIntro: string;
  teamEyebrow: string;
  teamParagraph: string;
  logoCaption: string;
  closingHeading: string;
  closingBody: string;
}

export interface AboutContent {
  meta: Meta;
  heading: string;
  opening: string;
  missionLabel: string;
  mission: string;
  visionLabel: string;
  vision: string;
  valuesLabel: string;
  values: TitledBlock[];
  apartLabel: string;
  apart: TitledBlock[];
  integrityQuote: string;
  teamLabel: string;
  teamParagraph: string;
  logoCaption: string;
}

export interface WhatWeDoContent {
  meta: Meta;
  heading: string;
  opening: string;
  lifecycleLabel: string;
  lifecycle: string[];
  services: Pillar[];
  specialistLabel: string;
  specialist: { key: string; title: string; body: string }[];
}

export interface StrategicContent {
  meta: Meta;
  heading: string;
  serviceName: string;
  serviceType: string;
  opening: string;
  capabilitiesLabel: string;
  capabilities: CapabilityItem[];
  blocks: TitledBlock[];
  note: string;
  closingHeading: string;
}

export interface InvestmentContent {
  meta: Meta;
  heading: string;
  serviceName: string;
  serviceType: string;
  opening: string;
  capabilitiesLabel: string;
  capabilities: CapabilityItem[];
  areasLabel: string;
  areas: string[];
  howLabel: string;
  how: TitledBlock[];
  processLinkLabel: string;
  sellSideLabel: string;
  buySideLabel: string;
}

export interface ProjectContent {
  meta: Meta;
  heading: string;
  serviceName: string;
  serviceType: string;
  opening: string;
  contentLabel: string;
  content: string[];
  empowermentLabel: string;
  empowerment: string;
  closingHeading: string;
}

export interface MultiSectionContent {
  meta: Meta;
  heading: string;
  opening: string;
  sections: SectionBlock[];
  closingHeading: string;
}

export interface SectorsHubContent {
  meta: Meta;
  heading: string;
  opening: string;
  items: { key: string; label: string }[];
}

export interface SectorPageContent {
  meta: Meta;
  sectorKey: SectorKey;
  heading: string;
  paras: string[];
  servicesLabel: string;
  serviceKeys: ServiceKey[];
  credentialsLabel: string;
}

export interface ApproachContent {
  meta: Meta;
  heading: string;
  opening: string;
  stagesLabel: string;
  stages: TitledBlock[];
  processLinksLabel: string;
  sellSideTitle: string;
  sellSideBody: string;
  buySideTitle: string;
  buySideBody: string;
}

export interface ProcessPageContent {
  meta: Meta;
  heading: string;
  outcomeLabel: string;
  phases: { n: number; phase: string; duration?: string; detail: string }[];
  contrastTitle: string;
  contrastPoints: string[];
  tailoredTitle: string;
  tailoredPoints: string[];
}

export interface CredentialsContent {
  meta: Meta;
  heading: string;
  opening: string;
}

export interface ContactContent {
  meta: Meta;
  heading: string;
  lede: string;
  directLabel: string;
  email: string;
  address: string;
  linkedin: string;
}

export interface SimplePageContent {
  meta: Meta;
  heading: string;
  body: string;
}

export interface SiteContent {
  home: HomeContent;
  about: AboutContent;
  whatWeDo: WhatWeDoContent;
  strategicAdvisory: StrategicContent;
  investmentAdvisory: InvestmentContent;
  projectManagement: ProjectContent;
  angolaMarketEntry: MultiSectionContent;
  aiReadiness: MultiSectionContent;
  sectors: SectorsHubContent;
  sectorPages: Record<string, SectorPageContent>;
  approach: ApproachContent;
  sellSide: ProcessPageContent;
  buySide: ProcessPageContent;
  credentials: CredentialsContent;
  contact: ContactContent;
  notFound: SimplePageContent;
  privacy: SimplePageContent;
  cookies: SimplePageContent;
}
