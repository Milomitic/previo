import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Quote, LineItem, ClientData, CustomParam } from '@/types/quote'
import { getServiceType } from '@/data/services'
import { ADDONS } from '@/data/addons'
import { generateId } from '@/utils/idGenerator'
import { formatQuoteNumber } from '@/utils/formatting'
import { DEFAULT_TERMS } from '@/data/terms'
import {
  DEFAULT_CONSULTING_HOURLY_RATE,
  DEFAULT_URGENCY_SURCHARGE_PERCENT,
  RITENUTA_ACCONTO_RATE,
  DEFAULT_INCLUDED_PAGES,
  DEFAULT_GRAPHICS_COST,
  DEFAULT_DOMAIN_HOSTING_COST,
} from '@/data/pricing'

function createEmptyClient(): ClientData {
  return {
    type: 'azienda',
    name: '',
    contactPerson: '',
    address: '',
    city: '',
    province: '',
    cap: '',
    country: 'Italia',
    partitaIva: '',
    codiceFiscale: '',
    codiceDestinatario: '',
    pec: '',
    email: '',
    phone: '',
  }
}

function createNewQuote(prefix: string, num: number): Quote {
  const now = new Date()
  const validUntil = new Date(now)
  validUntil.setDate(validUntil.getDate() + 30)

  return {
    id: generateId(),
    quoteNumber: formatQuoteNumber(prefix, num),
    createdAt: now.toISOString(),
    validUntil: validUntil.toISOString(),
    status: 'draft',
    service: null,
    pages: DEFAULT_INCLUDED_PAGES,
    clientProvidesGraphics: true,
    includeDomainHosting: false,
    customParams: [],
    addons: [],
    timeline: { type: 'standard', surchargePercent: DEFAULT_URGENCY_SURCHARGE_PERCENT },
    consultingHours: 0,
    lineItems: [],
    discount: { enabled: false, percentage: 0, isFriendPrice: false },
    taxConfig: { ritenutaAcconto: false, ritenutaRate: RITENUTA_ACCONTO_RATE },
    client: createEmptyClient(),
    notes: '',
    termsAndConditions: DEFAULT_TERMS,
  }
}

interface QuoteStore {
  quote: Quote
  currentStep: number

  setStep: (step: number) => void
  setService: (categoryId: string, typeId: string) => void
  setPages: (pages: number) => void
  setGraphics: (clientProvides: boolean) => void
  setDomainHosting: (include: boolean) => void
  addCustomParam: (label: string, price: number) => void
  toggleCustomParam: (id: string) => void
  removeCustomParam: (id: string) => void
  updateCustomParamPrice: (id: string, price: number) => void
  toggleAddon: (addonId: string) => void
  setTimeline: (type: 'standard' | 'urgente') => void
  setConsultingHours: (hours: number) => void
  updateLineItem: (id: string, changes: Partial<LineItem>) => void
  addCustomLineItem: (description: string, unitPrice: number) => void
  removeLineItem: (id: string) => void
  setDiscount: (enabled: boolean, percentage: number, isFriendPrice: boolean) => void
  setRitenutaAcconto: (enabled: boolean) => void
  setClient: (data: Partial<ClientData>) => void
  setNotes: (notes: string) => void
  setTerms: (terms: string) => void
  resetQuote: (prefix: string, num: number) => void
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set) => ({
      quote: createNewQuote('PRV', 1),
      currentStep: 0,

      setStep: (step) => set({ currentStep: step }),

      setService: (categoryId, typeId) =>
        set((state) => {
          const serviceType = getServiceType(categoryId, typeId)
          const pages = serviceType ? serviceType.includedPages : state.quote.pages
          const quote = { ...state.quote, service: { categoryId, typeId }, pages }
          return { quote: rebuildItems(quote) }
        }),

      setPages: (pages) =>
        set((state) => {
          const quote = { ...state.quote, pages: Math.max(0, pages) }
          return { quote: rebuildItems(quote) }
        }),

      setGraphics: (clientProvides) =>
        set((state) => {
          const quote = { ...state.quote, clientProvidesGraphics: clientProvides }
          return { quote: rebuildItems(quote) }
        }),

      setDomainHosting: (include) =>
        set((state) => {
          const quote = { ...state.quote, includeDomainHosting: include }
          return { quote: rebuildItems(quote) }
        }),

      addCustomParam: (label, price) =>
        set((state) => {
          const param: CustomParam = { id: generateId(), label, enabled: true, price }
          const quote = { ...state.quote, customParams: [...state.quote.customParams, param] }
          return { quote: rebuildItems(quote) }
        }),

      toggleCustomParam: (id) =>
        set((state) => {
          const customParams = state.quote.customParams.map((p) =>
            p.id === id ? { ...p, enabled: !p.enabled } : p
          )
          const quote = { ...state.quote, customParams }
          return { quote: rebuildItems(quote) }
        }),

      removeCustomParam: (id) =>
        set((state) => {
          const customParams = state.quote.customParams.filter((p) => p.id !== id)
          const quote = { ...state.quote, customParams }
          return { quote: rebuildItems(quote) }
        }),

      updateCustomParamPrice: (id, price) =>
        set((state) => {
          const customParams = state.quote.customParams.map((p) =>
            p.id === id ? { ...p, price } : p
          )
          const quote = { ...state.quote, customParams }
          return { quote: rebuildItems(quote) }
        }),

      toggleAddon: (addonId) =>
        set((state) => {
          const addons = state.quote.addons.includes(addonId)
            ? state.quote.addons.filter((id) => id !== addonId)
            : [...state.quote.addons, addonId]
          const quote = { ...state.quote, addons }
          return { quote: rebuildItems(quote) }
        }),

      setTimeline: (type) =>
        set((state) => ({
          quote: { ...state.quote, timeline: { ...state.quote.timeline, type } },
        })),

      setConsultingHours: (hours) =>
        set((state) => {
          const quote = { ...state.quote, consultingHours: hours }
          return { quote: rebuildItems(quote) }
        }),

      updateLineItem: (id, changes) =>
        set((state) => ({
          quote: {
            ...state.quote,
            lineItems: state.quote.lineItems.map((item) =>
              item.id === id ? { ...item, ...changes } : item
            ),
          },
        })),

      addCustomLineItem: (description, unitPrice) =>
        set((state) => ({
          quote: {
            ...state.quote,
            lineItems: [
              ...state.quote.lineItems,
              {
                id: generateId(),
                description,
                quantity: 1,
                unitPrice,
                category: 'custom' as const,
                isEditable: true,
              },
            ],
          },
        })),

      removeLineItem: (id) =>
        set((state) => ({
          quote: {
            ...state.quote,
            lineItems: state.quote.lineItems.filter((item) => item.id !== id),
          },
        })),

      setDiscount: (enabled, percentage, isFriendPrice) =>
        set((state) => ({
          quote: { ...state.quote, discount: { enabled, percentage, isFriendPrice } },
        })),

      setRitenutaAcconto: (enabled) =>
        set((state) => ({
          quote: {
            ...state.quote,
            taxConfig: { ...state.quote.taxConfig, ritenutaAcconto: enabled },
          },
        })),

      setClient: (data) =>
        set((state) => ({
          quote: { ...state.quote, client: { ...state.quote.client, ...data } },
        })),

      setNotes: (notes) =>
        set((state) => ({ quote: { ...state.quote, notes } })),

      setTerms: (terms) =>
        set((state) => ({ quote: { ...state.quote, termsAndConditions: terms } })),

      resetQuote: (prefix, num) =>
        set({ quote: createNewQuote(prefix, num), currentStep: 0 }),
    }),
    { name: 'previo-quote' }
  )
)

