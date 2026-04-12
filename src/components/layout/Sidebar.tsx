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
    <div className="flex h-full flex-col py-4 text-[clamp(0.72rem,1.1vw,0.82rem)]">
      <nav className="flex-1 space-y-1 px-2.5">
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
                'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : isDone
                    ? 'text-foreground hover:bg-accent'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-bold shrink-0',
                  isActive
                    ? 'bg-primary-foreground text-primary'
                    : isDone
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                )}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <Icon className="h-[1em] w-[1em] shrink-0" />
              <span>{step.label}</span>
            </button>
          )
        })}
      </nav>

      {calc.subtotal > 0 && (
        <div className="mx-2.5 rounded-md border bg-card p-2.5 mt-3">
          <p className="text-[0.6rem] text-muted-foreground mb-0.5 leading-none">Totale corrente</p>
          <p className="text-base font-bold text-primary leading-tight">{formatCurrency(calc.totaleDovuto)}</p>
          {calc.ritenutaAcconto > 0 && (
            <Badge variant="secondary" className="mt-1 text-[0.55rem] px-1.5 py-0">
              Ritenuta: {formatCurrency(calc.ritenutaAcconto)}
            </Badge>
          )}
        </div>
      )}

      <div className="px-2.5 pt-3 mt-2 border-t">
        <button
          onClick={onSettingsClick}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Settings className="h-[1em] w-[1em]" />
          Impostazioni
        </button>
      </div>
    </div>
  )
}
