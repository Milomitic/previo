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
    label: '1. Analisi iniziale e impostazione progetto',
    commercialLabel: 'Analisi e impostazione',
    description: 'Comprende raccolta requisiti, definizione struttura del sito, analisi dei contenuti da pubblicare e impostazione iniziale del progetto.',
    activities: [
      { id: 'raccolta-esigenze', label: 'Raccolta esigenze del cliente e obiettivi del sito', defaultPrice: 0, isOptional: false },
      { id: 'struttura-sito', label: 'Definizione della struttura del sito e delle pagine da realizzare', defaultPrice: 0, isOptional: false },
      { id: 'allineamento-stile', label: 'Allineamento su stile grafico, tono comunicativo e riferimenti visivi', defaultPrice: 0, isOptional: false },
      { id: 'raccolta-materiali', label: 'Raccolta materiali forniti dal cliente (logo, testi, immagini, contatti)', defaultPrice: 0, isOptional: false },
      { id: 'sitemap', label: 'Definizione della sitemap e della gerarchia dei contenuti', defaultPrice: 0, isOptional: false },
    ],
  },
  {
    id: 'design',
    label: '2. Progettazione interfaccia e struttura pagine',
    commercialLabel: 'Progettazione interfaccia',
    description: 'Comprende progettazione layout, struttura header/footer/menu, homepage e pagine interne responsive.',
    activities: [
      { id: 'layout-generale', label: 'Progettazione layout generale del sito', defaultPrice: 0, isOptional: false },
      { id: 'header-footer', label: 'Definizione struttura header, menu di navigazione e footer', defaultPrice: 0, isOptional: false },
      { id: 'homepage-design', label: 'Progettazione homepage', defaultPrice: 0, isOptional: false },
      { id: 'pagine-interne-design', label: 'Progettazione pagine interne standard', defaultPrice: 0, isOptional: false },
      { id: 'responsive-design', label: 'Definizione versione responsive per desktop, tablet e mobile', defaultPrice: 0, isOptional: false },
      { id: 'cta-percorsi', label: 'Impostazione call to action e percorsi di navigazione principali', defaultPrice: 0, isOptional: false },
    ],
  },
  {
    id: 'sviluppo',
    label: '3. Sviluppo sito web',
    commercialLabel: 'Design e sviluppo frontend',
    description: 'Comprende progettazione layout, sviluppo grafico e realizzazione del sito responsive composto da homepage e pagine interne.',
    activities: [
      { id: 'ambiente-dev', label: 'Configurazione ambiente di sviluppo', defaultPrice: 0, isOptional: false },
      { id: 'struttura-tecnica', label: 'Implementazione struttura tecnica del sito', defaultPrice: 0, isOptional: false },
      { id: 'componenti-grafici', label: 'Sviluppo componenti grafici comuni', defaultPrice: 0, isOptional: false },
      { id: 'homepage-dev', label: 'Realizzazione homepage', defaultPrice: 0, isOptional: false },
      { id: 'pagine-interne-dev', label: 'Realizzazione pagine interne', defaultPrice: 0, isOptional: false },
      { id: 'sezione-contatti', label: 'Implementazione sezione contatti', defaultPrice: 0, isOptional: false },
      { id: 'form-contatti', label: 'Implementazione form di contatto', defaultPrice: 0, isOptional: false },
      { id: 'collegamento-email', label: 'Collegamento email/form per ricezione richieste', defaultPrice: 0, isOptional: false },
      { id: 'mappa-sede', label: 'Inserimento mappa o riferimenti sede, se previsti', defaultPrice: 0, isOptional: false },
      { id: 'nav-mobile', label: 'Ottimizzazione base della navigazione mobile', defaultPrice: 0, isOptional: false },
    ],
  },
  {
    id: 'contenuti',
    label: '4. Inserimento e organizzazione contenuti',
    commercialLabel: 'Inserimento contenuti',
    description: 'Comprende caricamento contenuti forniti, ottimizzazione immagini e rifiniture generali.',
    activities: [
      { id: 'testi', label: 'Inserimento testi forniti dal cliente', defaultPrice: 0, isOptional: false },
      { id: 'formattazione', label: 'Formattazione contenuti testuali per leggibilità web', defaultPrice: 0, isOptional: false },
      { id: 'immagini', label: 'Inserimento immagini, loghi e materiali grafici', defaultPrice: 0, isOptional: false },
      { id: 'ottimizzazione-img', label: 'Ottimizzazione dimensionale base delle immagini', defaultPrice: 0, isOptional: false },
      { id: 'revisione-impaginazione', label: 'Revisione impaginazione contenuti sulle varie pagine', defaultPrice: 0, isOptional: false },
    ],
  },
  {
    id: 'ottimizzazioni',
    label: '5. Ottimizzazioni base',
    commercialLabel: 'Ottimizzazioni base',
    description: 'Comprende ottimizzazione performance, SEO base, form contatti e rifiniture generali.',
    activities: [
      { id: 'performance', label: 'Ottimizzazione prestazioni base lato frontend', defaultPrice: 0, isOptional: false },
      { id: 'seo-tecnica', label: 'Ottimizzazione SEO tecnica di base', defaultPrice: 0, isOptional: false },
      { id: 'meta-tags', label: 'Impostazione title e meta description principali', defaultPrice: 0, isOptional: false },
      { id: 'titoli-h', label: 'Impostazione gerarchia titoli H1/H2/H3', defaultPrice: 0, isOptional: false },
      { id: 'url-struttura', label: 'Ottimizzazione struttura URL delle pagine', defaultPrice: 0, isOptional: false },
      { id: 'sitemap-robots', label: 'Predisposizione sitemap e robots.txt', defaultPrice: 0, isOptional: false },
    ],
  },
  {
    id: 'compliance',
    label: '6. Compliance e contenuti obbligatori',
    commercialLabel: 'Compliance',
    description: 'Predisposizione pagine legali e banner cookie. I testi legali restano a carico del cliente o di consulente incaricato.',
    activities: [
      { id: 'privacy-policy', label: 'Predisposizione pagina Privacy Policy', defaultPrice: 0, isOptional: false },
      { id: 'cookie-policy', label: 'Predisposizione pagina Cookie Policy', defaultPrice: 0, isOptional: false },
      { id: 'cookie-banner', label: 'Inserimento banner cookie tramite soluzione terza', defaultPrice: 0, isOptional: false },
      { id: 'note-legali', label: 'Inserimento note legali, dati studio e recapiti professionali', defaultPrice: 0, isOptional: false },
      { id: 'verifica-info', label: 'Verifica presenza degli elementi minimi informativi richiesti', defaultPrice: 0, isOptional: false },
    ],
  },
  {
    id: 'testing',
    label: '7. Testing e revisione',
    commercialLabel: 'Test e revisione',
    description: 'Comprende test funzionali, verifiche responsive, correzioni e sessione di revisione finale con il cliente.',
    activities: [
      { id: 'test-menu-link', label: 'Verifica corretto funzionamento menu e link interni', defaultPrice: 0, isOptional: false },
      { id: 'test-form', label: 'Verifica corretto funzionamento form contatti', defaultPrice: 0, isOptional: false },
      { id: 'test-responsive', label: 'Test responsive su principali dispositivi/formati schermo', defaultPrice: 0, isOptional: false },
      { id: 'bug-fix', label: 'Correzione bug e rifiniture finali', defaultPrice: 0, isOptional: false },
      { id: 'revisione-cliente', label: 'Sessione di revisione finale con il cliente', defaultPrice: 0, isOptional: false },
      { id: 'modifiche-pre-golive', label: 'Eventuali piccole modifiche correttive pre go-live', defaultPrice: 0, isOptional: false },
    ],
  },
  {
    id: 'pubblicazione',
    label: '8. Pubblicazione online',
    commercialLabel: 'Pubblicazione',
    description: 'Comprende configurazione hosting e dominio, messa online, HTTPS/SSL e verifiche post-pubblicazione.',
    activities: [
      { id: 'config-hosting', label: 'Configurazione hosting e dominio', defaultPrice: 0, isOptional: false },
      { id: 'messa-online', label: 'Messa online del sito', defaultPrice: 0, isOptional: false },
      { id: 'https-ssl', label: 'Configurazione HTTPS/SSL', defaultPrice: 0, isOptional: false },
      { id: 'collegamento-dominio', label: 'Collegamento dominio', defaultPrice: 0, isOptional: false },
      { id: 'verifiche-post', label: 'Verifiche post-pubblicazione', defaultPrice: 0, isOptional: false },
      { id: 'controllo-produzione', label: 'Controllo corretto funzionamento del sito in produzione', defaultPrice: 0, isOptional: false },
    ],
  },
  {
    id: 'supporto',
    label: '9. Supporto post pubblicazione',
    commercialLabel: 'Supporto post go-live',
    description: 'Comprende assistenza tecnica iniziale, correzione anomalie e supporto per piccoli aggiustamenti.',
    activities: [
      { id: 'assistenza-post', label: 'Assistenza tecnica iniziale post go-live', defaultPrice: 0, isOptional: false },
      { id: 'correzione-anomalie', label: 'Correzione eventuali anomalie emerse dopo la pubblicazione', defaultPrice: 0, isOptional: false },
      { id: 'supporto-aggiustamenti', label: 'Supporto operativo per piccoli aggiustamenti iniziali', defaultPrice: 0, isOptional: false },
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
