import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import './globals.css'

const BranchSwitcher = dynamic(
  () => import('@/components/BranchSwitcher').then(mod => mod.BranchSwitcher),
  { ssr: false }
)

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
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <BranchSwitcher />
      </body>
    </html>
  )
}
