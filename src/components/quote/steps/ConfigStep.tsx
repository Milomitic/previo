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
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/formatting'
import { cn } from '@/lib/utils'
import {
  ChevronDown, ChevronRight, Plus, Trash2,
  Search, Clipboard, Palette, Code2, FileText,
  Gauge, Shield, TestTube, Rocket, Headphones,
} from 'lucide-react'

const PHASE_ICONS: Record<string, React.ElementType> = {
  analisi: Search,
  design: Palette,
  sviluppo: Code2,
  contenuti: FileText,
  ottimizzazioni: Gauge,
  compliance: Shield,
  testing: TestTube,
  pubblicazione: Rocket,
  supporto: Headphones,
}

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
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold mb-0.5">Configurazione attività</h2>
        <p className="text-xs text-muted-foreground">
          Seleziona le fasi e le attività da includere per <strong>{serviceType.label}</strong>
        </p>
      </div>

      {/* Phases tree */}
      <div className="space-y-1.5">
        {PHASES.map((phaseTemplate, idx) => {
          const phase = quote.phases.find((p) => p.phaseId === phaseTemplate.id)
          if (!phase) return null
          const isExpanded = expandedPhases.has(phaseTemplate.id)
          const enabledCount = phase.activities.filter((a) => a.enabled).length
          const totalCount = phaseTemplate.activities.length
          const allEnabled = enabledCount === totalCount
          const Icon = PHASE_ICONS[phaseTemplate.id] || Clipboard

          return (
            <div
              key={phaseTemplate.id}
              className={cn(
                'rounded-lg border overflow-hidden transition-all',
                phase.enabled ? 'border-primary/30' : 'opacity-60'
              )}
            >
              {/* Phase header */}
              <div className={cn(
                'flex items-center gap-2 px-3 py-2.5',
                phase.enabled ? 'bg-primary/5' : 'bg-card'
              )}>
                <Switch
                  checked={phase.enabled}
                  onCheckedChange={() => togglePhase(phaseTemplate.id)}
                  className="scale-90"
                />

                <button
                  className="flex-1 flex items-center gap-2 text-left min-w-0"
                  onClick={() => toggleExpand(phaseTemplate.id)}
                >
                  <div className={cn(
                    'flex h-5 w-5 items-center justify-center rounded text-[0.6rem] font-bold shrink-0',
                    phase.enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    {idx + 1}
                  </div>

                  <Icon className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    phase.enabled ? 'text-primary' : 'text-muted-foreground'
                  )} />

                  <span className="text-[0.8rem] font-medium truncate">{phaseTemplate.commercialLabel}</span>

                  <Badge
                    variant={allEnabled ? 'default' : 'secondary'}
                    className="text-[0.55rem] px-1.5 py-0 ml-auto shrink-0"
                  >
                    {enabledCount}/{totalCount}
                  </Badge>

                  {isExpanded
                    ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  }
                </button>

                {phase.enabled && (
                  <Input
                    type="number"
                    value={phase.price}
                    onChange={(e) => setPhasePrice(phaseTemplate.id, Number(e.target.value))}
                    className="w-20 text-right text-xs h-7"
                    min={0}
                    placeholder="€"
                  />
                )}
              </div>

              {/* Expanded activities */}
              {isExpanded && (
                <div className="border-t bg-card/50">
                  <p className="text-[0.65rem] text-muted-foreground px-3 py-2 border-b bg-muted/20 leading-relaxed">
                    {phaseTemplate.description}
                  </p>
                  <div>
                    {phaseTemplate.activities.map((actTemplate, actIdx) => {
                      const activity = phase.activities.find((a) => a.activityId === actTemplate.id)
                      if (!activity) return null
                      const isChecked = activity.enabled && phase.enabled
                      return (
                        <div
                          key={actTemplate.id}
                          className={cn(
                            'flex items-center gap-2 px-3 py-1.5 hover:bg-accent/30 transition-colors',
                            actIdx < phaseTemplate.activities.length - 1 && 'border-b border-border/50'
                          )}
                        >
                          <div className="w-5 flex justify-center">
                            <div className="w-px h-3 bg-border" />
                          </div>
                          <Checkbox
                            checked={isChecked}
                            disabled={!phase.enabled}
                            onCheckedChange={() => toggleActivity(phaseTemplate.id, actTemplate.id)}
                            className="h-3.5 w-3.5"
                          />
                          <span className={cn(
                            'text-[0.7rem] flex-1',
                            isChecked ? 'text-foreground' : 'text-muted-foreground line-through'
                          )}>
                            {actTemplate.label}
                          </span>
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
        <div className="flex justify-between items-center text-xs font-medium px-1 py-1 rounded bg-primary/5">
          <span>Totale fasi incluse</span>
          <span className="text-primary font-bold">{formatCurrency(phasesTotal)}</span>
        </div>
      )}

      <Separator />

      {/* Optional extras */}
      <div className="space-y-2">
        <div>
          <h3 className="text-sm font-medium">Extra opzionali</h3>
          <p className="text-[0.65rem] text-muted-foreground">Voci aggiuntive fuori dal prezzo base</p>
        </div>

        <div className="space-y-1">
          {OPTIONAL_EXTRAS.map((template) => {
            const extra = quote.extras.find((e) => e.extraId === template.id)
            if (!extra) return null
            return (
              <div
                key={template.id}
                className={cn(
                  'flex items-center gap-2.5 rounded-md border px-3 py-2 transition-colors',
                  extra.enabled ? 'border-primary/30 bg-primary/5' : ''
                )}
              >
                <Switch
                  checked={extra.enabled}
                  onCheckedChange={() => toggleExtra(template.id)}
                  className="scale-90"
                />
                <span className="flex-1 text-xs">{template.label}</span>
                {extra.enabled && (
                  <>
                    <Input
                      type="number"
                      value={extra.price}
                      onChange={(e) => setExtraPrice(template.id, Number(e.target.value))}
                      className="w-20 text-right text-xs h-7"
                      min={0}
                    />
                    <span className="text-[0.6rem] text-muted-foreground">€</span>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Custom extras */}
        {quote.customExtras.map((extra) => (
          <div
            key={extra.id}
            className={cn(
              'flex items-center gap-2.5 rounded-md border px-3 py-2',
              extra.enabled ? 'border-primary/30 bg-primary/5' : ''
            )}
          >
            <Switch
              checked={extra.enabled}
              onCheckedChange={() => toggleCustomExtra(extra.id)}
              className="scale-90"
            />
            <span className="flex-1 text-xs">{extra.label}</span>
            <Input
              type="number"
              value={extra.price}
              onChange={(e) => setCustomExtraPrice(extra.id, Number(e.target.value))}
              className="w-20 text-right text-xs h-7"
              min={0}
            />
            <span className="text-[0.6rem] text-muted-foreground">€</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeCustomExtra(extra.id)}>
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        ))}

        {/* Add custom extra */}
        <div className="flex items-end gap-1.5 pt-1">
          <div className="flex-1 space-y-0.5">
            <Label className="text-[0.6rem]">Nuovo extra</Label>
            <Input
              value={newExtraLabel}
              onChange={(e) => setNewExtraLabel(e.target.value)}
              placeholder="Es: Formazione uso CMS"
              className="text-xs h-7"
            />
          </div>
          <div className="w-20 space-y-0.5">
            <Label className="text-[0.6rem]">Prezzo €</Label>
            <Input
              type="number"
              value={newExtraPrice}
              onChange={(e) => setNewExtraPrice(Number(e.target.value))}
              className="text-xs h-7"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            disabled={!newExtraLabel.trim()}
            onClick={() => {
              addCustomExtra(newExtraLabel.trim(), newExtraPrice)
              setNewExtraLabel('')
              setNewExtraPrice(100)
            }}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
