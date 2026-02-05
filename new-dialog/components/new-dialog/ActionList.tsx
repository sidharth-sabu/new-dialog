'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ActionItem } from './ActionItem'
import { ActionItemData, getGroupedActions, categoryOrder } from '@/lib/actions'
import { MatchResult, getIconForTarget, getActionLabel } from '@/lib/knowledge'

interface ActionListProps {
  onActionClick?: (actionId: string) => void
  searchMatches?: MatchResult[]
  isSearching?: boolean
}

const INITIAL_ITEMS = 8
const LOAD_MORE_COUNT = 6

export const ActionList: React.FC<ActionListProps> = ({ 
  onActionClick, 
  searchMatches = [],
  isSearching = false
}) => {
  // Track if component has mounted to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false)
  const [allActions, setAllActions] = useState<ActionItemData[]>([])
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS)
  // Use ref to ensure we only generate actions once per mount
  const actionsGeneratedRef = useRef(false)
  
  // Function to generate randomized actions from all categories
  const generateActions = () => {
    const grouped = getGroupedActions()
    // Flatten the grouped actions into a single list (maintains category order)
    const flat: ActionItemData[] = []
    categoryOrder.forEach(category => {
      const items = grouped.get(category) || []
      flat.push(...items)
    })
    return flat
  }
  
  // Load more items - generates new random items and adds them
  const handleLoadMore = () => {
    const newItems = generateActions()
    // Filter out items we already have (by id) and add new ones
    const existingIds = new Set(allActions.map(a => a.id))
    const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id))
    
    if (uniqueNewItems.length > 0) {
      setAllActions(prev => [...prev, ...uniqueNewItems])
      setVisibleCount(prev => prev + LOAD_MORE_COUNT)
    } else {
      // If no new unique items, just show more of what we have
      setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, allActions.length))
    }
  }
  
  useEffect(() => {
    setIsMounted(true)
    // Only generate actions once per mount to avoid inconsistencies
    if (!actionsGeneratedRef.current) {
      actionsGeneratedRef.current = true
      setAllActions(generateActions())
    }
    
    // Reset ref on unmount so fresh actions are generated on next mount
    return () => {
      actionsGeneratedRef.current = false
    }
  }, [])

  // Show loading state until client-side mount to avoid hydration mismatch
  if (!isMounted) {
    return <div className="p-4" />
  }

  // Convert search matches to ActionItemData format (no descriptions)
  const matchedItems: ActionItemData[] = searchMatches.map((match, index) => ({
    id: `match-${match.target.target_object.toLowerCase()}-${index}`,
    label: getActionLabel(match.target.target_object),
    iconType: getIconForTarget(match.target.target_object),
  }))

  // If searching and have matches, show only matched items (flat list)
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

  // Show loading state until randomization is ready
  if (allActions.length === 0) {
    return <div className="p-4" />
  }

  const visibleActions = allActions.slice(0, visibleCount)
  const hasMore = visibleCount < allActions.length || allActions.length >= INITIAL_ITEMS

  // Flat list with "Load more" button
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
