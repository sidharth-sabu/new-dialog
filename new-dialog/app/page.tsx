'use client'

import { useState, useEffect } from 'react'
import { NewDialog } from '@/components/new-dialog/NewDialog'

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleActionClick = (actionId: string) => {
    console.log('Action clicked:', actionId)
  }

  // Don't render anything until client-side mount to prevent all hydration issues
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-[rgba(10,10,10,0.64)] flex items-center justify-center">
        {/* Empty placeholder matching the layout */}
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[rgba(10,10,10,0.64)] flex items-center justify-center">
      <NewDialog onActionClick={handleActionClick} />
    </main>
  )
}
