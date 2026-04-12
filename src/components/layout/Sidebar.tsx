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
    <div className="flex h-full flex-col py-3">
      <nav className="flex-1 space-y-0.5 px-2">
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
                'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : isDone
                    ? 'text-foreground hover:bg-accent'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0',
                  isActive
                    ? 'bg-primary-foreground text-primary'
                    : isDone
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                )}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="text-sm">{step.label}</span>
            </button>
          )
        })}
      </nav>

      {calc.subtotal > 0 && (
        <div className="mx-2 rounded-md border bg-card p-2.5 mt-2">
          <p className="text-[10px] text-muted-foreground mb-0.5">Totale corrente</p>
          <p className="text-lg font-bold text-primary leading-tight">{formatCurrency(calc.totaleDovuto)}</p>
          {calc.ritenutaAcconto > 0 && (
            <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0">
              Ritenuta: {formatCurrency(calc.ritenutaAcconto)}
            </Badge>
          )}
        </div>
      )}

      <div className="px-2 pt-2 mt-1 border-t">
        <button
          onClick={onSettingsClick}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Settings className="h-3.5 w-3.5" />
          Impostazioni
        </button>
      </div>
    </div>
  )
}
