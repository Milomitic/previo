import { useState } from 'react'
import { useQuoteStore } from '@/stores/quoteStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { getServiceType } from '@/data/services'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/utils/formatting'
import { Plus, Trash2, Search, Loader2 } from 'lucide-react'
import { searchMarketPrices } from '@/utils/googleSearch'

export function ConfigStep() {
  const quote = useQuoteStore((s) => s.quote)
  const setPages = useQuoteStore((s) => s.setPages)
  const setGraphics = useQuoteStore((s) => s.setGraphics)
  const setDomainHosting = useQuoteStore((s) => s.setDomainHosting)
  const addCustomParam = useQuoteStore((s) => s.addCustomParam)
  const toggleCustomParam = useQuoteStore((s) => s.toggleCustomParam)
  const removeCustomParam = useQuoteStore((s) => s.removeCustomParam)
  const updateCustomParamPrice = useQuoteStore((s) => s.updateCustomParamPrice)
  const settings = useSettingsStore((s) => s.settings)
  const googleSearch = settings.googleSearch

  const [newParamLabel, setNewParamLabel] = useState('')
  const [newParamPrice, setNewParamPrice] = useState(100)
  const [searching, setSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const serviceType = quote.service
    ? getServiceType(quote.service.categoryId, quote.service.typeId)
    : null

  if (!serviceType) {
    return <p className="text-muted-foreground">Seleziona prima un servizio.</p>
  }

  const extraPages = Math.max(0, quote.pages - serviceType.includedPages)
  const extraPagesCost = extraPages * serviceType.pricePerExtraPage

  const handleSearch = async () => {
    if (!serviceType) return
    setSearching(true)
    setSuggestions([])
    try {
      const results = await searchMarketPrices(googleSearch, serviceType.label, 'base')
      setSuggestions(
        results.map(
          (r) => `${formatCurrency(r.min)}${r.max !== r.min ? ` - ${formatCurrency(r.max)}` : ''} (${r.source})`
        )
      )
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Configurazione</h2>
        <p className="text-sm text-muted-foreground">
          Personalizza i parametri per <strong>{serviceType.label}</strong>
        </p>
      </div>

      {/* Base price info */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Prezzo base</p>
            <p className="text-xs text-muted-foreground">
              Include {serviceType.includedPages} pagine
            </p>
          </div>
          <p className="text-2xl font-bold text-primary">{formatCurrency(serviceType.basePrice)}</p>
        </div>
      </div>

      {/* Number of pages */}
      {serviceType.pricePerExtraPage > 0 && (
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <Label className="text-sm font-medium">Numero di pagine</Label>
              <p className="text-xs text-muted-foreground">
                {serviceType.includedPages} incluse, poi {formatCurrency(serviceType.pricePerExtraPage)}/pagina
              </p>
            </div>
            <Input
              type="number"
              value={quote.pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="w-20 text-center"
              min={1}
              max={50}
            />
          </div>
          <Slider
            value={[quote.pages]}
            onValueChange={([v]) => setPages(v)}
            min={1}
            max={30}
            step={1}
          />
          {extraPages > 0 && (
            <p className="text-sm text-muted-foreground">
              {extraPages} pagine extra: <strong className="text-foreground">{formatCurrency(extraPagesCost)}</strong>
            </p>
          )}
        </div>
      )}

      {/* Graphics */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Il cliente fornisce il materiale grafico?</Label>
            <p className="text-xs text-muted-foreground">
              Foto, loghi, testi e contenuti. Se no, +{formatCurrency(settings.graphicsCost)}
            </p>
          </div>
          <Switch
            checked={quote.clientProvidesGraphics}
            onCheckedChange={setGraphics}
          />
        </div>
        {!quote.clientProvidesGraphics && (
          <p className="text-sm text-primary font-medium mt-2">
            + {formatCurrency(settings.graphicsCost)} per realizzazione materiale grafico
          </p>
        )}
      </div>

      {/* Domain & hosting */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Includi dominio e hosting?</Label>
            <p className="text-xs text-muted-foreground">
              Registrazione dominio, hosting e SSL — {formatCurrency(settings.domainHostingCost)}/anno
            </p>
          </div>
          <Switch
            checked={quote.includeDomainHosting}
            onCheckedChange={setDomainHosting}
          />
        </div>
        {quote.includeDomainHosting && (
          <p className="text-sm text-primary font-medium mt-2">
            + {formatCurrency(settings.domainHostingCost)}/anno
          </p>
        )}
      </div>

      <Separator />

      {/* Custom parameters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Parametri aggiuntivi</h3>
            <p className="text-xs text-muted-foreground">Aggiungi voci personalizzate al preventivo</p>
          </div>
        </div>

        {quote.customParams.map((param) => (
          <div key={param.id} className="flex items-center gap-3 rounded-lg border p-3">
            <Switch
              checked={param.enabled}
              onCheckedChange={() => toggleCustomParam(param.id)}
            />
            <span className="flex-1 text-sm">{param.label}</span>
            <Input
              type="number"
              value={param.price}
              onChange={(e) => updateCustomParamPrice(param.id, Number(e.target.value))}
              className="w-24 text-right text-sm"
              min={0}
            />
            <span className="text-xs text-muted-foreground">EUR</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => removeCustomParam(param.id)}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        ))}

        {/* Add new param */}
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Nome parametro</Label>
            <Input
              value={newParamLabel}
              onChange={(e) => setNewParamLabel(e.target.value)}
              placeholder="Es: Ottimizzazione mobile"
              className="text-sm"
            />
          </div>
          <div className="w-28 space-y-1">
            <Label className="text-xs">Prezzo (EUR)</Label>
            <Input
              type="number"
              value={newParamPrice}
              onChange={(e) => setNewParamPrice(Number(e.target.value))}
              className="text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={!newParamLabel.trim()}
            onClick={() => {
              addCustomParam(newParamLabel.trim(), newParamPrice)
              setNewParamLabel('')
              setNewParamPrice(100)
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Google Search market prices */}
      {googleSearch.apiKey && (
        <div className="space-y-2 pt-2">
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
