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
    darkMode === 'dark' ? <Moon className="h-4 w-4" /> :
    darkMode === 'light' ? <Sun className="h-4 w-4" /> :
    <Monitor className="h-4 w-4" />

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      {onMenuToggle && (
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle}>
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">P</span>
        </div>
        <h1 className="text-lg font-semibold tracking-tight">Previo</h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const num = incrementQuoteNumber()
            resetQuote(settings.quoteNumberPrefix, num)
          }}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Nuovo</span>
        </Button>

        <Button variant="ghost" size="icon" onClick={toggle} title={`Tema: ${darkMode}`}>
          {icon}
        </Button>
      </div>
    </header>
  )
}
