import { useQuoteStore } from '@/stores/quoteStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useQuoteCalculations } from '@/hooks/useQuoteCalculations'
import { formatCurrency, formatDate } from '@/utils/formatting'
import { getServiceType } from '@/data/services'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus } from 'lucide-react'
import { ExportButtons } from '@/components/export/ExportButtons'
import { useState } from 'react'

export function ReviewStep() {
  const quote = useQuoteStore((s) => s.quote)
  const updateLineItem = useQuoteStore((s) => s.updateLineItem)
  const addCustomLineItem = useQuoteStore((s) => s.addCustomLineItem)
  const removeLineItem = useQuoteStore((s) => s.removeLineItem)
  const setDiscount = useQuoteStore((s) => s.setDiscount)
  const setRitenutaAcconto = useQuoteStore((s) => s.setRitenutaAcconto)
  const setNotes = useQuoteStore((s) => s.setNotes)
  const setTerms = useQuoteStore((s) => s.setTerms)
  const settings = useSettingsStore((s) => s.settings)
  const calc = useQuoteCalculations()

  const [newItemDesc, setNewItemDesc] = useState('')
  const [newItemPrice, setNewItemPrice] = useState(0)

  const serviceType = quote.service
    ? getServiceType(quote.service.categoryId, quote.service.typeId)
    : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Riepilogo preventivo</h2>
        <p className="text-sm text-muted-foreground">
          {quote.quoteNumber} — {formatDate(quote.createdAt)} — Valido fino al {formatDate(quote.validUntil)}
        </p>
        {serviceType && (
          <div className="text-sm mt-1 flex items-center gap-2">
            <strong>{serviceType.label}</strong>
            <Badge variant="secondary">{quote.pages} pagine</Badge>
            {quote.timeline.type === 'urgente' && <Badge>Urgente</Badge>}
          </div>
        )}
      </div>

      {/* Line items table */}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Descrizione</th>
              <th className="text-right p-3 font-medium w-16">Qty</th>
              <th className="text-right p-3 font-medium w-28">Prezzo</th>
              <th className="text-right p-3 font-medium w-28">Totale</th>
              <th className="w-10 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {quote.lineItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.description}</td>
                <td className="p-3 text-right">
                  {item.isEditable ? (
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, { quantity: Number(e.target.value) })}
                      className="w-16 text-right h-8 text-xs"
                      min={1}
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td className="p-3 text-right">
                  {item.isEditable ? (
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, { unitPrice: Number(e.target.value) })}
                      className="w-28 text-right h-8 text-xs"
                      min={0}
                    />
                  ) : (
                    formatCurrency(item.unitPrice)
                  )}
                </td>
                <td className="p-3 text-right font-medium">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </td>
                <td className="p-3">
                  {item.category === 'custom' && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeLineItem(item.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add custom item */}
        <div className="border-t p-3 flex gap-2 items-end">
          <div className="flex-1">
            <Input
              placeholder="Nuova voce..."
              value={newItemDesc}
              onChange={(e) => setNewItemDesc(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <Input
            type="number"
            placeholder="Prezzo"
            value={newItemPrice || ''}
            onChange={(e) => setNewItemPrice(Number(e.target.value))}
            className="w-28 h-8 text-xs"
          />
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            disabled={!newItemDesc}
            onClick={() => {
              addCustomLineItem(newItemDesc, newItemPrice)
              setNewItemDesc('')
              setNewItemPrice(0)
            }}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Discount */}
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              checked={quote.discount.enabled}
              onCheckedChange={(checked) => setDiscount(checked, quote.discount.percentage, quote.discount.isFriendPrice)}
            />
            <Label>Sconto</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={quote.discount.isFriendPrice}
              onCheckedChange={(checked) => {
                const pct = checked ? settings.friendDiscountPercent : quote.discount.percentage
                setDiscount(true, pct, checked)
              }}
            />
            <Label className="text-xs">Prezzo Amico ({settings.friendDiscountPercent}%)</Label>
          </div>
        </div>
        {quote.discount.enabled && (
          <div className="flex items-center gap-4">
            <Slider
              value={[quote.discount.percentage]}
              onValueChange={([v]) => setDiscount(true, v, false)}
              max={50}
              step={1}
              className="flex-1"
              disabled={quote.discount.isFriendPrice}
            />
            <span className="text-sm font-medium w-12 text-right">{quote.discount.percentage}%</span>
          </div>
        )}
      </div>

      {/* Tax config */}
      <div className="rounded-lg border p-4 space-y-2">
        <div className="flex items-center gap-3">
          <Switch
            checked={quote.taxConfig.ritenutaAcconto}
            onCheckedChange={setRitenutaAcconto}
          />
          <Label>Ritenuta d'acconto 20%</Label>
          <span className="text-xs text-muted-foreground">(solo se il cliente e sostituto d'imposta)</span>
        </div>
      </div>

      {/* Totals */}
      <div className="rounded-lg border bg-card p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotale</span>
          <span>{formatCurrency(calc.subtotal)}</span>
        </div>
        {calc.discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Sconto ({quote.discount.percentage}%)</span>
            <span>-{formatCurrency(calc.discountAmount)}</span>
          </div>
        )}
        {calc.urgencySurcharge > 0 && (
          <div className="flex justify-between text-sm text-orange-600">
            <span>Maggiorazione urgenza (+{quote.timeline.surchargePercent}%)</span>
            <span>+{formatCurrency(calc.urgencySurcharge)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-sm font-medium">
          <span>Compenso lordo</span>
          <span>{formatCurrency(calc.compensoLordo)}</span>
        </div>
        {calc.ritenutaAcconto > 0 && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Ritenuta d'acconto (20%)</span>
            <span>-{formatCurrency(calc.ritenutaAcconto)}</span>
          </div>
        )}
        {calc.marcaDaBollo > 0 && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Marca da bollo</span>
            <span>+{formatCurrency(calc.marcaDaBollo)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-lg font-bold text-primary">
          <span>Netto a pagare</span>
          <span>{formatCurrency(calc.totaleDovuto)}</span>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label>Note</Label>
        <Textarea
          value={quote.notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Aggiungi note al preventivo..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Termini e condizioni</Label>
        <Textarea
          value={quote.termsAndConditions}
          onChange={(e) => setTerms(e.target.value)}
          rows={6}
          className="text-xs"
        />
      </div>

      {/* Export */}
      <ExportButtons />
    </div>
  )
}
