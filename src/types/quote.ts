export interface Quote {
  id: string
  quoteNumber: string
  createdAt: string
  validUntil: string
  status: 'draft' | 'final'

  service: ServiceSelection | null
  pages: number
  clientProvidesGraphics: boolean
  includeDomainHosting: boolean
  customParams: CustomParam[]
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

export interface CustomParam {
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
  category: 'service' | 'addon' | 'consulting' | 'config' | 'custom'
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
