// Semantic search using pre-computed embeddings
import knowledgeData from './knowledge.json'

export interface KnowledgeItem {
  target_object: string
  description: string
  capabilities?: string[]
  use_cases?: string[]
  data_types?: string[]
  related_to?: string[]
  user_queries: string[]
}

export interface EmbeddingEntry {
  text: string
  targetObject: string
  type: 'query' | 'capability' | 'use_case' | 'description'
  embedding: number[]
}

export interface SemanticMatch {
  target: KnowledgeItem
  matchedText: string
  matchType: string
  score: number
}

// Pre-computed embeddings will be loaded from this file
let embeddingsCache: EmbeddingEntry[] | null = null
let pipelineInstance: any = null

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  return denominator === 0 ? 0 : dotProduct / denominator
}

// Get or initialize the embedding pipeline
async function getEmbeddingPipeline() {
  if (pipelineInstance) return pipelineInstance
  
  // Dynamic import to avoid issues with SSR
  const { pipeline } = await import('@xenova/transformers')
  
  // Use a small, fast model for embeddings
  pipelineInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true // Use quantized model for faster inference
  })
  
  return pipelineInstance
}

// Generate embedding for a single text
export async function generateEmbedding(text: string): Promise<number[]> {
  const extractor = await getEmbeddingPipeline()
  const output = await extractor(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

// Generate all embeddings for the knowledge base
export async function generateAllEmbeddings(): Promise<EmbeddingEntry[]> {
  const entries: EmbeddingEntry[] = []
  const extractor = await getEmbeddingPipeline()
  
  for (const item of knowledgeData as KnowledgeItem[]) {
    // Embed the description
    const descOutput = await extractor(item.description, { pooling: 'mean', normalize: true })
    entries.push({
      text: item.description,
      targetObject: item.target_object,
      type: 'description',
      embedding: Array.from(descOutput.data)
    })
    
    // Embed capabilities
    if (item.capabilities) {
      for (const cap of item.capabilities) {
        const capOutput = await extractor(cap, { pooling: 'mean', normalize: true })
        entries.push({
          text: cap,
          targetObject: item.target_object,
          type: 'capability',
          embedding: Array.from(capOutput.data)
        })
      }
    }
    
    // Embed use cases
    if (item.use_cases) {
      for (const uc of item.use_cases) {
        const ucOutput = await extractor(uc, { pooling: 'mean', normalize: true })
        entries.push({
          text: uc,
          targetObject: item.target_object,
          type: 'use_case',
          embedding: Array.from(ucOutput.data)
        })
      }
    }
    
    // Embed user queries
    for (const query of item.user_queries) {
      const queryOutput = await extractor(query, { pooling: 'mean', normalize: true })
      entries.push({
        text: query,
        targetObject: item.target_object,
        type: 'query',
        embedding: Array.from(queryOutput.data)
      })
    }
  }
  
  return entries
}

// Load embeddings from cache or generate them
export async function loadEmbeddings(): Promise<EmbeddingEntry[]> {
  if (embeddingsCache) return embeddingsCache
  
  try {
    // Try to load pre-computed embeddings
    const cached = await import('./embeddings-cache.json')
    embeddingsCache = cached.default as EmbeddingEntry[]
    console.log(`Loaded ${embeddingsCache.length} cached embeddings`)
    return embeddingsCache
  } catch {
    // Generate embeddings if cache doesn't exist
    console.log('Generating embeddings (first run)...')
    embeddingsCache = await generateAllEmbeddings()
    return embeddingsCache
  }
}

// Semantic search using embeddings
export async function semanticSearch(query: string, limit: number = 3): Promise<SemanticMatch[]> {
  if (!query.trim() || query.length < 2) return []
  
  const embeddings = await loadEmbeddings()
  const queryEmbedding = await generateEmbedding(query)
  
  // Calculate similarity scores for all embeddings
  const scores: { entry: EmbeddingEntry; score: number }[] = embeddings.map(entry => ({
    entry,
    score: cosineSimilarity(queryEmbedding, entry.embedding)
  }))
  
  // Sort by score and group by target object (keep best match per target)
  const bestByTarget = new Map<string, { entry: EmbeddingEntry; score: number }>()
  
  for (const item of scores) {
    const existing = bestByTarget.get(item.entry.targetObject)
    if (!existing || item.score > existing.score) {
      bestByTarget.set(item.entry.targetObject, item)
    }
  }
  
  // Convert to array and sort
  const results = Array.from(bestByTarget.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
  
  // Map to SemanticMatch format
  return results.map(({ entry, score }) => {
    const knowledgeItem = (knowledgeData as KnowledgeItem[]).find(
      k => k.target_object === entry.targetObject
    )!
    
    return {
      target: knowledgeItem,
      matchedText: entry.text,
      matchType: entry.type,
      score
    }
  })
}
