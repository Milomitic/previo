import { useState } from 'react'
import { useQuoteStore } from '@/stores/quoteStore'
import { PHASES, OPTIONAL_EXTRAS } from '@/data/phases'
import { getServiceType } from '@/data/services'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/utils/formatting'
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'

export function ConfigStep() {
  const quote = useQuoteStore((s) => s.quote)
  const togglePhase = useQuoteStore((s) => s.togglePhase)
  const setPhasePrice = useQuoteStore((s) => s.setPhasePrice)
  const toggleActivity = useQuoteStore((s) => s.toggleActivity)
  const toggleExtra = useQuoteStore((s) => s.toggleExtra)
  const setExtraPrice = useQuoteStore((s) => s.setExtraPrice)
  const addCustomExtra = useQuoteStore((s) => s.addCustomExtra)
  const toggleCustomExtra = useQuoteStore((s) => s.toggleCustomExtra)
  const removeCustomExtra = useQuoteStore((s) => s.removeCustomExtra)
  const setCustomExtraPrice = useQuoteStore((s) => s.setCustomExtraPrice)

  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set())
  const [newExtraLabel, setNewExtraLabel] = useState('')
  const [newExtraPrice, setNewExtraPrice] = useState(100)

  const serviceType = quote.service
    ? getServiceType(quote.service.categoryId, quote.service.typeId)
    : null

  if (!serviceType) {
    return <p className="text-muted-foreground">Seleziona prima un servizio.</p>
  }

  const toggleExpand = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev)
      if (next.has(phaseId)) next.delete(phaseId)
      else next.add(phaseId)
      return next
    })
  }

  const phasesTotal = quote.phases
    .filter((p) => p.enabled)
    .reduce((sum, p) => sum + p.price, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Configurazione attività</h2>
        <p className="text-sm text-muted-foreground">
          Seleziona le fasi e le attività da includere nel preventivo per <strong>{serviceType.label}</strong>
        </p>
      </div>

      {/* Phases */}
      <div className="space-y-2">
        {PHASES.map((phaseTemplate) => {
          const phase = quote.phases.find((p) => p.phaseId === phaseTemplate.id)
          if (!phase) return null
          const isExpanded = expandedPhases.has(phaseTemplate.id)
          const enabledCount = phase.activities.filter((a) => a.enabled).length
          const totalCount = phaseTemplate.activities.length

          return (
            <div key={phaseTemplate.id} className="rounded-lg border overflow-hidden">
              {/* Phase header */}
              <div className="flex items-center gap-3 p-3 bg-card">
                <Switch
                  checked={phase.enabled}
                  onCheckedChange={() => togglePhase(phaseTemplate.id)}
                />
                <button
                  className="flex-1 flex items-center gap-2 text-left"
                  onClick={() => toggleExpand(phaseTemplate.id)}
                >
                  {isExpanded
                    ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{phaseTemplate.commercialLabel}</p>
                    <p className="text-xs text-muted-foreground">{enabledCount}/{totalCount} attività</p>
                  </div>
                </button>
                {phase.enabled && (
                  <Input
                    type="number"
                    value={phase.price}
                    onChange={(e) => setPhasePrice(phaseTemplate.id, Number(e.target.value))}
                    className="w-24 text-right text-sm"
                    min={0}
                    placeholder="Prezzo"
                  />
                )}
              </div>

              {/* Phase description */}
              {isExpanded && (
                <div className="border-t">
                  <p className="text-xs text-muted-foreground p-3 bg-muted/30">
                    {phaseTemplate.description}
                  </p>
                  {/* Activities */}
                  <div className="divide-y">
                    {phaseTemplate.activities.map((actTemplate) => {
                      const activity = phase.activities.find((a) => a.activityId === actTemplate.id)
                      if (!activity) return null
                      return (
                        <div key={actTemplate.id} className="flex items-center gap-3 px-3 py-2 hover:bg-accent/30 transition-colors">
                          <Checkbox
                            checked={activity.enabled && phase.enabled}
                            disabled={!phase.enabled}
                            onCheckedChange={() => toggleActivity(phaseTemplate.id, actTemplate.id)}
                          />
                          <span className="text-xs flex-1">{actTemplate.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Phases total */}
      {phasesTotal > 0 && (
        <div className="flex justify-between items-center text-sm font-medium px-1">
          <span>Totale fasi incluse</span>
          <span className="text-primary">{formatCurrency(phasesTotal)}</span>
        </div>
      )}

      <Separator />

      {/* Optional extras */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium">Extra opzionali</h3>
          <p className="text-xs text-muted-foreground">Voci aggiuntive fuori dal prezzo base</p>
        </div>

        {OPTIONAL_EXTRAS.map((template) => {
          const extra = quote.extras.find((e) => e.extraId === template.id)
          if (!extra) return null
          return (
            <div key={template.id} className="flex items-center gap-3 rounded-lg border p-3">
              <Switch
                checked={extra.enabled}
                onCheckedChange={() => toggleExtra(template.id)}
              />
              <span className="flex-1 text-sm">{template.label}</span>
              {extra.enabled && (
                <>
                  <Input
                    type="number"
                    value={extra.price}
                    onChange={(e) => setExtraPrice(template.id, Number(e.target.value))}
                    className="w-24 text-right text-sm"
                    min={0}
                  />
                  <span className="text-xs text-muted-foreground">EUR</span>
                </>
              )}
            </div>
          )
        })}

        {/* Custom extras */}
        {quote.customExtras.map((extra) => (
          <div key={extra.id} className="flex items-center gap-3 rounded-lg border p-3">
            <Switch
              checked={extra.enabled}
              onCheckedChange={() => toggleCustomExtra(extra.id)}
            />
            <span className="flex-1 text-sm">{extra.label}</span>
            <Input
              type="number"
              value={extra.price}
              onChange={(e) => setCustomExtraPrice(extra.id, Number(e.target.value))}
              className="w-24 text-right text-sm"
              min={0}
            />
            <span className="text-xs text-muted-foreground">EUR</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeCustomExtra(extra.id)}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        ))}

        {/* Add custom extra */}
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Nuovo extra</Label>
            <Input
              value={newExtraLabel}
              onChange={(e) => setNewExtraLabel(e.target.value)}
              placeholder="Es: Formazione uso CMS"
              className="text-sm"
            />
          </div>
          <div className="w-28 space-y-1">
            <Label className="text-xs">Prezzo (EUR)</Label>
            <Input
              type="number"
              value={newExtraPrice}
              onChange={(e) => setNewExtraPrice(Number(e.target.value))}
              className="text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={!newExtraLabel.trim()}
            onClick={() => {
              addCustomExtra(newExtraLabel.trim(), newExtraPrice)
              setNewExtraLabel('')
              setNewExtraPrice(100)
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
