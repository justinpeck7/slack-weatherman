import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { DB_DIR, DB_PATH } from './constants';

const createDB = async () => {
  return new Promise<void>((resolve, reject) => {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR);
    }

    const db = new sqlite3.Database(path.join(`${DB_PATH}`), (err) => {
      if (err) {
        reject(err);
      }
    });

    db.run(
      `CREATE TABLE IF NOT EXISTS app_logs (
      id INTEGER PRIMARY KEY,
      timestamp TEXT,
      event TEXT)`,
      [],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS network_logs (
      id INTEGER PRIMARY KEY,
      timestamp TEXT,
      event TEXT)`,
      [],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS app_config (
      config_key TEXT,
      value TEXT)`,
      [],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

(async () => {
  await createDB();
})();
