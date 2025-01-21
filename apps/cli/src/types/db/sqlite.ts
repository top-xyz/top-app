export interface DBConfig {
  filename: string;
  memory?: boolean;
  readonly?: boolean;
  fileMustExist?: boolean;
}

export interface QueryResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  changes?: number;
  lastID?: number;
}

export interface DBMigration {
  id: number;
  name: string;
  timestamp: string;
  sql: string;
}
