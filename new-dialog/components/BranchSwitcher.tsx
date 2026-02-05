'use client'

import { useState, useEffect, useRef } from 'react'

const BRANCHES = [
  { name: 'main', label: 'Main' },
  { name: 'empty_state_01', label: 'Empty State 01' },
  { name: 'empty_state_02', label: 'Empty State 02' },
]

// Git branch icon matching the design style
const BranchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M5 2.5V9.5M5 9.5C3.61929 9.5 2.5 10.6193 2.5 12C2.5 13.3807 3.61929 14.5 5 14.5C6.38071 14.5 7.5 13.3807 7.5 12C7.5 10.6193 6.38071 9.5 5 9.5ZM5 2.5C5 3.88071 3.88071 5 2.5 5M5 2.5C5 3.88071 6.11929 5 7.5 5M11 6.5V2.5M11 6.5C9.61929 6.5 8.5 7.61929 8.5 9C8.5 10.3807 9.61929 11.5 11 11.5C12.3807 11.5 13.5 10.3807 13.5 9C13.5 7.61929 12.3807 6.5 11 6.5ZM11 2.5C11 3.88071 9.88071 5 8.5 5M11 2.5C11 3.88071 12.1193 5 13.5 5" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

const ChevronIcon = ({ className }: { className?: string }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className}>
    <path 
      d="M3 4.5L6 7.5L9 4.5" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path 
      d="M3.5 8.5L6.5 11.5L12.5 4.5" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

export function BranchSwitcher() {
  const [currentBranch, setCurrentBranch] = useState<string>('main')
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
        // Only update if the branch is in our predefined list
        const isKnownBranch = BRANCHES.some(b => b.name === data.branch)
        if (isKnownBranch) {
          setCurrentBranch(data.branch)
        }
        // Otherwise keep default 'main'
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
        <div 
          className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[#fafafa] text-[#0a0a0a] text-[13px] rounded-lg whitespace-nowrap"
          style={{
            border: '1px solid rgba(10, 10, 10, 0.16)',
            boxShadow: '0px 8px 16px -4px rgba(10, 10, 10, 0.16)',
          }}
        >
          {error}
        </div>
      )}
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-[#fafafa] rounded-lg text-[14px] font-medium text-[#0a0a0a] hover:bg-[#ebebeb] transition-colors duration-150"
          style={{
            border: '1px solid rgba(10, 10, 10, 0.16)',
            boxShadow: '0px 8px 16px -4px rgba(10, 10, 10, 0.24)',
          }}
        >
          <span>{isLoading ? 'Switching...' : currentLabel}</span>
          <span className="text-[#898989]">
            <ChevronIcon className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
          </span>
        </button>

        {isOpen && (
          <div 
            className="absolute bottom-full right-0 mb-2 w-52 bg-[#fafafa] rounded-lg overflow-hidden"
            style={{
              border: '1px solid rgba(10, 10, 10, 0.16)',
              boxShadow: '0px 16px 32px -8px rgba(10, 10, 10, 0.32)',
            }}
          >
            <div 
              className="px-4 py-2 text-[12px] font-medium text-[#898989] uppercase tracking-wider"
              style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.08)' }}
            >
              Switch Branch
            </div>
            <div className="py-1">
              {BRANCHES.map((branch) => (
                <button
                  key={branch.name}
                  onClick={() => switchBranch(branch.name)}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 text-left text-[14px] font-medium transition-colors duration-150 flex items-center justify-between ${
                    branch.name === currentBranch
                      ? 'bg-[#ebebeb] text-[#0a0a0a]'
                      : 'text-[#3b3b3b] hover:bg-[#ebebeb] hover:text-[#0a0a0a]'
                  }`}
                >
                  <span>{branch.label}</span>
                  {branch.name === currentBranch && (
                    <span className="text-[#0a0a0a]">
                      <CheckIcon />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div 
              className="px-4 py-2 text-[11px] text-[#898989]"
              style={{ borderTop: '1px solid rgba(10, 10, 10, 0.08)' }}
            >
              Page will reload after switching
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
