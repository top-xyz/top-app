import { HNSWLib } from '@langchain/community/vectorstores/hnswlib'
import { VertexAI } from '@google-cloud/vertexai'
import { Document } from '@langchain/core/documents'
import { BaseDocumentLoader } from '@langchain/core/document_loaders'
import { MarkdownTextSplitter } from '@langchain/text/markdown'
import { Embeddings } from '@langchain/core/embeddings'
import * as fs from 'fs/promises'
import * as path from 'path'

export interface VectorStoreConfig {
  dimensions: number
  space: 'cosine' | 'euclidean' | 'dot'
  maxElements?: number
}

class VertexEmbeddings implements Embeddings {
  private vertexai: VertexAI
  private model: string

  constructor() {
    this.model = 'textembedding-gecko'
    this.vertexai = new VertexAI()
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const model = this.vertexai.preview.getGenerativeModel({
      model: this.model
    })

    const embeddings = await Promise.all(
      texts.map(text => this.embedQuery(text))
    )

    return embeddings
  }

  async embedQuery(text: string): Promise<number[]> {
    const model = this.vertexai.preview.getGenerativeModel({
      model: this.model
    })

    const result = await model.generateContent({
      contents: [{ text }]
    })

    if (!result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Failed to generate embedding')
    }

    // Convert text response to vector
    const text = result.response.candidates[0].content.parts[0].text
    const vector = text.split(',').map(Number)
    
    if (vector.some(isNaN)) {
      throw new Error('Invalid embedding format')
    }

    return vector
  }
}

export class VectorStore {
  private store!: HNSWLib
  private splitter: MarkdownTextSplitter
  private embeddings: Embeddings
  private config: VectorStoreConfig

  constructor(config: VectorStoreConfig) {
    this.config = config
    this.embeddings = new VertexEmbeddings()
    
    this.splitter = new MarkdownTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })
  }

  async initialize(documents: Document[]): Promise<void> {
    const texts = await this.splitter.splitDocuments(documents)
    
    this.store = await HNSWLib.fromDocuments(texts, this.embeddings)
  }

  async addDocuments(documents: Document[]): Promise<void> {
    const texts = await this.splitter.splitDocuments(documents)
    await this.store.addDocuments(texts)
  }

  async similaritySearch(query: string, k: number = 3): Promise<Document[]> {
    return await this.store.similaritySearch(query, k)
  }

  async save(directory: string): Promise<void> {
    await this.store.save(directory)
  }

  static async load(directory: string, config: VectorStoreConfig): Promise<VectorStore> {
    const store = new VectorStore(config)
    const embeddings = new VertexEmbeddings()
    store.store = await HNSWLib.load(directory, embeddings)
    return store
  }
}

export class MarkdownLoader extends BaseDocumentLoader {
  private filePath: string

  constructor(filePath: string) {
    super()
    this.filePath = filePath
  }

  async load(): Promise<Document[]> {
    const content = await fs.readFile(this.filePath, 'utf-8')
    const metadata = {
      source: this.filePath,
      type: 'markdown',
      created: new Date().toISOString()
    }
    
    return [new Document({ pageContent: content, metadata })]
  }
} 