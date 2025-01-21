export interface VectorStoreConfig {
  dimensions: number;
  space: 'cosine' | 'euclidean' | 'dot';
  maxElements?: number;
}

export interface VectorDocument {
  content: string;
  metadata: {
    source: string;
    type: string;
    timestamp: string;
  };
  embedding?: number[];
}

export interface SearchResult {
  document: VectorDocument;
  score: number;
  metadata?: Record<string, any>;
}
