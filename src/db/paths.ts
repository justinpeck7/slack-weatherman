import path from 'path';

export const DB_DIR = path.join(process.cwd(), 'database');
export const DB_PATH = path.join(DB_DIR, 'weatherman.db');
