import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import './globals.css'

const VariantClientWrapper = dynamic(
  () => import('@/components/VariantClientWrapper').then(mod => mod.VariantClientWrapper),
  { ssr: false, loading: () => null }
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
        <VariantClientWrapper>
          {children}
        </VariantClientWrapper>
      </body>
    </html>
  )
}
