'use client'

import React, { useState } from 'react'
import { ActionItemData } from '@/lib/actions'
import {
  ChannelIcon,
  ZapIcon,
  PageIcon,
  MasonryIcon,
  CompassIcon,
  FolderIcon,
  MoreIcon,
  ZendeskIcon,
  ZapierIcon,
  IntercomIcon,
} from '../icons/CustomIcons'

interface ActionItemProps {
  item: ActionItemData
  onClick?: () => void
}

const iconMap = {
  channel: ChannelIcon,
  zap: ZapIcon,
  page: PageIcon,
  masonry: MasonryIcon,
  compass: CompassIcon,
  folder: FolderIcon,
  more: MoreIcon,
}

const integrationIconMap = {
  zendesk: ZendeskIcon,
  zapier: ZapierIcon,
  intercom: IntercomIcon,
}

export const ActionItem: React.FC<ActionItemProps> = ({ item, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = iconMap[item.iconType]

  return (
    <button
      className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-colors duration-150 text-left group ${
        isHovered ? 'bg-[#ebebeb]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <span className="text-[#0a0a0a] flex-shrink-0">
        <Icon size={24} />
      </span>
      
      <span className={`flex-1 text-[16px] font-medium leading-6 ${
        item.isSecondary ? 'text-[#3b3b3b]' : 'text-[#0a0a0a]'
      }`}>
        {item.label}
        {item.description && (
          <span className="block text-[13px] text-[#898989] leading-5 truncate font-medium">
            {item.description}
          </span>
        )}
      </span>

      {item.badge === 'beta' && (
        <span className="px-1.5 py-1 text-[12px] font-medium leading-4 text-[#0a0a0a] bg-[#d8d8d8] rounded-lg">
          Beta
        </span>
      )}

      {item.integrations && isHovered && (
        <div className="flex items-center gap-1">
          {item.integrations.map((integration) => {
            const IntegrationIcon = integrationIconMap[integration]
            return (
              <span
                key={integration}
                className="text-[#0a0a0a]"
              >
                <IntegrationIcon size={24} />
              </span>
            )
          })}
        </div>
      )}
    </button>
  )
}
