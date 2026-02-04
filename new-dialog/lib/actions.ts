export interface ActionItemData {
  id: string
  label: string
  iconType: 'channel' | 'zap' | 'page' | 'masonry' | 'compass' | 'folder' | 'more'
  badge?: 'beta'
  integrations?: ('zendesk' | 'zapier' | 'intercom')[]
  isSecondary?: boolean
  description?: string
}

export const actionItems: ActionItemData[] = [
  {
    id: 'classify-support-tickets',
    label: 'Classify support tickets',
    iconType: 'channel',
  },
  {
    id: 'auto-analysis',
    label: 'Auto analysis and reporting',
    iconType: 'zap',
    badge: 'beta',
  },
  {
    id: 'classify-app-reviews',
    label: 'Classify app reviews',
    iconType: 'channel',
  },
  {
    id: 'write-requirements',
    label: 'Write requirements doc with AI',
    iconType: 'page',
    badge: 'beta',
  },
  {
    id: 'visualize-metrics',
    label: 'Visualize key metrics',
    iconType: 'masonry',
    badge: 'beta',
  },
  {
    id: 'learn-sales-calls',
    label: 'Learn from sales calls',
    iconType: 'channel',
  },
  {
    id: 'interview-users',
    label: 'Interview users with Outset.ai',
    iconType: 'compass',
  },
  {
    id: 'organize-folder',
    label: 'Organize with a folder',
    iconType: 'folder',
  },
]
