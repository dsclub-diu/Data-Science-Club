import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Construct absolute path to DB so it works across environments
const dbPath = path.resolve(process.cwd(), 'local.db');
const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });
