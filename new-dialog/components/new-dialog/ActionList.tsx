'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ActionItem } from './ActionItem'
import { actionItems, ActionItemData, getGroupedActions, getRandomizedActions, categoryLabels, categoryOrder, ActionCategory } from '@/lib/actions'
import { MatchResult, getIconForTarget, getActionLabel } from '@/lib/knowledge'
import { useVariant } from '@/lib/VariantContext'
import { VariantKey } from '@/lib/variants'

interface ActionListProps {
  onActionClick?: (actionId: string) => void
  searchMatches?: MatchResult[]
  isSearching?: boolean
}

// Category header for the grouped variant
const CategoryHeader: React.FC<{ label: string }> = ({ label }) => {
  if (!label) return null
  return (
    <div className="px-8 pt-4 pb-1">
      <span className="text-[14px] font-medium text-[#898989]">
        {label}
      </span>
    </div>
  )
}

const INITIAL_ITEMS = 8
const LOAD_MORE_COUNT = 6

export const ActionList: React.FC<ActionListProps> = ({ 
  onActionClick, 
  searchMatches = [],
  isSearching = false
}) => {
  const { variant } = useVariant()

  // Track client mount to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false)

  // State for randomized variants
  const [groupedActions, setGroupedActions] = useState<Map<ActionCategory, ActionItemData[]> | null>(null)
  const [flatActions, setFlatActions] = useState<ActionItemData[]>([])
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS)
  const actionsGeneratedRef = useRef(false)
  const prevVariantRef = useRef<VariantKey | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Regenerate actions when variant changes or on first mount
  useEffect(() => {
    if (!isMounted) return
    
    // Only regenerate if variant actually changed or first time
    if (prevVariantRef.current === variant && actionsGeneratedRef.current) return
    prevVariantRef.current = variant
    actionsGeneratedRef.current = true

    if (variant === 'empty_state_01') {
      setGroupedActions(getGroupedActions())
    } else if (variant === 'empty_state_02' || variant === 'empty_state_03') {
      setFlatActions(getRandomizedActions())
      setVisibleCount(INITIAL_ITEMS)
    }
    // 'main' uses the static actionItems directly
  }, [isMounted, variant])

  // Show empty placeholder until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return <div className="p-4" />
  }

  // --- Search results (shared across all variants) ---
  const matchedItems: ActionItemData[] = searchMatches.map((match, index) => ({
    id: `match-${match.target.target_object.toLowerCase()}-${index}`,
    label: getActionLabel(match.target.target_object),
    iconType: getIconForTarget(match.target.target_object),
  }))

  if (isSearching) {
    if (matchedItems.length > 0) {
      return (
        <div className="p-4">
          {matchedItems.map((item) => (
            <ActionItem
              key={item.id}
              item={item}
              onClick={() => onActionClick?.(item.id)}
            />
          ))}
        </div>
      )
    }
    return (
      <div className="px-4 py-8 text-center text-[#898989]">
        No matching actions found. Try a different query.
      </div>
    )
  }

  // --- Variant: Main (original static list) ---
  if (variant === 'main') {
    return (
      <div className="p-4">
        {actionItems.map((item) => (
          <ActionItem
            key={item.id}
            item={item}
            onClick={() => onActionClick?.(item.id)}
          />
        ))}
      </div>
    )
  }

  // --- Variant: Empty State 01 (grouped with category headers) ---
  if (variant === 'empty_state_01') {
    if (!groupedActions) return <div className="pb-4" />
    
    return (
      <div className="pb-4">
        {categoryOrder.map((category) => {
          const items = groupedActions.get(category) || []
          if (items.length === 0) return null
          
          const label = categoryLabels[category]
          
          return (
            <div key={category}>
              <CategoryHeader label={label} />
              <div className="px-4">
                {items.map((item) => (
                  <ActionItem
                    key={item.id}
                    item={item}
                    onClick={() => onActionClick?.(item.id)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // --- Variant: Empty State 02 (flat randomized) ---
  if (variant === 'empty_state_02') {
    if (flatActions.length === 0) return <div className="p-4" />
    
    return (
      <div className="p-4">
        {flatActions.map((item) => (
          <ActionItem
            key={item.id}
            item={item}
            onClick={() => onActionClick?.(item.id)}
          />
        ))}
      </div>
    )
  }

  // --- Variant: Empty State 03 (flat with load more) ---
  if (variant === 'empty_state_03') {
    if (flatActions.length === 0) return <div className="p-4" />

    const visibleActions = flatActions.slice(0, visibleCount)
    const hasMore = visibleCount < flatActions.length || flatActions.length >= INITIAL_ITEMS

    const handleLoadMore = () => {
      const newItems = getRandomizedActions()
      const existingIds = new Set(flatActions.map(a => a.id))
      const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id))
      
      if (uniqueNewItems.length > 0) {
        setFlatActions(prev => [...prev, ...uniqueNewItems])
        setVisibleCount(prev => prev + LOAD_MORE_COUNT)
      } else {
        setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, flatActions.length))
      }
    }

    return (
      <div className="p-4">
        {visibleActions.map((item) => (
          <ActionItem
            key={item.id}
            item={item}
            onClick={() => onActionClick?.(item.id)}
          />
        ))}
        
        {hasMore && (
          <button
            onClick={handleLoadMore}
            className="w-full py-3 text-center text-[14px] font-medium text-[#898989] hover:text-[#3b3b3b] transition-colors duration-150"
          >
            Load more
          </button>
        )}
      </div>
    )
  }

  // Fallback
  return <div className="p-4" />
}
