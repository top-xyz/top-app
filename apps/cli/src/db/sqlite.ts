import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { debug } from '../utils/debug';
import chalk from 'chalk';

// Export interfaces
export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  project_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface ProjectContext {
  id: string;
  project_id: string;
  type: string;
  category: string;
  priority: number;
  content: string;
  embeddings: string;
  metadata: string;
  created_at: string;
  updated_at: string;
}

export interface ContextRelationship {
  id: string;
  source_context_id: string;
  target_context_id: string;
  relationship_type: string;
  strength: number;
  created_at: string;
}

export class SQLiteDB {
  private db: Database.Database;
  private initialized: boolean = false;
  
  constructor(dbPath: string) {
    debug('SQLite', 'Initializing SQLite database at:', dbPath);
    
    // Ensure the database directory exists synchronously
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      debug('SQLite', 'Creating database directory:', dbDir);
      fs.mkdirSync(dbDir, { recursive: true });
    }

    try {
      debug('SQLite', 'Opening database connection');
      this.db = new Database(dbPath);
      this.initialized = true;
      debug('SQLite', 'Database connection established');
    } catch (error) {
      debug('SQLite', 'Failed to initialize database:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  private initSync() {
    try {
      // Enable foreign keys
      this.db.pragma('foreign_keys = ON');

      // Create tables if they don't exist
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS chat_messages (
          id TEXT PRIMARY KEY,
          project_id TEXT NOT NULL,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TEXT NOT NULL,
          FOREIGN KEY (project_id) REFERENCES projects(id)
        );

        CREATE TABLE IF NOT EXISTS project_contexts (
          id TEXT PRIMARY KEY,
          project_id TEXT NOT NULL,
          type TEXT NOT NULL,
          category TEXT NOT NULL,
          priority INTEGER DEFAULT 1,
          content TEXT NOT NULL,
          embeddings TEXT NOT NULL,
          metadata TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (project_id) REFERENCES projects(id)
        );

        CREATE TABLE IF NOT EXISTS context_relationships (
          id TEXT PRIMARY KEY,
          source_context_id TEXT NOT NULL,
          target_context_id TEXT NOT NULL,
          relationship_type TEXT NOT NULL,
          strength REAL DEFAULT 1.0,
          created_at TEXT NOT NULL,
          FOREIGN KEY (source_context_id) REFERENCES project_contexts(id),
          FOREIGN KEY (target_context_id) REFERENCES project_contexts(id)
        );
      `);

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  createProject(name: string, description: string = ''): Project {
    if (!this.initialized) {
      throw new Error('Database not initialized');
    }

    const now = new Date().toISOString();
    const project: Project = {
      id: uuidv4(),
      name,
      description,
      created_at: now,
      updated_at: now
    };

    this.db.prepare(`
      INSERT INTO projects (id, name, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(project.id, project.name, project.description, project.created_at, project.updated_at);

    return project;
  }

  getProject(id: string): Project | null {
    if (!this.initialized) {
      throw new Error('Database not initialized');
    }

    return this.db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | null;
  }

  // Chat message operations
  addChatMessage(projectId: string, role: 'user' | 'assistant' | 'system', content: string): ChatMessage {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      project_id: projectId,
      role,
      content,
      created_at: new Date().toISOString()
    };

    this.db.prepare(`
      INSERT INTO chat_messages (id, project_id, role, content, created_at)
      VALUES (@id, @project_id, @role, @content, @created_at)
    `).run(message);

    return message;
  }

  getProjectMessages(projectId: string): ChatMessage[] {
    return this.db.prepare('SELECT * FROM chat_messages WHERE project_id = ? ORDER BY created_at').all(projectId) as ChatMessage[];
  }

  // Enhanced context operations
  addProjectContext(
    projectId: string,
    type: string,
    content: string,
    embeddings: number[],
    category: string = 'general',
    priority: number = 1,
    metadata: Record<string, any> = {}
  ): ProjectContext {
    const now = new Date().toISOString();
    const context: ProjectContext = {
      id: crypto.randomUUID(),
      project_id: projectId,
      type,
      category,
      priority,
      content,
      embeddings: JSON.stringify(embeddings),
      metadata: JSON.stringify(metadata),
      created_at: now,
      updated_at: now
    };

    this.db.prepare(`
      INSERT INTO project_contexts (
        id, project_id, type, category, priority, content, 
        embeddings, metadata, created_at, updated_at
      )
      VALUES (
        @id, @project_id, @type, @category, @priority, @content,
        @embeddings, @metadata, @created_at, @updated_at
      )
    `).run(context);

    return context;
  }

  addContextRelationship(
    sourceContextId: string,
    targetContextId: string,
    relationshipType: string,
    strength: number = 1.0
  ): void {
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO context_relationships (
        id, source_context_id, target_context_id, 
        relationship_type, strength, created_at
      )
      VALUES (
        @id, @sourceContextId, @targetContextId,
        @relationshipType, @strength, @created_at
      )
    `).run({
      id: crypto.randomUUID(),
      sourceContextId,
      targetContextId,
      relationshipType,
      strength,
      created_at: now
    });
  }

  searchSimilarContexts(
    projectId: string,
    embeddings: number[],
    options: {
      limit?: number;
      category?: string;
      minPriority?: number;
      includeRelated?: boolean;
    } = {}
  ): ProjectContext[] {
    const {
      limit = 10,
      category,
      minPriority = 0,
      includeRelated = true
    } = options;

    // Convert embeddings to JSON for comparison
    const embeddingsJson = JSON.stringify(embeddings);
    
    // Build the query based on options
    let query = `
      WITH similarity AS (
        SELECT 
          *,
          (
            SELECT json_each.value * json_each2.value
            FROM json_each(embeddings), json_each(@embeddingsJson) as json_each2
            WHERE json_each.key = json_each2.key
          ) * priority as weighted_score  -- Weight by priority
        FROM project_contexts
        WHERE project_id = @projectId
        ${category ? 'AND category = @category' : ''}
        ${minPriority > 0 ? 'AND priority >= @minPriority' : ''}
      )
    `;

    if (includeRelated) {
      // Include related contexts through relationships
      query += `
        , related AS (
          SELECT 
            pc.*,
            s.weighted_score * cr.strength as weighted_score
          FROM similarity s
          JOIN context_relationships cr ON s.id = cr.source_context_id
          JOIN project_contexts pc ON cr.target_context_id = pc.id
          WHERE pc.project_id = @projectId
        )
        SELECT * FROM (
          SELECT * FROM similarity
          UNION ALL
          SELECT * FROM related
        )
      `;
    } else {
      query += `SELECT * FROM similarity`;
    }

    query += `
      ORDER BY weighted_score DESC
      LIMIT @limit
    `;

    return this.db.prepare(query).all({
      projectId,
      embeddingsJson,
      category,
      minPriority,
      limit
    }) as ProjectContext[];
  }

  getContextsByCategory(projectId: string, category: string): ProjectContext[] {
    return this.db.prepare(`
      SELECT * FROM project_contexts 
      WHERE project_id = ? AND category = ?
      ORDER BY priority DESC, created_at DESC
    `).all(projectId, category) as ProjectContext[];
  }

  getRelatedContexts(contextId: string): ProjectContext[] {
    return this.db.prepare(`
      SELECT pc.* 
      FROM project_contexts pc
      JOIN context_relationships cr ON pc.id = cr.target_context_id
      WHERE cr.source_context_id = ?
      ORDER BY cr.strength DESC
    `).all(contextId) as ProjectContext[];
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

// Create and export database instance
export const db = new SQLiteDB(process.env.DB_PATH || path.join(process.cwd(), 'data', 'top.db')); 