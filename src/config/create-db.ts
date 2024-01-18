import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

export const createDB = async () => {
  return new Promise<void>((resolve, reject) => {
    const DB_PATH = path.join(process.cwd(), 'db');

    if (!fs.existsSync(DB_PATH)) {
      fs.mkdirSync(DB_PATH);
    }

    const db = new sqlite3.Database(
      path.join(`${DB_PATH}/weatherman.db`),
      (err) => {
        if (err) {
          reject(err);
        }
      }
    );

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
