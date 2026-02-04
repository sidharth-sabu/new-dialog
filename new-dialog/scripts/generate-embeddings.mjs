// Script to pre-generate embeddings for the knowledge base
// Run with: node scripts/generate-embeddings.mjs

import { pipeline } from '@xenova/transformers'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateEmbeddings() {
  console.log('Loading knowledge base...')
  const knowledgePath = join(__dirname, '../lib/knowledge.json')
  const knowledgeData = JSON.parse(readFileSync(knowledgePath, 'utf-8'))
  
  console.log('Loading embedding model (first run downloads ~23MB model)...')
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true
  })
  
  const entries = []
  let totalCount = 0
  
  for (const item of knowledgeData) {
    console.log(`Processing: ${item.target_object}`)
    
    // Embed the description
    const descOutput = await extractor(item.description, { pooling: 'mean', normalize: true })
    entries.push({
      text: item.description,
      targetObject: item.target_object,
      type: 'description',
      embedding: Array.from(descOutput.data)
    })
    totalCount++
    
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
        totalCount++
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
        totalCount++
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
      totalCount++
      
      // Progress indicator
      if (totalCount % 20 === 0) {
        process.stdout.write('.')
      }
    }
  }
  
  console.log(`\n\nGenerated ${entries.length} embeddings`)
  
  // Save to cache file
  const cachePath = join(__dirname, '../lib/embeddings-cache.json')
  writeFileSync(cachePath, JSON.stringify(entries, null, 2))
  console.log(`Saved to ${cachePath}`)
  
  // Calculate file size
  const stats = readFileSync(cachePath)
  console.log(`Cache file size: ${(stats.length / 1024 / 1024).toFixed(2)} MB`)
}

generateEmbeddings().catch(console.error)
