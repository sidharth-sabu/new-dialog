'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ActionItem } from './ActionItem'
import { ActionItemData, getGroupedActions, categoryOrder, ActionCategory } from '@/lib/actions'
import { MatchResult, getIconForTarget, getActionLabel } from '@/lib/knowledge'

interface ActionListProps {
  onActionClick?: (actionId: string) => void
  searchMatches?: MatchResult[]
  isSearching?: boolean
}

export const ActionList: React.FC<ActionListProps> = ({ 
  onActionClick, 
  searchMatches = [],
  isSearching = false
}) => {
  // Track if component has mounted to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false)
  const [flatActions, setFlatActions] = useState<ActionItemData[]>([])
  // Use ref to ensure we only generate actions once per mount
  const actionsGeneratedRef = useRef(false)
  
  // Function to generate new randomized actions
  const generateActions = () => {
    const grouped = getGroupedActions()
    // Flatten the grouped actions into a single list (maintains category order)
    const flat: ActionItemData[] = []
    categoryOrder.forEach(category => {
      const items = grouped.get(category) || []
      flat.push(...items)
    })
    setFlatActions(flat)
  }
  
  useEffect(() => {
    setIsMounted(true)
    // Only generate actions once per mount to avoid inconsistencies
    if (!actionsGeneratedRef.current) {
      actionsGeneratedRef.current = true
      generateActions()
    }
    
    // Reset ref on unmount so fresh actions are generated on next mount
    return () => {
      actionsGeneratedRef.current = false
    }
  }, [])

  // Show loading state until client-side mount to avoid hydration mismatch
  // This ensures server and client initial render match (both render this placeholder)
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
  if (flatActions.length === 0) {
    return <div className="p-4" />
  }

  // Flat list without category headers - refreshing the page shows new random items
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
