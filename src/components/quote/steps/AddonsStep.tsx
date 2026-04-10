import { useQuoteStore } from '@/stores/quoteStore'
import { getAddonsForCategory } from '@/data/addons'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/utils/formatting'

export function AddonsStep() {
  const quote = useQuoteStore((s) => s.quote)
  const toggleAddon = useQuoteStore((s) => s.toggleAddon)
  const updateLineItem = useQuoteStore((s) => s.updateLineItem)

  const categoryId = quote.service?.categoryId || ''
  const addons = getAddonsForCategory(categoryId)

  if (!categoryId) {
    return <p className="text-muted-foreground">Seleziona prima un servizio.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Funzionalità aggiuntive</h2>
        <p className="text-sm text-muted-foreground">
          Seleziona gli add-on da includere nel preventivo
        </p>
      </div>

      {addons.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nessun add-on disponibile per questa categoria.</p>
      ) : (
        <div className="space-y-2">
          {addons.map((addon) => {
            const isChecked = quote.addons.includes(addon.id)
            const lineItem = quote.lineItems.find((li) => li.id === `addon-${addon.id}`)

            return (
              <div
                key={addon.id}
                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={addon.id}
                  checked={isChecked}
                  onCheckedChange={() => toggleAddon(addon.id)}
                />
                <label htmlFor={addon.id} className="flex-1 cursor-pointer">
                  <span className="text-sm font-medium">{addon.label}</span>
                  <span className="block text-xs text-muted-foreground">{addon.description}</span>
                </label>
                <div className="flex items-center gap-1 shrink-0">
                  {isChecked && lineItem ? (
                    <Input
                      type="number"
                      value={lineItem.unitPrice}
                      onChange={(e) =>
                        updateLineItem(lineItem.id, { unitPrice: Number(e.target.value) })
                      }
                      className="w-24 text-right text-sm"
                      min={0}
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground w-24 text-right">
                      {formatCurrency(addon.defaultPrice)}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">EUR</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
