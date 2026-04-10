import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface AppShellProps {
  children: React.ReactNode
  onSettingsClick: () => void
}

export function AppShell({ children, onSettingsClick }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        {isDesktop && (
          <aside className="w-60 shrink-0 border-r bg-card/50">
            <Sidebar onSettingsClick={onSettingsClick} />
          </aside>
        )}

        {/* Mobile sidebar overlay */}
        {!isDesktop && sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed left-0 top-14 bottom-0 z-50 w-64 bg-background border-r shadow-lg">
              <Sidebar
                onSettingsClick={() => {
                  setSidebarOpen(false)
                  onSettingsClick()
                }}
                onClose={() => setSidebarOpen(false)}
              />
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-4xl p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
