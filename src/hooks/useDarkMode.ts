import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'

export function useDarkMode() {
  const darkMode = useSettingsStore((s) => s.settings.darkMode)
  const updateSettings = useSettingsStore((s) => s.updateSettings)

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function apply() {
      if (darkMode === 'dark' || (darkMode === 'system' && mediaQuery.matches)) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    apply()
    mediaQuery.addEventListener('change', apply)
    return () => mediaQuery.removeEventListener('change', apply)
  }, [darkMode])

  function toggle() {
    const next = darkMode === 'light' ? 'dark' : darkMode === 'dark' ? 'system' : 'light'
    updateSettings({ darkMode: next })
  }

  return { darkMode, toggle }
}
