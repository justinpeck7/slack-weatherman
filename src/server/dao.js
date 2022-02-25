import sqlite3 from "sqlite3";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

class WeathermanDAO {
  constructor() {
    const DB_PATH = path.join(__dirname, "..", "..", "db", "weatherman.db");

    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        throw new Error(err);
      } else {
        console.log("Connected to DB");
      }
    });
  }

  /**
   * Runs a query and returns all result rows
   * @param {*} sql - the query
   * @param {*} params - array of params to pass to the SQL
   * @returns
   */
  runQueryAll(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          this.log(`[dao.runQueryAll] Error running sql: ${sql}`);
          this.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Runs a query. Returns no result rows.
   * @param {String} sql - the query
   * @param {Array} params - array of params to pass to the SQL
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          this.log(`[dao.run] Error running sql: ${sql}`);
          this.log(err);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  /**
   * Get all of the logged events
   * @returns {Array} all logs
   */
  async getAllLogs() {
    return await this.runQueryAll("SELECT * from logs ORDER BY timestamp ASC");
  }

  /**
   * Log an event to the DB
   * @param {String} event - The event to log
   */
  log(event) {
    if (typeof event !== "string") {
      throw new Error(
        `Error logging value: ${event}. You may only log strings events`
      );
    }
    const sql = `INSERT INTO logs(event, timestamp) VALUES(?, ?)`;
    const params = [event, new Date().toISOString()];
    this.run(sql, params);
  }
}

export default new WeathermanDAO();
