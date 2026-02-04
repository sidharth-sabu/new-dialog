import type { Metadata } from 'next'
import './globals.css'
import { BranchSwitcher } from '@/components/BranchSwitcher'

export const metadata: Metadata = {
  title: 'Dovetail - New Dialog',
  description: 'AI-powered action dialog for Dovetail',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <BranchSwitcher />
      </body>
    </html>
  )
}
