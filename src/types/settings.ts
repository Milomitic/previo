export interface ProfessionalData {
  name: string
  title: string
  address: string
  city: string
  province: string
  cap: string
  codiceFiscale: string
  pec: string
  email: string
  phone: string
  website: string
  logo: string
  iban: string
}

export interface GoogleSearchConfig {
  apiKey: string
  searchEngineId: string
}

export interface AppSettings {
  professional: ProfessionalData
  defaultValidityDays: number
  quoteNumberPrefix: string
  nextQuoteNumber: number
  defaultTerms: string
  darkMode: 'light' | 'dark' | 'system'
  friendDiscountPercent: number
  consultingHourlyRate: number
  urgencySurchargePercent: number
  graphicsCost: number
  domainHostingCost: number
  googleSearch: GoogleSearchConfig
}
