# Previo

Generatore di preventivi per professionisti IT freelance. SPA client-side che permette di configurare, visualizzare ed esportare preventivi professionali in PDF e DOCX.

## Funzionalita

- **Wizard 6 step** — Servizio, Configurazione, Add-on, Tempistiche, Cliente, Riepilogo
- **Pricing granulare** — Costo base + pagine extra + materiale grafico + dominio/hosting + parametri custom
- **Parametri dinamici** — Aggiungi voci personalizzate direttamente dall'interfaccia
- **Regime prestazione occasionale** — Ritenuta d'acconto 20%, marca da bollo automatica (>77,47 EUR)
- **Prezzo Amico** — Sconto preconfigurato per amici/conoscenti
- **Google Custom Search API** — Suggerimenti prezzi basati sul mercato italiano
- **Export PDF e DOCX** — Layout professionale con dati professionista, cliente, voci dettagliate e totali
- **Settings persistenti** — Dati professionali, upload logo, prezzi default, termini e condizioni
- **Dark mode** — Light, dark e system
- **Responsive** — Mobile, tablet, desktop

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui
- Zustand (state management con localStorage)
- @react-pdf/renderer (generazione PDF)
- docx + file-saver (generazione DOCX)
- lucide-react (icone)

## Setup

```bash
npm install
npm run dev
```

Per accedere da altri dispositivi sulla stessa rete:

```bash
npx vite --host
```

## Struttura

```
src/
  components/
    export/       # Generazione PDF e DOCX
    layout/       # AppShell, Header, Sidebar
    quote/        # Wizard steps e componenti preventivo
    settings/     # Dialog impostazioni
    ui/           # Componenti shadcn/ui
  data/           # Catalogo servizi, add-on, prezzi, termini
  hooks/          # useQuoteCalculations, useDarkMode, useMediaQuery
  stores/         # Zustand stores (quote, settings)
  types/          # TypeScript interfaces
  utils/          # Calcoli, formattazione, Google Search
```

## Regime fiscale

L'app genera preventivi per **prestazione occasionale** (art. 2222 c.c.):

- Nessuna Partita IVA
- Operazione fuori campo IVA (art. 5 DPR 633/72)
- Ritenuta d'acconto 20% opzionale (art. 25 DPR 600/73)
- Marca da bollo 2 EUR per importi > 77,47 EUR
