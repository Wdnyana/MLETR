'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeProviderProps {
  children: React.ReactNode
}

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

const storageKey = 'vite-ui-theme'

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as Theme) || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem(storageKey, theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme((prev) => (prev === newTheme ? prev : newTheme))
    },
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextProps {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
