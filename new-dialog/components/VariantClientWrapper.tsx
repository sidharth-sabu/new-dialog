'use client'

import React from 'react'
import { VariantProvider } from '@/lib/VariantContext'
import { VariantSwitcher } from './VariantSwitcher'

export function VariantClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <VariantProvider>
      {children}
      <VariantSwitcher />
    </VariantProvider>
  )
}
