import type { Addon } from '@/types/services'

export const ADDONS: Addon[] = [
  {
    id: 'seo-base',
    label: 'SEO On-page',
    description: 'Ottimizzazione meta tag, sitemap, struttura URL e contenuti',
    defaultPrice: 500,
    applicableTo: ['website'],
  },
  {
    id: 'seo-advanced',
    label: 'SEO Avanzato',
    description: 'Audit completo, strategia keyword, link building e reportistica avanzata',
    defaultPrice: 1500,
    applicableTo: ['website'],
  },
  {
    id: 'multilingual',
    label: 'Multilingua',
    description: 'Supporto multilingua con gestione traduzioni (per lingua aggiuntiva)',
    defaultPrice: 400,
    applicableTo: ['website'],
  },
  {
    id: 'members-area',
    label: 'Area Membri / Login',
    description: 'Sistema di autenticazione, registrazione e profilo utente',
    defaultPrice: 1200,
    applicableTo: ['website', 'integrations'],
  },
  {
    id: 'payments',
    label: 'Pagamenti Online',
    description: 'Integrazione Stripe/PayPal per pagamenti sicuri',
    defaultPrice: 800,
    applicableTo: ['website', 'integrations'],
  },
  {
    id: 'admin-dashboard',
    label: 'Dashboard Amministrativa',
    description: 'Pannello di controllo con statistiche e gestione contenuti',
    defaultPrice: 1500,
    applicableTo: ['website', 'integrations'],
  },
  {
    id: 'advanced-forms',
    label: 'Form Avanzati',
    description: 'Configuratori, wizard multi-step e validazione avanzata',
    defaultPrice: 600,
    applicableTo: ['website', 'integrations'],
  },
  {
    id: 'live-chat',
    label: 'Chat / Supporto Live',
    description: 'Widget di chat in tempo reale per assistenza clienti',
    defaultPrice: 400,
    applicableTo: ['website'],
  },
  {
    id: 'newsletter',
    label: 'Newsletter Integration',
    description: 'Integrazione con Mailchimp, SendGrid o servizio email marketing',
    defaultPrice: 300,
    applicableTo: ['website', 'integrations'],
  },
  {
    id: 'analytics',
    label: 'Analytics Avanzato',
    description: 'Google Analytics 4, eventi personalizzati e dashboard reportistica',
    defaultPrice: 350,
    applicableTo: ['website'],
  },
  {
    id: 'backup',
    label: 'Backup Automatico',
    description: 'Sistema di backup automatico giornaliero con ripristino',
    defaultPrice: 150,
    applicableTo: ['website', 'maintenance'],
  },
  {
    id: 'ssl',
    label: 'Certificato SSL Dedicato',
    description: 'Certificato SSL premium con validazione estesa',
    defaultPrice: 100,
    applicableTo: ['website', 'maintenance'],
  },
  {
    id: 'gdpr',
    label: 'Cookie Banner GDPR',
    description: 'Banner cookie conforme GDPR con gestione consensi',
    defaultPrice: 200,
    applicableTo: ['website'],
  },
  {
    id: 'social',
    label: 'Social Media Integration',
    description: 'Integrazione feed social, condivisione e login social',
    defaultPrice: 250,
    applicableTo: ['website'],
  },
]

export function getAddonsForCategory(categoryId: string): Addon[] {
  return ADDONS.filter(
    (a) => a.applicableTo.length === 0 || a.applicableTo.includes(categoryId)
  )
}
