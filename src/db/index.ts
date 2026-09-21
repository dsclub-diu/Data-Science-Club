import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Construct absolute path to DB so it works across environments
const dbPath = path.resolve(process.cwd(), 'local.db');
const sqlite = new Database(dbPath);

// Keep the local SQLite database usable when the application is upgraded without
// requiring a destructive reset. Production deployments should run migrations.
const columns = sqlite.prepare("PRAGMA table_info(applications)").all() as Array<{ name: string }>;
if (columns.length > 0 && !columns.some((column) => column.name === 'application_reference')) {
  sqlite.exec("ALTER TABLE applications ADD COLUMN application_reference TEXT");
  sqlite.exec("UPDATE applications SET application_reference = id WHERE application_reference IS NULL");
}
if (columns.length > 0 && !columns.some((column) => column.name === 'email_verified_at')) {
  sqlite.exec("ALTER TABLE applications ADD COLUMN email_verified_at INTEGER");
}
const memberColumns = sqlite.prepare("PRAGMA table_info(members)").all() as Array<{ name: string }>;
if (memberColumns.length > 0 && !memberColumns.some((column) => column.name === 'confirmation_email_status')) {
  sqlite.exec("ALTER TABLE members ADD COLUMN confirmation_email_status TEXT NOT NULL DEFAULT 'PENDING'");
  sqlite.exec("ALTER TABLE members ADD COLUMN confirmation_email_error TEXT");
  sqlite.exec("ALTER TABLE members ADD COLUMN confirmation_email_sent_at INTEGER");
}
if (columns.length > 0) {
  sqlite.exec("CREATE UNIQUE INDEX IF NOT EXISTS applications_application_reference_unique ON applications(application_reference)");
}
if (memberColumns.length > 0) {
  sqlite.exec("CREATE UNIQUE INDEX IF NOT EXISTS members_application_id_unique ON members(application_id)");
}

export const db = drizzle(sqlite, { schema });
