export interface VertexAIConfig {
  project?: string;
  location?: string;
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

export interface GenerateOptions {
  temperature?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  candidateCount?: number;
}

export interface GenerateResponse {
  response: string;
  metadata: {
    tokenCount: number;
    finishReason: string;
    safetyAttributes?: Record<string, number>;
  };
}

export interface EmbeddingResponse {
  embedding: number[];
  metadata: {
    dimensions: number;
    truncated: boolean;
  };
}
