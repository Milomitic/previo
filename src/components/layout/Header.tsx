import { Moon, Sun, Monitor, Menu, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useQuoteStore } from '@/stores/quoteStore'
import { useSettingsStore } from '@/stores/settingsStore'

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { darkMode, toggle } = useDarkMode()
  const resetQuote = useQuoteStore((s) => s.resetQuote)
  const settings = useSettingsStore((s) => s.settings)
  const incrementQuoteNumber = useSettingsStore((s) => s.incrementQuoteNumber)

  const icon =
    darkMode === 'dark' ? <Moon className="h-[1em] w-[1em]" /> :
    darkMode === 'light' ? <Sun className="h-[1em] w-[1em]" /> :
    <Monitor className="h-[1em] w-[1em]" />

  return (
    <header className="sticky top-0 z-40 flex h-11 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 lg:px-4 text-[clamp(0.75rem,1.2vw,0.85rem)]">
      {onMenuToggle && (
        <Button variant="ghost" size="icon" className="lg:hidden h-7 w-7" onClick={onMenuToggle}>
          <Menu className="h-[1.1em] w-[1.1em]" />
        </Button>
      )}

      <div className="flex items-center gap-1.5">
        <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-[0.65rem]">P</span>
        </div>
        <h1 className="font-semibold tracking-tight leading-none">Previo</h1>
      </div>

      <div className="ml-auto flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[0.7rem]"
          onClick={() => {
            const num = incrementQuoteNumber()
            resetQuote(settings.quoteNumberPrefix, num)
          }}
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Nuovo</span>
        </Button>

        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggle} title={`Tema: ${darkMode}`}>
          {icon}
        </Button>
      </div>
    </header>
  )
}
