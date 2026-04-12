export interface Quote {
  id: string
  quoteNumber: string
  createdAt: string
  validUntil: string
  status: 'draft' | 'final'

  service: ServiceSelection | null

  // Phase-based configuration
  phases: QuotePhase[]
  extras: QuoteExtra[]
  customExtras: CustomExtra[]

  // Legacy fields kept for non-website services
  addons: string[]
  timeline: TimelineSelection
  consultingHours: number

  lineItems: LineItem[]

  discount: DiscountConfig
  taxConfig: TaxConfig

  client: ClientData
  notes: string
  termsAndConditions: string
}

export interface ServiceSelection {
  categoryId: string
  typeId: string
}

export interface QuotePhase {
  phaseId: string
  enabled: boolean
  price: number
  activities: QuoteActivity[]
}

export interface QuoteActivity {
  activityId: string
  enabled: boolean
}

export interface QuoteExtra {
  extraId: string
  enabled: boolean
  price: number
}

export interface CustomExtra {
  id: string
  label: string
  enabled: boolean
  price: number
}

export interface TimelineSelection {
  type: 'standard' | 'urgente'
  surchargePercent: number
}

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  category: 'phase' | 'extra' | 'addon' | 'consulting' | 'custom'
  phaseId?: string
  isEditable: boolean
}

export interface DiscountConfig {
  enabled: boolean
  percentage: number
  isFriendPrice: boolean
}

export interface TaxConfig {
  ritenutaAcconto: boolean
  ritenutaRate: number
}

export interface ClientData {
  type: 'persona' | 'azienda'
  name: string
  contactPerson: string
  address: string
  city: string
  province: string
  cap: string
  country: string
  partitaIva: string
  codiceFiscale: string
  codiceDestinatario: string
  pec: string
  email: string
  phone: string
}
