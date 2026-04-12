import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Quote, LineItem, ClientData, QuotePhase, QuoteExtra, CustomExtra } from '@/types/quote'
import { getServiceType } from '@/data/services'
import { PHASES, OPTIONAL_EXTRAS } from '@/data/phases'
import { ADDONS } from '@/data/addons'
import { generateId } from '@/utils/idGenerator'
import { formatQuoteNumber } from '@/utils/formatting'
import { DEFAULT_TERMS } from '@/data/terms'
import {
  DEFAULT_CONSULTING_HOURLY_RATE,
  DEFAULT_URGENCY_SURCHARGE_PERCENT,
  RITENUTA_ACCONTO_RATE,
} from '@/data/pricing'

function createDefaultPhases(): QuotePhase[] {
  return PHASES.map((p) => ({
    phaseId: p.id,
    enabled: true,
    price: 0,
    activities: p.activities.map((a) => ({
      activityId: a.id,
      enabled: true,
    })),
  }))
}

function createDefaultExtras(): QuoteExtra[] {
  return OPTIONAL_EXTRAS.map((e) => ({
    extraId: e.id,
    enabled: false,
    price: e.defaultPrice,
  }))
}

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
    phases: createDefaultPhases(),
    extras: createDefaultExtras(),
    customExtras: [],
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

  // Phase management
  togglePhase: (phaseId: string) => void
  setPhasePrice: (phaseId: string, price: number) => void
  toggleActivity: (phaseId: string, activityId: string) => void

  // Extras
  toggleExtra: (extraId: string) => void
  setExtraPrice: (extraId: string, price: number) => void
  addCustomExtra: (label: string, price: number) => void
  toggleCustomExtra: (id: string) => void
  removeCustomExtra: (id: string) => void
  setCustomExtraPrice: (id: string, price: number) => void

  // Legacy
  toggleAddon: (addonId: string) => void
  setTimeline: (type: 'standard' | 'urgente') => void
  setConsultingHours: (hours: number) => void

  // Line items
  updateLineItem: (id: string, changes: Partial<LineItem>) => void
  addCustomLineItem: (description: string, unitPrice: number) => void
  removeLineItem: (id: string) => void

  // Financial
  setDiscount: (enabled: boolean, percentage: number, isFriendPrice: boolean) => void
  setRitenutaAcconto: (enabled: boolean) => void

  // Client & meta
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
          const quote = { ...state.quote, service: { categoryId, typeId } }
          return { quote: rebuildItems(quote) }
        }),

      togglePhase: (phaseId) =>
        set((state) => {
          const phases = state.quote.phases.map((p) =>
            p.phaseId === phaseId ? { ...p, enabled: !p.enabled } : p
          )
          return { quote: rebuildItems({ ...state.quote, phases }) }
        }),

      setPhasePrice: (phaseId, price) =>
        set((state) => {
          const phases = state.quote.phases.map((p) =>
            p.phaseId === phaseId ? { ...p, price } : p
          )
          return { quote: rebuildItems({ ...state.quote, phases }) }
        }),

      toggleActivity: (phaseId, activityId) =>
        set((state) => {
          const phases = state.quote.phases.map((p) => {
            if (p.phaseId !== phaseId) return p
            return {
              ...p,
              activities: p.activities.map((a) =>
                a.activityId === activityId ? { ...a, enabled: !a.enabled } : a
              ),
            }
          })
          return { quote: rebuildItems({ ...state.quote, phases }) }
        }),

      toggleExtra: (extraId) =>
        set((state) => {
          const extras = state.quote.extras.map((e) =>
            e.extraId === extraId ? { ...e, enabled: !e.enabled } : e
          )
          return { quote: rebuildItems({ ...state.quote, extras }) }
        }),

      setExtraPrice: (extraId, price) =>
        set((state) => {
          const extras = state.quote.extras.map((e) =>
            e.extraId === extraId ? { ...e, price } : e
          )
          return { quote: rebuildItems({ ...state.quote, extras }) }
        }),

      addCustomExtra: (label, price) =>
        set((state) => {
          const extra: CustomExtra = { id: generateId(), label, enabled: true, price }
          const quote = { ...state.quote, customExtras: [...state.quote.customExtras, extra] }
          return { quote: rebuildItems(quote) }
        }),

      toggleCustomExtra: (id) =>
        set((state) => {
          const customExtras = state.quote.customExtras.map((e) =>
            e.id === id ? { ...e, enabled: !e.enabled } : e
          )
          return { quote: rebuildItems({ ...state.quote, customExtras }) }
        }),

      removeCustomExtra: (id) =>
        set((state) => {
          const customExtras = state.quote.customExtras.filter((e) => e.id !== id)
          return { quote: rebuildItems({ ...state.quote, customExtras }) }
        }),

      setCustomExtraPrice: (id, price) =>
        set((state) => {
          const customExtras = state.quote.customExtras.map((e) =>
            e.id === id ? { ...e, price } : e
          )
          return { quote: rebuildItems({ ...state.quote, customExtras }) }
        }),

      toggleAddon: (addonId) =>
        set((state) => {
          const addons = state.quote.addons.includes(addonId)
            ? state.quote.addons.filter((id) => id !== addonId)
            : [...state.quote.addons, addonId]
          return { quote: rebuildItems({ ...state.quote, addons }) }
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
              { id: generateId(), description, quantity: 1, unitPrice, category: 'custom' as const, isEditable: true },
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

      setNotes: (notes) => set((state) => ({ quote: { ...state.quote, notes } })),
      setTerms: (terms) => set((state) => ({ quote: { ...state.quote, termsAndConditions: terms } })),
      resetQuote: (prefix, num) => set({ quote: createNewQuote(prefix, num), currentStep: 0 }),
    }),
    { name: 'previo-quote' }
  )
)

function rebuildItems(quote: Quote): Quote {
  const items: LineItem[] = []

  // Phases — each enabled phase becomes a line item with its activities listed
  for (const phase of quote.phases) {
    if (!phase.enabled) continue
    const phaseTemplate = PHASES.find((p) => p.id === phase.phaseId)
    if (!phaseTemplate) continue

    const enabledActivities = phase.activities
      .filter((a) => a.enabled)
      .map((a) => phaseTemplate.activities.find((at) => at.id === a.activityId)?.label)
      .filter(Boolean)

    if (enabledActivities.length === 0) continue

    items.push({
      id: `phase-${phase.phaseId}`,
      description: phaseTemplate.commercialLabel,
      quantity: 1,
      unitPrice: phase.price,
      category: 'phase',
      phaseId: phase.phaseId,
      isEditable: true,
    })
  }

  // Extras
  for (const extra of quote.extras) {
    if (!extra.enabled) continue
    const template = OPTIONAL_EXTRAS.find((e) => e.id === extra.extraId)
    if (!template) continue
    items.push({
      id: `extra-${extra.extraId}`,
      description: template.label,
      quantity: 1,
      unitPrice: extra.price,
      category: 'extra',
      isEditable: true,
    })
  }

  // Custom extras
  for (const extra of quote.customExtras) {
    if (!extra.enabled) continue
    items.push({
      id: `cextra-${extra.id}`,
      description: extra.label,
      quantity: 1,
      unitPrice: extra.price,
      category: 'extra',
      isEditable: true,
    })
  }

  // Legacy addons
  for (const addonId of quote.addons) {
    const addon = ADDONS.find((a) => a.id === addonId)
    if (!addon) continue
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

  // Custom line items
  const customItems = quote.lineItems.filter((li) => li.category === 'custom')
  items.push(...customItems)

  return { ...quote, lineItems: items }
}
