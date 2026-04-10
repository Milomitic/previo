import { useQuoteStore } from '@/stores/quoteStore'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ServiceStep } from './steps/ServiceStep'
import { ConfigStep } from './steps/ConfigStep'
import { AddonsStep } from './steps/AddonsStep'
import { TimelineStep } from './steps/TimelineStep'
import { ClientStep } from './steps/ClientStep'
import { ReviewStep } from './steps/ReviewStep'

const STEPS = [ServiceStep, ConfigStep, AddonsStep, TimelineStep, ClientStep, ReviewStep]
const STEP_LABELS = ['Servizio', 'Configurazione', 'Add-on', 'Tempistiche', 'Cliente', 'Riepilogo']
const TOTAL_STEPS = STEPS.length

export function QuoteStepper() {
  const currentStep = useQuoteStore((s) => s.currentStep)
  const setStep = useQuoteStore((s) => s.setStep)
  const quote = useQuoteStore((s) => s.quote)

  const StepComponent = STEPS[currentStep]

  const canGoNext = () => {
    if (currentStep === 0) return quote.service !== null
    return true
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          Step {currentStep + 1} di {TOTAL_STEPS}
        </span>
        <span>—</span>
        <span>{STEP_LABELS[currentStep]}</span>
      </div>

      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <div className="min-h-[400px]">
        <StepComponent />
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => setStep(currentStep - 1)}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Indietro
        </Button>

        {currentStep < TOTAL_STEPS - 1 && (
          <Button
            onClick={() => setStep(currentStep + 1)}
            disabled={!canGoNext()}
          >
            Avanti
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}
