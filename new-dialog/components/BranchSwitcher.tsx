'use client'

import { useState, useEffect, useRef } from 'react'

const BRANCHES = [
  { name: 'main', label: 'Main' },
  { name: 'empty_state_01', label: 'Empty State' },
]

export function BranchSwitcher() {
  const [currentBranch, setCurrentBranch] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCurrentBranch()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchCurrentBranch = async () => {
    try {
      const res = await fetch('/api/git/branch')
      const data = await res.json()
      if (data.branch) {
        setCurrentBranch(data.branch)
      }
    } catch (err) {
      console.error('Failed to fetch branch:', err)
    }
  }

  const switchBranch = async (branchName: string) => {
    if (branchName === currentBranch || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/git/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: branchName }),
      })

      const data = await res.json()

      if (data.success) {
        setCurrentBranch(branchName)
        setIsOpen(false)
        // Reload the page to reflect the new branch's code
        window.location.reload()
      } else {
        setError(data.error || 'Failed to switch branch')
      }
    } catch (err) {
      setError('Failed to switch branch')
      console.error('Error switching branch:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const currentLabel = BRANCHES.find(b => b.name === currentBranch)?.label || currentBranch

  return (
    <div 
      ref={dropdownRef}
      className="fixed bottom-4 right-4 z-50"
    >
      {error && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-red-500/90 text-white text-xs rounded-lg whitespace-nowrap">
          {error}
        </div>
      )}
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm text-white/80 hover:bg-[#252525] hover:border-[#444] transition-all shadow-lg backdrop-blur-sm"
        >
          <svg 
            className="w-4 h-4 text-white/60" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 9l4-4 4 4m0 6l-4 4-4-4" 
            />
          </svg>
          <span className="font-medium">{isLoading ? 'Switching...' : currentLabel}</span>
          <svg 
            className={`w-3 h-3 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl overflow-hidden">
            <div className="px-3 py-2 border-b border-[#333] text-xs text-white/40 uppercase tracking-wide">
              Switch Branch
            </div>
            {BRANCHES.map((branch) => (
              <button
                key={branch.name}
                onClick={() => switchBranch(branch.name)}
                disabled={isLoading}
                className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between ${
                  branch.name === currentBranch
                    ? 'bg-[#252525] text-white'
                    : 'text-white/70 hover:bg-[#222] hover:text-white'
                }`}
              >
                <span>{branch.label}</span>
                {branch.name === currentBranch && (
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
            <div className="px-3 py-2 border-t border-[#333] text-[10px] text-white/30">
              Page will reload after switching
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
