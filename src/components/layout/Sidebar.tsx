import { cn } from '@/lib/utils'
import { useQuoteStore } from '@/stores/quoteStore'
import { useQuoteCalculations } from '@/hooks/useQuoteCalculations'
import { formatCurrency } from '@/utils/formatting'
import { Settings, Globe, SlidersHorizontal, Puzzle, Clock, User, FileCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const STEPS = [
  { label: 'Servizio', icon: Globe },
  { label: 'Configurazione', icon: SlidersHorizontal },
  { label: 'Add-on', icon: Puzzle },
  { label: 'Tempistiche', icon: Clock },
  { label: 'Cliente', icon: User },
  { label: 'Riepilogo', icon: FileCheck },
]

interface SidebarProps {
  onSettingsClick: () => void
  onClose?: () => void
}

export function Sidebar({ onSettingsClick, onClose }: SidebarProps) {
  const currentStep = useQuoteStore((s) => s.currentStep)
  const setStep = useQuoteStore((s) => s.setStep)
  const calc = useQuoteCalculations()

  return (
    <div className="flex h-full flex-col gap-2 py-4">
      <nav className="flex-1 space-y-1 px-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon
          const isActive = i === currentStep
          const isDone = i < currentStep

          return (
            <button
              key={i}
              onClick={() => {
                setStep(i)
                onClose?.()
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : isDone
                    ? 'text-foreground hover:bg-accent'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                  isActive
                    ? 'bg-primary-foreground text-primary'
                    : isDone
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                )}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <Icon className="h-4 w-4" />
              <span>{step.label}</span>
            </button>
          )
        })}
      </nav>

      {calc.subtotal > 0 && (
        <div className="mx-3 rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground mb-1">Totale corrente</p>
          <p className="text-xl font-bold text-primary">{formatCurrency(calc.totaleDovuto)}</p>
          {calc.ritenutaAcconto > 0 && (
            <Badge variant="secondary" className="mt-1 text-xs">
              Ritenuta: {formatCurrency(calc.ritenutaAcconto)}
            </Badge>
          )}
        </div>
      )}

      <div className="px-3 pt-2 border-t">
        <button
          onClick={onSettingsClick}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          Impostazioni
        </button>
      </div>
    </div>
  )
}
