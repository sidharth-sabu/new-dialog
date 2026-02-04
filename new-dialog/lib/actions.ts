export type ActionCategory = 'analyze' | 'create' | 'connect' | 'organize' | 'other'

export interface ActionItemData {
  id: string
  label: string
  iconType: 'channel' | 'zap' | 'page' | 'masonry' | 'compass' | 'folder' | 'more'
  badge?: 'beta'
  integrations?: ('zendesk' | 'zapier' | 'intercom')[]
  isSecondary?: boolean
  description?: string
  category?: ActionCategory
}

export const categoryLabels: Record<ActionCategory, string> = {
  analyze: 'Analyze',
  create: 'Create',
  connect: 'Connect',
  organize: 'Organize',
  other: '',
}

export const categoryOrder: ActionCategory[] = ['analyze', 'create', 'connect', 'organize', 'other']

// Full pool of actions to randomly select from
const actionPool: ActionItemData[] = [
  // Analyze - extract insights from data
  { id: 'classify-support-tickets', label: 'Classify support tickets', iconType: 'channel', category: 'analyze' },
  { id: 'classify-app-reviews', label: 'Classify app reviews', iconType: 'channel', category: 'analyze' },
  { id: 'learn-sales-calls', label: 'Learn from sales calls', iconType: 'channel', category: 'analyze' },
  { id: 'analyze-customer-interviews', label: 'Analyze customer interviews', iconType: 'compass', category: 'analyze' },
  { id: 'track-nps-responses', label: 'Track NPS responses', iconType: 'channel', category: 'analyze' },
  { id: 'monitor-customer-sentiment', label: 'Monitor customer sentiment', iconType: 'channel', category: 'analyze' },
  { id: 'identify-pain-points', label: 'Identify pain points automatically', iconType: 'zap', category: 'analyze', badge: 'beta' },
  { id: 'track-feature-requests', label: 'Track feature requests', iconType: 'channel', category: 'analyze' },
  { id: 'analyze-csat-feedback', label: 'Analyze CSAT feedback', iconType: 'channel', category: 'analyze' },
  { id: 'find-feedback-trends', label: 'Find feedback trends', iconType: 'masonry', category: 'analyze' },
  
  // Create - produce deliverables
  { id: 'write-requirements', label: 'Write requirements doc with AI', iconType: 'page', badge: 'beta', category: 'create' },
  { id: 'visualize-metrics', label: 'Visualize key metrics', iconType: 'masonry', badge: 'beta', category: 'create' },
  { id: 'create-research-report', label: 'Create research report', iconType: 'page', category: 'create' },
  { id: 'generate-weekly-summary', label: 'Generate weekly summary', iconType: 'zap', badge: 'beta', category: 'create' },
  { id: 'create-highlight-reel', label: 'Create a highlight reel', iconType: 'compass', category: 'create' },
  { id: 'write-voc-report', label: 'Write Voice of Customer report', iconType: 'page', category: 'create' },
  { id: 'build-executive-dashboard', label: 'Build executive dashboard', iconType: 'masonry', category: 'create' },
  { id: 'summarize-research-findings', label: 'Summarize research findings', iconType: 'page', category: 'create' },
  { id: 'create-feedback-snapshot', label: 'Create a feedback snapshot', iconType: 'masonry', category: 'create' },
  { id: 'draft-discussion-guide', label: 'Draft a discussion guide', iconType: 'page', category: 'create' },
  
  // Connect - integrations and imports
  { id: 'connect-zendesk', label: 'Connect Zendesk', iconType: 'channel', category: 'connect', integrations: ['zendesk'] },
  { id: 'connect-intercom', label: 'Connect Intercom', iconType: 'channel', category: 'connect', integrations: ['intercom'] },
  { id: 'connect-slack', label: 'Connect Slack', iconType: 'channel', category: 'connect' },
  { id: 'import-zoom-recordings', label: 'Import Zoom recordings', iconType: 'compass', category: 'connect' },
  { id: 'connect-zapier', label: 'Connect Zapier', iconType: 'zap', category: 'connect', integrations: ['zapier'] },
  { id: 'import-google-drive', label: 'Import from Google Drive', iconType: 'folder', category: 'connect' },
  { id: 'connect-salesforce', label: 'Connect Salesforce', iconType: 'channel', category: 'connect' },
  { id: 'connect-gong', label: 'Connect Gong', iconType: 'channel', category: 'connect' },
  { id: 'sync-calendar-recordings', label: 'Sync calendar recordings', iconType: 'compass', category: 'connect' },
  { id: 'import-app-store-reviews', label: 'Import app store reviews', iconType: 'channel', category: 'connect' },
  
  // Organize - manage workspace
  { id: 'organize-folder', label: 'Organize with a folder', iconType: 'folder', category: 'organize' },
  { id: 'group-projects', label: 'Group projects together', iconType: 'folder', category: 'organize' },
  { id: 'categorize-by-product', label: 'Categorize by product area', iconType: 'folder', category: 'organize' },
  { id: 'organize-by-team', label: 'Organize by team', iconType: 'folder', category: 'organize' },
  { id: 'create-folder-structure', label: 'Create folder structure', iconType: 'folder', category: 'organize' },
]

// Show more is always included
const showMoreItem: ActionItemData = {
  id: 'show-more',
  label: 'Show more',
  iconType: 'more',
  isSecondary: true,
  category: 'other',
}

// Shuffle array using Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Helper to get randomized grouped actions (max 3 per category)
export function getGroupedActions(): Map<ActionCategory, ActionItemData[]> {
  const grouped = new Map<ActionCategory, ActionItemData[]>()
  
  // Initialize in order
  categoryOrder.forEach(cat => grouped.set(cat, []))
  
  // Group all items by category
  const byCategory = new Map<ActionCategory, ActionItemData[]>()
  categoryOrder.forEach(cat => byCategory.set(cat, []))
  
  actionPool.forEach(item => {
    const category = item.category || 'other'
    byCategory.get(category)?.push(item)
  })
  
  // Shuffle and take max 3 from each category
  categoryOrder.forEach(cat => {
    const items = byCategory.get(cat) || []
    const shuffled = shuffleArray(items)
    grouped.set(cat, shuffled.slice(0, 3))
  })
  
  // Always add show more to other
  grouped.set('other', [showMoreItem])
  
  return grouped
}

// Export static list for backwards compatibility
export const actionItems = actionPool
