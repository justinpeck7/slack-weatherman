import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { DB_DIR, DB_PATH } from './paths';

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

const tableInitSql = `
CREATE TABLE IF NOT EXISTS app_logs (
  id INTEGER PRIMARY KEY,
  timestamp TEXT,
  event TEXT
);

CREATE TABLE IF NOT EXISTS network_logs (
  id INTEGER PRIMARY KEY,
  timestamp TEXT,
  event TEXT
);

CREATE TABLE IF NOT EXISTS app_config (
  item_key TEXT PRIMARY KEY,
  value TEXT
);
`;

const db = new sqlite3.Database(path.join(`${DB_PATH}`), (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Database connection established');
  }
});

db.exec(tableInitSql, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Tables created');
  }
});

db.close((err) => {
  if (err) {
    console.error('Error closing database', err);
  } else {
    console.log('Database connection closed');
  }
});
