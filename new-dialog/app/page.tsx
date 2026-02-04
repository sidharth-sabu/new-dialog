'use client'

import { NewDialog } from '@/components/new-dialog/NewDialog'

export default function Home() {
  const handleActionClick = (actionId: string) => {
    console.log('Action clicked:', actionId)
  }

  return (
    <main className="min-h-screen bg-[rgba(10,10,10,0.64)] flex items-center justify-center">
      <NewDialog onActionClick={handleActionClick} />
    </main>
  )
}
