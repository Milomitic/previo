import { useQuoteStore } from '@/stores/quoteStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { getServiceType } from '@/data/services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatting'
import { cn } from '@/lib/utils'
import { Search, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { searchMarketPrices } from '@/utils/googleSearch'
import type { ComplexityLevel } from '@/types/quote'

const LEVELS: { id: ComplexityLevel; label: string; features: string[] }[] = [
  {
    id: 'base',
    label: 'Base',
    features: ['Template standard', 'Funzionalità essenziali', 'Design responsivo', 'Contenuti base'],
  },
  {
    id: 'media',
    label: 'Media',
    features: ['Design personalizzato', 'Funzionalità avanzate', 'Ottimizzazione performance', 'Integrazioni base'],
  },
  {
    id: 'avanzata',
    label: 'Avanzata',
    features: ['Design su misura', 'Architettura custom', 'Funzionalità enterprise', 'Supporto prioritario'],
  },
]

export function ComplexityStep() {
  const quote = useQuoteStore((s) => s.quote)
  const setComplexity = useQuoteStore((s) => s.setComplexity)
  const googleSearch = useSettingsStore((s) => s.settings.googleSearch)
  const [searching, setSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const serviceType = quote.service
    ? getServiceType(quote.service.categoryId, quote.service.typeId)
    : null

  const handleSearch = async () => {
    if (!serviceType) return
    setSearching(true)
    setSuggestions([])
    try {
      const results = await searchMarketPrices(googleSearch, serviceType.label, quote.complexity || 'media')
      setSuggestions(
        results.map(
          (r) => `${formatCurrency(r.min)}${r.max !== r.min ? ` - ${formatCurrency(r.max)}` : ''} (${r.source})`
        )
      )
    } finally {
      setSearching(false)
    }
  }

  if (!serviceType) {
    return <p className="text-muted-foreground">Seleziona prima un servizio.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Livello di complessità</h2>
        <p className="text-sm text-muted-foreground">
          Scegli il livello per <strong>{serviceType.label}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LEVELS.map((level) => {
          const price = serviceType.basePrice[level.id]
          const days = serviceType.estimatedDays[level.id]
          const isSelected = quote.complexity === level.id

          return (
            <Card
              key={level.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
              )}
              onClick={() => setComplexity(level.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{level.label}</CardTitle>
                  {isSelected && <Badge>Selezionato</Badge>}
                </div>
                <p className="text-2xl font-bold text-primary">{formatCurrency(price)}</p>
                <p className="text-xs text-muted-foreground">{days} giorni</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {level.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="text-primary">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Google Search market prices */}
      {googleSearch.apiKey && (
        <div className="space-y-2">
          <Button variant="outline" size="sm" onClick={handleSearch} disabled={searching}>
            {searching ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
            Suggerisci prezzi di mercato
          </Button>
          {suggestions.length > 0 && (
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-xs font-medium mb-2">Prezzi trovati online:</p>
              {suggestions.map((s, i) => (
                <p key={i} className="text-xs text-muted-foreground">{s}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
