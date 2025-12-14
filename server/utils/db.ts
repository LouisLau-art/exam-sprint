import Database from 'better-sqlite3'
import { join } from 'path'

const dbPath = join(process.cwd(), 'data.db')
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    notes TEXT DEFAULT '',
    due_date TEXT,
    priority TEXT DEFAULT 'P1',
    estimated_pomodoros INTEGER DEFAULT 1,
    tags TEXT DEFAULT '[]',
    goal_id TEXT,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    deadline TEXT,
    type TEXT DEFAULT 'task-driven',
    target INTEGER DEFAULT 10,
    current INTEGER DEFAULT 0,
    unit TEXT DEFAULT '任务',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pomodoro_sessions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    duration INTEGER NOT NULL,
    task_id TEXT,
    note TEXT DEFAULT '',
    started_at TEXT NOT NULL,
    completed_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS countdown (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    exam_name TEXT,
    exam_date TEXT
  );

  CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    color TEXT DEFAULT '#6366f1'
  );

  INSERT OR IGNORE INTO countdown (id, exam_name, exam_date) VALUES (1, NULL, NULL);
`)

export { db }
export default db
