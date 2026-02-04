'use client'

import React, { useState, useEffect, useRef } from 'react'
import { SearchInput } from './SearchInput'
import { ActionList } from './ActionList'
import { MatchResult } from '@/lib/knowledge'

interface NewDialogProps {
  onClose?: () => void
  onActionClick?: (actionId: string) => void
}

// Debounce hook - reduced to 150ms for near-instant feel
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Fetch semantic suggestions from API - returns all matching objects
async function fetchSemanticSuggestions(query: string): Promise<MatchResult[]> {
  if (!query.trim() || query.length < 2) return []

  try {
    const response = await fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit: 10 }), // Get all possible matches
    })

    if (!response.ok) return []

    const data = await response.json()
    
    if (!data.suggestions || data.suggestions.length === 0) return []

    // Convert API response to MatchResult format
    return data.suggestions.map((s: any) => ({
      target: {
        target_object: s.target_object,
        description: s.description,
        user_queries: []
      },
      matchedQuery: s.contextual_description || s.matched_query,
      score: s.confidence,
      contextualDescription: s.contextual_description
    }))
  } catch (error) {
    console.error('Semantic search error:', error)
    return []
  }
}

export const NewDialog: React.FC<NewDialogProps> = ({ onClose, onActionClick }) => {
  const [searchValue, setSearchValue] = useState('')
  const [matches, setMatches] = useState<MatchResult[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)

  // Debounce search input (150ms for fast response)
  const debouncedSearch = useDebounce(searchValue, 150)

  // Fetch semantic suggestions when debounced search changes
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    if (!debouncedSearch.trim()) {
      setMatches([])
      return
    }

    abortControllerRef.current = new AbortController()

    fetchSemanticSuggestions(debouncedSearch)
      .then((results) => {
        setMatches(results)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error)
        }
      })

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [debouncedSearch])

  const handleActionClick = (actionId: string) => {
    onActionClick?.(actionId)
  }

  return (
    <div 
      className="w-full max-w-[680px] bg-[#fafafa] rounded-lg overflow-hidden"
      style={{
        border: '1px solid rgba(10, 10, 10, 0.16)',
        boxShadow: '0px 16px 32px -8px rgba(10, 10, 10, 0.32)',
      }}
    >
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
      />
      <div className="h-[400px] overflow-y-auto">
        <ActionList 
          onActionClick={handleActionClick} 
          searchMatches={matches}
          isSearching={searchValue.length > 0}
        />
      </div>
    </div>
  )
}

// Export a version with backdrop for modal usage
export const NewDialogModal: React.FC<NewDialogProps & { isOpen: boolean }> = ({
  isOpen,
  onClose,
  onActionClick,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,10,10,0.64)]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.()
        }
      }}
    >
      <NewDialog onClose={onClose} onActionClick={onActionClick} />
    </div>
  )
}
