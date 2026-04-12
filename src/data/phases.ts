export interface PhaseTemplate {
  id: string
  label: string
  commercialLabel: string
  description: string
  activities: ActivityTemplate[]
}

export interface ActivityTemplate {
  id: string
  label: string
  defaultPrice: number
  isOptional: boolean
}

export const PHASES: PhaseTemplate[] = [
  {
    id: 'analisi',
    label: '1. Analisi e impostazione',
    commercialLabel: 'Analisi e impostazione',
    description: 'Raccolta requisiti, definizione struttura del sito, analisi dei contenuti da pubblicare e impostazione iniziale del progetto.',
    activities: [
      { id: 'requisiti', label: 'Raccolta requisiti e obiettivi del progetto', defaultPrice: 0, isOptional: false },
      { id: 'struttura', label: 'Definizione struttura sito, sitemap e contenuti', defaultPrice: 0, isOptional: false },
      { id: 'stile', label: 'Allineamento su stile grafico e riferimenti visivi', defaultPrice: 0, isOptional: false },
      { id: 'materiali', label: 'Raccolta materiali dal cliente (logo, testi, immagini)', defaultPrice: 0, isOptional: false },
    ],
  },
  {
    id: 'design-sviluppo',
    label: '2. Design e sviluppo',
    commercialLabel: 'Design e sviluppo',
    description: 'Progettazione layout, sviluppo grafico e realizzazione del sito responsive composto da homepage e pagine interne.',
    activities: [
      { id: 'layout', label: 'Progettazione layout, header, footer e navigazione', defaultPrice: 0, isOptional: false },
      { id: 'homepage', label: 'Realizzazione homepage', defaultPrice: 0, isOptional: false },
      { id: 'pagine', label: 'Realizzazione pagine interne', defaultPrice: 0, isOptional: false },
      { id: 'contatti', label: 'Sezione contatti, form e collegamento email', defaultPrice: 0, isOptional: false },
      { id: 'responsive', label: 'Ottimizzazione responsive desktop, tablet e mobile', defaultPrice: 0, isOptional: false },
    ],
  },
  {
    id: 'contenuti-ottimizzazioni',
    label: '3. Contenuti e ottimizzazioni',
    commercialLabel: 'Contenuti e ottimizzazioni',
    description: 'Inserimento contenuti forniti, ottimizzazione immagini, SEO base, compliance GDPR e rifiniture generali.',
    activities: [
      { id: 'contenuti', label: 'Inserimento e formattazione testi, immagini e media', defaultPrice: 0, isOptional: false },
      { id: 'seo', label: 'SEO tecnica di base (meta tag, URL, sitemap)', defaultPrice: 0, isOptional: false },
      { id: 'performance', label: 'Ottimizzazione prestazioni e velocità', defaultPrice: 0, isOptional: false },
      { id: 'compliance', label: 'Privacy Policy, Cookie Policy e banner GDPR', defaultPrice: 0, isOptional: false },
    ],
  },
  {
    id: 'pubblicazione-supporto',
    label: '4. Test, pubblicazione e supporto',
    commercialLabel: 'Test, pubblicazione e supporto',
    description: 'Test funzionali, pubblicazione online, verifiche post go-live e supporto iniziale successivo alla consegna.',
    activities: [
      { id: 'testing', label: 'Test funzionali, responsive e correzione bug', defaultPrice: 0, isOptional: false },
      { id: 'revisione', label: 'Revisione finale con il cliente', defaultPrice: 0, isOptional: false },
      { id: 'pubblicazione', label: 'Configurazione hosting, dominio, SSL e messa online', defaultPrice: 0, isOptional: false },
      { id: 'supporto', label: 'Assistenza tecnica e aggiustamenti post go-live', defaultPrice: 0, isOptional: false },
    ],
  },
]

export const OPTIONAL_EXTRAS: ActivityTemplate[] = [
  { id: 'redazione-testi', label: 'Redazione testi', defaultPrice: 300, isOptional: true },
  { id: 'realizzazione-logo', label: 'Realizzazione logo o materiali grafici', defaultPrice: 400, isOptional: true },
  { id: 'servizio-foto', label: 'Servizio fotografico', defaultPrice: 500, isOptional: true },
  { id: 'traduzione', label: 'Traduzione in seconda lingua', defaultPrice: 400, isOptional: true },
  { id: 'blog-news', label: 'Blog/news con gestione autonoma', defaultPrice: 350, isOptional: true },
  { id: 'area-riservata', label: 'Area riservata', defaultPrice: 800, isOptional: true },
  { id: 'whatsapp', label: 'Integrazione WhatsApp', defaultPrice: 100, isOptional: true },
  { id: 'analytics', label: 'Integrazione Google Analytics / Search Console', defaultPrice: 150, isOptional: true },
  { id: 'cookie-avanzato', label: 'Gestione banner cookie avanzato', defaultPrice: 200, isOptional: true },
  { id: 'manutenzione', label: 'Manutenzione continuativa (mensile)', defaultPrice: 100, isOptional: true },
  { id: 'aggiornamenti-contenuti', label: 'Aggiornamenti contenutistici periodici (mensile)', defaultPrice: 80, isOptional: true },
]
