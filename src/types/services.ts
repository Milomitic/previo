export interface ServiceCategory {
  id: string
  label: string
  description: string
  icon: string
  types: ServiceType[]
}

export interface ServiceType {
  id: string
  categoryId: string
  label: string
  description: string
  basePrice: number
  includedPages: number
  pricePerExtraPage: number
  estimatedDays: string
}

export interface Addon {
  id: string
  label: string
  description: string
  defaultPrice: number
  applicableTo: string[]
}
