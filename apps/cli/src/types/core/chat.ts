import { DocumentLink } from '../utils';

export type ChatMode = 'exploration' | 'refinement' | 'suggestion' | 'context';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    type?: 'goal' | 'vision' | 'technical' | 'design' | 'documentation';
    context?: string;
    references?: DocumentLink[];
    id?: string;
    parentId?: string;
    threadId?: string;
    replyToId?: string;
    replyTo?: ChatMessage;
    children?: ChatMessage[];
    isDeleted?: boolean;
    isEdited?: boolean;
    editedAt?: string;
    editedBy?: string;
    deletedAt?: string;
    deletedBy?: string;
  };
}

export interface ChatSession {
  id: string;
  mode: ChatMode;
  metadata: {
    generatedDocs?: string[];
    [key: string]: any;
  };
}

export interface ChatResponse {
  type: 'message' | 'suggestion' | 'preview' | 'error';
  content: string;
  metadata: {
    timestamp: string;
    error?: boolean;
    context?: string;
    suggestions?: string[];
    nextSteps?: string[];
    progress?: number;
  };
}
