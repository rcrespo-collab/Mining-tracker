/**
 * UI chrome strings per locale: nav labels, CTAs, form strings, footer.
 * Page body content lives in src/content/. This file is only the shell.
 */
import type { Locale } from './routes';

export interface Ui {
  htmlLang: string;
  localeLabel: string;
  skipToContent: string;
  nav: {
    about: string;
    whatWeDo: string;
    sectors: string;
    credentials: string;
    approach: string;
  };
  cta: {
    primary: string; // Talk to us
    relatedCredentials: string; // See related credentials
    discussTransaction: string; // Discuss your transaction
  };
  langSwitch: {
    label: string;
    en: string;
    pt: string;
  };
  menu: {
    open: string;
    close: string;
  };
  footer: {
    positioning: string;
    servicesHeading: string;
    sectorsHeading: string;
    exploreHeading: string;
    contactHeading: string;
    address: string;
    linkedin: string;
    privacy: string;
    cookies: string;
    rights: string;
  };
  form: {
    name: string;
    company: string;
    email: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    success: string;
    error: string;
    required: string;
    invalidEmail: string;
    sending: string;
  };
  filter: {
    byService: string;
    bySector: string;
    all: string;
    showing: string;
    services: { strategic: string; investment: string; project: string };
    sectors: {
      extractives: string;
      ict: string;
      financial: string;
      public: string;
      agri: string;
    };
  };
  breadcrumbHome: string;
}

export const ui: Record<Locale, Ui> = {
  en: {
    htmlLang: 'en',
    localeLabel: 'English',
    skipToContent: 'Skip to content',
    nav: {
      about: 'About us',
      whatWeDo: 'What we do',
      sectors: 'Sectors',
      credentials: 'Credentials',
      approach: 'Our approach',
    },
    cta: {
      primary: 'Talk to us',
      relatedCredentials: 'See related credentials',
      discussTransaction: 'Discuss your transaction',
    },
    langSwitch: { label: 'Language', en: 'EN', pt: 'PT' },
    menu: { open: 'Menu', close: 'Close' },
    footer: {
      positioning:
        'We advise on the decision, raise the capital, and manage the delivery. A boutique advisory firm for public and private institutions across African markets.',
      servicesHeading: 'What we do',
      sectorsHeading: 'Sectors',
      exploreHeading: 'Explore',
      contactHeading: 'Contact',
      address: '[ADDRESS]',
      linkedin: '[LINKEDIN_URL]',
      privacy: 'Privacy policy',
      cookies: 'Cookie policy',
      rights: 'All rights reserved.',
    },
    form: {
      name: 'Name',
      company: 'Company',
      email: 'Email',
      message: "What you're working on",
      messagePlaceholder: 'A few lines on the decision, transaction or project.',
      submit: 'Talk to us',
      success: "Thanks — we'll be in touch within two business days.",
      error: 'That didn’t send. Email us directly at info@nyawiraconsulting.com.',
      required: 'This field is required.',
      invalidEmail: 'Enter a valid email address.',
      sending: 'Sending…',
    },
    filter: {
      byService: 'Service',
      bySector: 'Sector',
      all: 'All',
      showing: 'Showing',
      services: {
        strategic: 'Strategic Advisory',
        investment: 'Investment Advisory',
        project: 'Project Management',
      },
      sectors: {
        extractives: 'Extractives',
        ict: 'ICT',
        financial: 'Financial Services',
        public: 'Public Sector',
        agri: 'Agribusiness & Industry',
      },
    },
    breadcrumbHome: 'Home',
  },
  pt: {
    htmlLang: 'pt-PT',
    localeLabel: 'Português',
    skipToContent: 'Saltar para o conteúdo',
    nav: {
      about: 'Quem somos',
      whatWeDo: 'O que fazemos',
      sectors: 'Setores',
      credentials: 'Credenciais',
      approach: 'A nossa abordagem',
    },
    cta: {
      primary: 'Fale connosco',
      relatedCredentials: 'Ver credenciais relacionadas',
      discussTransaction: 'Falar sobre a sua transação',
    },
    langSwitch: { label: 'Idioma', en: 'EN', pt: 'PT' },
    menu: { open: 'Menu', close: 'Fechar' },
    footer: {
      positioning:
        'Aconselhamos na decisão, levantamos o capital e gerimos a execução. Uma empresa boutique de consultoria para instituições públicas e privadas nos mercados africanos.',
      servicesHeading: 'O que fazemos',
      sectorsHeading: 'Setores',
      exploreHeading: 'Explorar',
      contactHeading: 'Contacto',
      address: '[ADDRESS]',
      linkedin: '[LINKEDIN_URL]',
      privacy: 'Política de privacidade',
      cookies: 'Política de cookies',
      rights: 'Todos os direitos reservados.',
    },
    form: {
      name: 'Nome',
      company: 'Empresa',
      email: 'Email',
      message: 'Em que está a trabalhar',
      messagePlaceholder: 'Algumas linhas sobre a decisão, transação ou projeto.',
      submit: 'Fale connosco',
      success: 'Obrigado — entraremos em contacto dentro de dois dias úteis.',
      error: 'Não foi possível enviar. Escreva-nos diretamente para info@nyawiraconsulting.com.',
      required: 'Este campo é obrigatório.',
      invalidEmail: 'Introduza um endereço de email válido.',
      sending: 'A enviar…',
    },
    filter: {
      byService: 'Serviço',
      bySector: 'Setor',
      all: 'Todos',
      showing: 'A mostrar',
      services: {
        strategic: 'Consultoria Estratégica',
        investment: 'Consultoria de Investimento',
        project: 'Gestão de Projetos',
      },
      sectors: {
        extractives: 'Setor Extrativo',
        ict: 'TIT',
        financial: 'Serviços Financeiros',
        public: 'Setor Público',
        agri: 'Agronegócio e Indústria',
      },
    },
    breadcrumbHome: 'Início',
  },
};
