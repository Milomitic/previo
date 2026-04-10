import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings } from '@/types/settings'
import { DEFAULT_TERMS } from '@/data/terms'
import {
  DEFAULT_CONSULTING_HOURLY_RATE,
  DEFAULT_URGENCY_SURCHARGE_PERCENT,
  DEFAULT_FRIEND_DISCOUNT_PERCENT,
  RITENUTA_ACCONTO_RATE,
  DEFAULT_GRAPHICS_COST,
  DEFAULT_DOMAIN_HOSTING_COST,
} from '@/data/pricing'

const defaultSettings: AppSettings = {
  professional: {
    name: '',
    title: 'Ingegnere Informatico',
    address: '',
    city: '',
    province: '',
    cap: '',
    codiceFiscale: '',
    pec: '',
    email: '',
    phone: '',
    website: '',
    logo: '',
    iban: '',
  },
  defaultValidityDays: 30,
  quoteNumberPrefix: 'PRV',
  nextQuoteNumber: 1,
  defaultTerms: DEFAULT_TERMS,
  darkMode: 'system',
  friendDiscountPercent: DEFAULT_FRIEND_DISCOUNT_PERCENT,
  consultingHourlyRate: DEFAULT_CONSULTING_HOURLY_RATE,
  urgencySurchargePercent: DEFAULT_URGENCY_SURCHARGE_PERCENT,
  graphicsCost: DEFAULT_GRAPHICS_COST,
  domainHostingCost: DEFAULT_DOMAIN_HOSTING_COST,
  googleSearch: {
    apiKey: '',
    searchEngineId: '',
  },
}

interface SettingsStore {
  settings: AppSettings
  ritenutaRate: number
  updateSettings: (partial: Partial<AppSettings>) => void
  updateProfessional: (partial: Partial<AppSettings['professional']>) => void
  updateGoogleSearch: (partial: Partial<AppSettings['googleSearch']>) => void
  incrementQuoteNumber: () => number
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      ritenutaRate: RITENUTA_ACCONTO_RATE,

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      updateProfessional: (partial) =>
        set((state) => ({
          settings: {
            ...state.settings,
            professional: { ...state.settings.professional, ...partial },
          },
        })),

      updateGoogleSearch: (partial) =>
        set((state) => ({
          settings: {
            ...state.settings,
            googleSearch: { ...state.settings.googleSearch, ...partial },
          },
        })),

      incrementQuoteNumber: () => {
        const current = get().settings.nextQuoteNumber
        set((state) => ({
          settings: {
            ...state.settings,
            nextQuoteNumber: state.settings.nextQuoteNumber + 1,
          },
        }))
        return current
      },

      resetSettings: () => set({ settings: defaultSettings }),
    }),
    { name: 'previo-settings' }
  )
)
