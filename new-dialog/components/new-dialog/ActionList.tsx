'use client'

import React from 'react'
import { ActionItem } from './ActionItem'
import { actionItems, ActionItemData } from '@/lib/actions'
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
  // Convert search matches to ActionItemData format (no descriptions)
  const matchedItems: ActionItemData[] = searchMatches.map((match, index) => ({
    id: `match-${match.target.target_object.toLowerCase()}-${index}`,
    label: getActionLabel(match.target.target_object),
    iconType: getIconForTarget(match.target.target_object),
  }))

  // If searching and have matches, show only matched items
  // Otherwise show default action items
  const itemsToShow = isSearching && matchedItems.length > 0 
    ? matchedItems 
    : actionItems

  return (
    <div className="p-4">
      {itemsToShow.map((item) => (
        <ActionItem
          key={item.id}
          item={item}
          onClick={() => onActionClick?.(item.id)}
        />
      ))}

      {isSearching && matchedItems.length === 0 && (
        <div className="px-4 py-8 text-center text-[#898989]">
          No matching actions found. Try a different query.
        </div>
      )}
    </div>
  )
}
