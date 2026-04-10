import type { Quote } from '@/types/quote'
import { MARCA_DA_BOLLO_THRESHOLD, MARCA_DA_BOLLO_AMOUNT } from '@/data/pricing'

export interface QuoteCalculation {
  subtotal: number
  discountAmount: number
  afterDiscount: number
  urgencySurcharge: number
  compensoLordo: number
  ritenutaAcconto: number
  nettoAPagare: number
  marcaDaBollo: number
  totaleDovuto: number
}

export function calculateQuote(quote: Quote): QuoteCalculation {
  const subtotal = quote.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )

  const discountPercent = quote.discount.enabled ? quote.discount.percentage : 0
  const discountAmount = subtotal * (discountPercent / 100)
  const afterDiscount = subtotal - discountAmount

  const urgencySurcharge =
    quote.timeline.type === 'urgente'
      ? afterDiscount * (quote.timeline.surchargePercent / 100)
      : 0

  const compensoLordo = afterDiscount + urgencySurcharge

  const ritenutaAcconto = quote.taxConfig.ritenutaAcconto
    ? compensoLordo * (quote.taxConfig.ritenutaRate / 100)
    : 0

  const nettoAPagare = compensoLordo - ritenutaAcconto

  const marcaDaBollo = compensoLordo > MARCA_DA_BOLLO_THRESHOLD ? MARCA_DA_BOLLO_AMOUNT : 0

  const totaleDovuto = nettoAPagare + marcaDaBollo

  return {
    subtotal,
    discountAmount,
    afterDiscount,
    urgencySurcharge,
    compensoLordo,
    ritenutaAcconto,
    nettoAPagare,
    marcaDaBollo,
    totaleDovuto,
  }
}
