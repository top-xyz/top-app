import { CLIConfig } from './types';

const config: CLIConfig = {
  templatesDir: 'templates',
  contextDir: 'context',
  cacheDir: 'cache',
  embeddings: {
    provider: 'vertex',
    model: 'textembedding-gecko',
    dimensions: 768,
    similarity: 'cosine'
  },
  defaultTemplate: 'project',
  validateTemplate: true,
  validateLinks: true,
  strictMode: true,
  format: 'markdown',
  colors: true,
  preview: {
    enabled: true,
    type: 'markdown'
  },
  collaboration: {
    enabled: false,
    realtime: false,
    presence: false,
    comments: false
  },
  streaming: {
    enabled: true,
    chunkSize: 80,
    delay: 50
  },
  api: {
    url: process.env.API_URL || 'http://localhost:3000',
    version: process.env.API_VERSION || 'v1'
  }
};

export default config; 