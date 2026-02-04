import { NextRequest, NextResponse } from 'next/server'
import { semanticSearch, SemanticMatch } from '@/lib/embeddings'

// Keywords that strongly indicate specific objects (from Dovetail docs)
const KEYWORD_BOOSTS: Record<string, string[]> = {
  // External app names → Integrations
  'Integrations': [
    'zoom', 'slack', 'teams', 'zendesk', 'intercom', 'salesforce', 'gong', 
    'freshdesk', 'hubspot', 'jira', 'linear', 'notion', 'productboard', 
    'zapier', 'google drive', 'onedrive', 'outlook', 'pendo', 'g2', 
    'app store', 'google meet', 'google calendar', 'atlassian', 'front',
    'integration', 'connect'
  ],
  // Feedback/classification terms → Channels
  'Channels': [
    'support ticket', 'nps', 'csat', 'app review', 'classify', 'theme',
    'high-volume', 'continuous feedback', 'customer feedback'
  ],
  // Research/analysis terms → Projects
  'Projects': [
    'interview', 'usability', 'sales call', 'survey', 'transcribe', 
    'translate', 'highlight', 'canvas', 'recording', 'transcript'
  ],
  // Visualization terms → Dashboards
  'Dashboards': [
    'visualize', 'visualise', 'metric', 'trend', 'chart', 'sentiment',
    'over time', 'track nps', 'track csat', 'dashboard'
  ],
  // Automation terms → Agents
  'Agents': [
    'monitor', 'notify', 'alert', 'schedule', 'automate', 'weekly',
    'daily', 'agent', 'automatic'
  ],
  // Document terms → Docs
  'Docs': [
    'prd', 'report', 'requirement', 'summarize', 'summarise', 'finding',
    'insight', 'stakeholder', 'write', 'document', 'doc'
  ],
  // Organization terms → Folders
  'Folders': [
    'organize', 'organise', 'categorize', 'categorise', 'group', 'folder'
  ]
}

// Check if query contains keywords for a specific object
function getKeywordBoost(query: string): Map<string, number> {
  const lowerQuery = query.toLowerCase()
  const boosts = new Map<string, number>()
  
  for (const [targetObject, keywords] of Object.entries(KEYWORD_BOOSTS)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword)) {
        // Apply a 2x boost for keyword matches
        boosts.set(targetObject, (boosts.get(targetObject) || 1) * 2)
        break // Only boost once per object
      }
    }
  }
  
  return boosts
}

// Apply smart filtering based on confidence gaps
function smartFilter(matches: SemanticMatch[], query: string): SemanticMatch[] {
  if (matches.length <= 1) return matches
  
  // Apply keyword boosts
  const boosts = getKeywordBoost(query)
  const boostedMatches = matches.map(m => ({
    ...m,
    score: m.score * (boosts.get(m.target.target_object) || 1)
  }))
  
  // Re-sort by boosted scores
  boostedMatches.sort((a, b) => b.score - a.score)
  
  // Calculate confidence gap between top result and second result
  const topScore = boostedMatches[0].score
  const secondScore = boostedMatches[1]?.score || 0
  const gap = secondScore > 0 ? topScore / secondScore : 10
  
  // If big gap (top is 1.5x+ better than second), show fewer results
  if (gap >= 1.5) {
    // Find where the significant drop-off happens
    let cutoff = 1
    for (let i = 1; i < boostedMatches.length; i++) {
      const currentGap = boostedMatches[i-1].score / boostedMatches[i].score
      if (currentGap >= 1.5) {
        cutoff = i
        break
      }
      cutoff = i + 1
    }
    // Show at least 2, at most 4 for specific queries
    return boostedMatches.slice(0, Math.max(2, Math.min(cutoff, 4)))
  }
  
  // Small gap - show all results (generic query like "create")
  return boostedMatches
}

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 7 } = await request.json()

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Use semantic search for instant results
    const matches = await semanticSearch(query, Math.min(limit, 10))
    
    // Apply smart filtering (keyword boost + confidence gap)
    const filteredMatches = smartFilter(matches, query)
    
    const suggestions = filteredMatches.map(match => ({
      target_object: match.target.target_object,
      description: match.target.description,
      contextual_description: match.matchedText,
      confidence: match.score,
      matched_query: match.matchedText,
      match_type: match.matchType
    }))

    return NextResponse.json({ suggestions })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ suggestions: [], error: 'Internal error' })
  }
}

// Also export GET for health check
export async function GET() {
  return NextResponse.json({ status: 'ok', type: 'semantic-search' })
}
