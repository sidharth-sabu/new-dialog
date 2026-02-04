import knowledgeData from './knowledge.json'

export interface KnowledgeItem {
  target_object: string
  description: string
  user_queries: string[]
}

// Map target_objects to existing iconTypes
const targetToIcon: Record<string, 'channel' | 'zap' | 'page' | 'masonry' | 'compass' | 'folder' | 'more'> = {
  'Projects': 'compass',
  'Docs': 'page',
  'Channels': 'channel',
  'Agents': 'zap',
  'Dashboards': 'masonry',
  'Integrations': 'channel',
  'Folders': 'folder',
}

export interface MatchResult {
  target: KnowledgeItem
  matchedQuery: string
  score: number
  contextualDescription?: string
}

// AI-powered suggestion interface
export interface AISuggestion {
  target_object: string
  description: string
  contextual_description: string
  confidence: number
  matched_query: string
}

// Fetch AI-powered suggestions from LM Studio
export async function fetchAISuggestions(query: string): Promise<MatchResult[]> {
  if (!query.trim() || query.length < 2) return []

  try {
    const response = await fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      console.warn('AI suggestion API error, falling back to local search')
      return findBestMatches(query, 3)
    }

    const data = await response.json()
    
    if (!data.suggestions || data.suggestions.length === 0) {
      return findBestMatches(query, 3)
    }

    // Convert AI suggestions to MatchResult format
    return data.suggestions.map((s: AISuggestion) => {
      const knowledgeItem = (knowledgeData as KnowledgeItem[]).find(
        k => k.target_object.toLowerCase() === s.target_object.toLowerCase()
      )
      
      return {
        target: knowledgeItem || {
          target_object: s.target_object,
          description: s.description,
          user_queries: []
        },
        matchedQuery: s.matched_query || s.contextual_description,
        score: s.confidence,
        contextualDescription: s.contextual_description
      }
    })
  } catch (error) {
    console.error('AI suggestion fetch error:', error)
    // Fallback to local matching
    return findBestMatches(query, 3)
  }
}

// Local text-based matching (fallback)
export function findBestMatches(query: string, limit: number = 3): MatchResult[] {
  if (!query.trim()) return []
  
  const lowerQuery = query.toLowerCase()
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 1)
  const matches: MatchResult[] = []

  for (const item of knowledgeData as KnowledgeItem[]) {
    let bestMatchForTarget: MatchResult | null = null
    
    for (const userQuery of item.user_queries) {
      const lowerUserQuery = userQuery.toLowerCase()
      let score = 0

      // Exact substring match - highest priority
      if (lowerUserQuery.includes(lowerQuery)) {
        score = 0.8 + (lowerQuery.length / lowerUserQuery.length) * 0.2
      } else if (lowerQuery.includes(lowerUserQuery.split(' ').slice(0, 3).join(' '))) {
        // Query contains the start of the user query
        score = 0.6
      } else {
        // Word overlap scoring
        const userQueryWords = lowerUserQuery.split(/\s+/)
        const matchedWords = queryWords.filter(qw => 
          userQueryWords.some(uqw => uqw.includes(qw) || qw.includes(uqw))
        )
        if (matchedWords.length > 0) {
          score = (matchedWords.length / queryWords.length) * 0.5
        }
      }

      if (score > 0 && (!bestMatchForTarget || score > bestMatchForTarget.score)) {
        bestMatchForTarget = { target: item, matchedQuery: userQuery, score }
      }
    }

    if (bestMatchForTarget && bestMatchForTarget.score > 0.15) {
      matches.push(bestMatchForTarget)
    }
  }

  // Sort by score descending and limit results
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function getIconForTarget(target: string): 'channel' | 'zap' | 'page' | 'masonry' | 'compass' | 'folder' | 'more' {
  return targetToIcon[target] || 'page'
}

export function getActionLabel(target: string): string {
  const labels: Record<string, string> = {
    'Projects': 'Create a new project',
    'Docs': 'Create a new doc',
    'Channels': 'Create a new channel',
    'Agents': 'Create a new agent',
    'Dashboards': 'Create a new dashboard',
    'Integrations': 'Set up an integration',
    'Folders': 'Create a new folder',
  }
  return labels[target] || `Create ${target}`
}
