import type { GoogleSearchConfig } from '@/types/settings'

interface PriceSuggestion {
  min: number
  max: number
  source: string
  snippet: string
}

export async function searchMarketPrices(
  config: GoogleSearchConfig,
  serviceLabel: string,
  complexity: string
): Promise<PriceSuggestion[]> {
  if (!config.apiKey || !config.searchEngineId) {
    return []
  }

  const query = `prezzo ${serviceLabel} ${complexity} freelance Italia ${new Date().getFullYear()}`
  const url = `https://www.googleapis.com/customsearch/v1?key=${config.apiKey}&cx=${config.searchEngineId}&q=${encodeURIComponent(query)}&num=5&lr=lang_it`

  try {
    const response = await fetch(url)
    if (!response.ok) return []

    const data = await response.json()
    const suggestions: PriceSuggestion[] = []

    for (const item of data.items || []) {
      const snippet: string = item.snippet || ''
      const prices = extractPricesFromText(snippet)
      if (prices.length > 0) {
        suggestions.push({
          min: Math.min(...prices),
          max: Math.max(...prices),
          source: item.displayLink || '',
          snippet: snippet.slice(0, 120),
        })
      }
    }

    return suggestions
  } catch {
    return []
  }
}

function extractPricesFromText(text: string): number[] {
  const prices: number[] = []
  // Match patterns like: 1.500€, 1500 euro, €1,500, 1.500,00 EUR
  const patterns = [
    /(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:€|euro|EUR)/gi,
    /(?:€|euro|EUR)\s*(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)/gi,
    /(\d{1,3}(?:[\.,]\d{3})*)\s*(?:€|euro|EUR)/gi,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const priceStr = match[1]
        .replace(/\./g, '')
        .replace(',', '.')
      const price = parseFloat(priceStr)
      if (price > 50 && price < 100000 && !prices.includes(price)) {
        prices.push(price)
      }
    }
  }

  return prices
}
