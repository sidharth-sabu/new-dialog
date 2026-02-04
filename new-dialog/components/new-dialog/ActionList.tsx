'use client'

import React, { useState, useEffect } from 'react'
import { ActionItem } from './ActionItem'
import { ActionItemData, getGroupedActions, categoryLabels, categoryOrder, ActionCategory } from '@/lib/actions'
import { MatchResult, getIconForTarget, getActionLabel } from '@/lib/knowledge'

interface ActionListProps {
  onActionClick?: (actionId: string) => void
  searchMatches?: MatchResult[]
  isSearching?: boolean
}

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

export const ActionList: React.FC<ActionListProps> = ({ 
  onActionClick, 
  searchMatches = [],
  isSearching = false
}) => {
  // Randomize only on client after mount to avoid hydration mismatch
  const [groupedActions, setGroupedActions] = useState<Map<ActionCategory, ActionItemData[]> | null>(null)
  
  useEffect(() => {
    setGroupedActions(getGroupedActions())
  }, [])

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

  // Show loading state until client-side randomization is ready
  if (!groupedActions) {
    return <div className="pb-4" />
  }

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
