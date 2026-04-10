import { useMemo } from 'react'
import { useQuoteStore } from '@/stores/quoteStore'
import { calculateQuote, type QuoteCalculation } from '@/utils/calculations'

export function useQuoteCalculations(): QuoteCalculation {
  const quote = useQuoteStore((s) => s.quote)
  return useMemo(() => calculateQuote(quote), [quote])
}
