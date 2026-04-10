import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { QuoteStepper } from '@/components/quote/QuoteStepper'
import { SettingsDialog } from '@/components/settings/SettingsDialog'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useDarkMode } from '@/hooks/useDarkMode'

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  useDarkMode()

  return (
    <TooltipProvider>
      <AppShell onSettingsClick={() => setSettingsOpen(true)}>
        <QuoteStepper />
      </AppShell>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </TooltipProvider>
  )
}

export default App
