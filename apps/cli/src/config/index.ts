import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenvConfig();

// Configuration schema
const configSchema = z.object({
  // Google Cloud Configuration
  GOOGLE_CLOUD_PROJECT: z.string(),
  GOOGLE_CLOUD_LOCATION: z.string().default('us-central1'),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
  
  // Google Service Account Configuration
  GOOGLE_TYPE: z.string().default('service_account'),
  GOOGLE_PROJECT_ID: z.string(),
  GOOGLE_PRIVATE_KEY_ID: z.string(),
  GOOGLE_PRIVATE_KEY: z.string(),
  GOOGLE_CLIENT_EMAIL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_AUTH_URI: z.string().default('https://accounts.google.com/o/oauth2/auth'),
  GOOGLE_TOKEN_URI: z.string().default('https://oauth2.googleapis.com/token'),
  GOOGLE_AUTH_PROVIDER_X509_CERT_URL: z.string().default('https://www.googleapis.com/oauth2/v1/certs'),
  GOOGLE_CLIENT_X509_CERT_URL: z.string(),
  GOOGLE_UNIVERSE_DOMAIN: z.string().default('googleapis.com'),
  
  // LLM Configuration
  VERTEX_AI_PROJECT: z.string(),
  VERTEX_AI_LOCATION: z.string().default('us-central1'),
  
  // Database Configuration
  DB_PATH: z.string().default('./data/top.db'),
  
  // Vector Store Configuration
  VECTOR_STORE_PATH: z.string().default('./data/vector-store'),
  
  // Cache Configuration
  CACHE_DIR: z.string().default('./cache'),
  
  // Template Configuration
  TEMPLATE_DIR: z.string().default('./templates'),
});

// Parse and validate configuration
const appConfig = configSchema.parse({
  // Google Cloud Configuration
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  GOOGLE_CLOUD_LOCATION: process.env.GOOGLE_CLOUD_LOCATION,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  
  // Google Service Account Configuration
  GOOGLE_TYPE: process.env.GOOGLE_TYPE,
  GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
  GOOGLE_PRIVATE_KEY_ID: process.env.GOOGLE_PRIVATE_KEY_ID,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_AUTH_URI: process.env.GOOGLE_AUTH_URI,
  GOOGLE_TOKEN_URI: process.env.GOOGLE_TOKEN_URI,
  GOOGLE_AUTH_PROVIDER_X509_CERT_URL: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  GOOGLE_CLIENT_X509_CERT_URL: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  GOOGLE_UNIVERSE_DOMAIN: process.env.GOOGLE_UNIVERSE_DOMAIN,
  
  // LLM Configuration
  VERTEX_AI_PROJECT: process.env.VERTEX_AI_PROJECT || process.env.GOOGLE_CLOUD_PROJECT,
  VERTEX_AI_LOCATION: process.env.VERTEX_AI_LOCATION || process.env.GOOGLE_CLOUD_LOCATION,
  
  // Other Configuration
  DB_PATH: process.env.DB_PATH,
  VECTOR_STORE_PATH: process.env.VECTOR_STORE_PATH,
  CACHE_DIR: process.env.CACHE_DIR,
  TEMPLATE_DIR: process.env.TEMPLATE_DIR,
});

export type Config = z.infer<typeof configSchema>;
export default appConfig; 