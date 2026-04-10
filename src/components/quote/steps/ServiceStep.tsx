import { SERVICE_CATEGORIES } from '@/data/services'
import { useQuoteStore } from '@/stores/quoteStore'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/formatting'
import { Globe, Plug, MessageSquare, Wrench } from 'lucide-react'

const ICONS: Record<string, React.ElementType> = {
  Globe, Plug, MessageSquare, Wrench,
}

export function ServiceStep() {
  const quote = useQuoteStore((s) => s.quote)
  const setService = useQuoteStore((s) => s.setService)

  const selectedCategory = quote.service?.categoryId || ''
  const selectedType = quote.service?.typeId || ''

  const category = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Tipo di servizio</h2>
        <p className="text-sm text-muted-foreground">Seleziona la categoria e il tipo di servizio da preventivare</p>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.icon] || Globe
          const isSelected = selectedCategory === cat.id

          return (
            <Card
              key={cat.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
              )}
              onClick={() => {
                const firstType = cat.types[0]
                setService(cat.id, firstType.id)
              }}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Service type radio group */}
      {category && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Seleziona il tipo specifico</h3>
          <RadioGroup
            value={selectedType}
            onValueChange={(typeId) => setService(selectedCategory, typeId)}
          >
            {category.types.map((type) => (
              <div key={type.id} className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value={type.id} id={type.id} className="mt-0.5" />
                <Label htmlFor={type.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{type.label}</span>
                    <Badge variant="secondary">da {formatCurrency(type.basePrice)}</Badge>
                  </div>
                  <span className="block text-xs text-muted-foreground mt-0.5">{type.description}</span>
                  <span className="block text-xs text-muted-foreground">{type.estimatedDays} giorni</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  )
}
