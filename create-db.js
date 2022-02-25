import path from "path";
import sqlite3 from "sqlite3";
import fs from "fs";

export const createDB = async () => {
  return new Promise((resolve, reject) => {
    const DB_PATH = path.join(process.cwd(), "db");

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
      `CREATE TABLE IF NOT EXISTS logs (
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
  });
};
