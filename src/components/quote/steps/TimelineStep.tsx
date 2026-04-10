import { useQuoteStore } from '@/stores/quoteStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/formatting'
import { cn } from '@/lib/utils'
import { Clock, Zap } from 'lucide-react'

export function TimelineStep() {
  const quote = useQuoteStore((s) => s.quote)
  const setTimeline = useQuoteStore((s) => s.setTimeline)
  const setConsultingHours = useQuoteStore((s) => s.setConsultingHours)
  const updateLineItem = useQuoteStore((s) => s.updateLineItem)
  const settings = useSettingsStore((s) => s.settings)

  const consultingItem = quote.lineItems.find((li) => li.id === 'consulting')
  const hourlyRate = consultingItem?.unitPrice ?? settings.consultingHourlyRate

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Tempistiche e consulenza</h2>
        <p className="text-sm text-muted-foreground">
          Scegli la modalità di consegna e le ore di consulenza previste
        </p>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card
          className={cn(
            'cursor-pointer transition-all hover:shadow-md',
            quote.timeline.type === 'standard' ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
          )}
          onClick={() => setTimeline('standard')}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Standard</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tempi regolari, nessuna maggiorazione
            </p>
            <Badge variant="secondary" className="mt-2">Nessun sovrapprezzo</Badge>
          </CardContent>
        </Card>

        <Card
          className={cn(
            'cursor-pointer transition-all hover:shadow-md',
            quote.timeline.type === 'urgente' ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
          )}
          onClick={() => setTimeline('urgente')}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-base">Urgente</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Consegna prioritaria con tempi ridotti
            </p>
            <Badge className="mt-2">+{settings.urgencySurchargePercent}% maggiorazione</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Consulting hours */}
      <div className="space-y-3 rounded-lg border p-4">
        <h3 className="text-sm font-medium">Ore di consulenza</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="hours">Numero ore</Label>
            <Input
              id="hours"
              type="number"
              min={0}
              value={quote.consultingHours}
              onChange={(e) => setConsultingHours(Math.max(0, Number(e.target.value)))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="rate">Tariffa oraria (EUR)</Label>
            <Input
              id="rate"
              type="number"
              min={0}
              value={hourlyRate}
              onChange={(e) => {
                if (consultingItem) {
                  updateLineItem(consultingItem.id, { unitPrice: Number(e.target.value) })
                }
              }}
            />
          </div>
        </div>
        {quote.consultingHours > 0 && (
          <p className="text-sm text-muted-foreground">
            Totale consulenza: <strong>{formatCurrency(quote.consultingHours * hourlyRate)}</strong>
          </p>
        )}
      </div>
    </div>
  )
}
