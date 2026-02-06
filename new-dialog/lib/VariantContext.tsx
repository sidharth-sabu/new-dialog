'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { VariantKey, VARIANTS } from './variants'

interface VariantContextValue {
  variant: VariantKey
  setVariant: (key: VariantKey) => void
}

const VariantContext = createContext<VariantContextValue>({
  variant: 'main',
  setVariant: () => {},
})

export function VariantProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariantState] = useState<VariantKey>('main')

  // Read variant from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (VARIANTS.some(v => v.key === hash)) {
      setVariantState(hash as VariantKey)
    }

    // Listen for hash changes (e.g. browser back/forward)
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '')
      if (VARIANTS.some(v => v.key === newHash)) {
        setVariantState(newHash as VariantKey)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const setVariant = useCallback((key: VariantKey) => {
    setVariantState(key)
    window.location.hash = key
  }, [])

  return (
    <VariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </VariantContext.Provider>
  )
}

export function useVariant() {
  return useContext(VariantContext)
}
