'use client'

import { useState, useEffect, useRef } from 'react'
import { useVariant } from '@/lib/VariantContext'
import { VARIANTS } from '@/lib/variants'

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

export function VariantSwitcher() {
  const { variant, setVariant } = useVariant()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLabel = VARIANTS.find(v => v.key === variant)?.label || variant

  return (
    <div 
      ref={dropdownRef}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-[#fafafa] rounded-lg text-[14px] font-medium text-[#0a0a0a] hover:bg-[#ebebeb] transition-colors duration-150"
          style={{
            border: '1px solid rgba(10, 10, 10, 0.16)',
            boxShadow: '0px 8px 16px -4px rgba(10, 10, 10, 0.24)',
          }}
        >
          <span>{currentLabel}</span>
          <span className="text-[#898989]">
            <ChevronIcon className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
          </span>
        </button>

        {isOpen && (
          <div 
            className="absolute bottom-full right-0 mb-2 w-64 bg-[#fafafa] rounded-lg overflow-hidden"
            style={{
              border: '1px solid rgba(10, 10, 10, 0.16)',
              boxShadow: '0px 16px 32px -8px rgba(10, 10, 10, 0.32)',
            }}
          >
            <div 
              className="px-4 py-2 text-[12px] font-medium text-[#898989] uppercase tracking-wider"
              style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.08)' }}
            >
              Switch Variant
            </div>
            <div className="py-1">
              {VARIANTS.map((v) => (
                <button
                  key={v.key}
                  onClick={() => {
                    setVariant(v.key)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-left transition-colors duration-150 flex items-center justify-between ${
                    v.key === variant
                      ? 'bg-[#ebebeb] text-[#0a0a0a]'
                      : 'text-[#3b3b3b] hover:bg-[#ebebeb] hover:text-[#0a0a0a]'
                  }`}
                >
                  <div>
                    <div className="text-[14px] font-medium">{v.label}</div>
                    <div className="text-[12px] text-[#898989]">{v.description}</div>
                  </div>
                  {v.key === variant && (
                    <span className="text-[#0a0a0a] flex-shrink-0 ml-2">
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
              Switches instantly — no reload needed
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