function rebuildItems(quote: Quote): Quote {
  const items: LineItem[] = []

  if (quote.service) {
    const serviceType = getServiceType(quote.service.categoryId, quote.service.typeId)
    if (serviceType) {
      // Base service
      items.push({
        id: `svc-${quote.service.typeId}`,
        description: `${serviceType.label} (base, ${serviceType.includedPages} pagine incluse)`,
        quantity: 1,
        unitPrice: serviceType.basePrice,
        category: 'service',
        isEditable: true,
      })

      // Extra pages
      const extraPages = Math.max(0, quote.pages - serviceType.includedPages)
      if (extraPages > 0 && serviceType.pricePerExtraPage > 0) {
        items.push({
          id: 'extra-pages',
          description: 'Pagine aggiuntive',
          quantity: extraPages,
          unitPrice: serviceType.pricePerExtraPage,
          category: 'config',
          isEditable: true,
        })
      }
    }
  }

  // Graphics
  if (!quote.clientProvidesGraphics) {
    items.push({
      id: 'graphics',
      description: 'Realizzazione materiale grafico',
      quantity: 1,
      unitPrice: DEFAULT_GRAPHICS_COST,
      category: 'config',
      isEditable: true,
    })
  }

  // Domain & hosting
  if (quote.includeDomainHosting) {
    items.push({
      id: 'domain-hosting',
      description: 'Dominio e hosting (annuale)',
      quantity: 1,
      unitPrice: DEFAULT_DOMAIN_HOSTING_COST,
      category: 'config',
      isEditable: true,
    })
  }

  // Custom params
  for (const param of quote.customParams) {
    if (param.enabled) {
      items.push({
        id: `param-${param.id}`,
        description: param.label,
        quantity: 1,
        unitPrice: param.price,
        category: 'config',
        isEditable: true,
      })
    }
  }

  // Addons
  for (const addonId of quote.addons) {
    const addon = ADDONS.find((a) => a.id === addonId)
    if (addon) {
      const existing = quote.lineItems.find((li) => li.id === `addon-${addonId}`)
      items.push({
        id: `addon-${addonId}`,
        description: addon.label,
        quantity: 1,
        unitPrice: existing?.unitPrice ?? addon.defaultPrice,
        category: 'addon',
        isEditable: true,
      })
    }
  }

  // Consulting
  if (quote.consultingHours > 0) {
    const existing = quote.lineItems.find((li) => li.id === 'consulting')
    items.push({
      id: 'consulting',
      description: 'Consulenza tecnica',
      quantity: quote.consultingHours,
      unitPrice: existing?.unitPrice ?? DEFAULT_CONSULTING_HOURLY_RATE,
      category: 'consulting',
      isEditable: true,
    })
  }

  // Keep custom line items
  const customItems = quote.lineItems.filter((li) => li.category === 'custom')
  items.push(...customItems)

  return { ...quote, lineItems: items }
}
