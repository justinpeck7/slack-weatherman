import path from 'path';
import sqlite3, { Database } from 'sqlite3';

type LogRow = {
  id: number;
  timestamp: string;
  event: string;
};

class DAO {
  db: Database;

  constructor() {
    const DB_PATH = path.join(process.cwd(), 'db', 'weatherman.db');

    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        throw err;
      } else {
        console.log('Connected to DB');
      }
    });
  }

  /**
   * Runs a query and returns all result rows
   * @param {*} sql - the query
   * @param {*} params - array of params to pass to the SQL
   * @returns
   */
  runQueryAll(sql: string, params: string[] = []): Promise<LogRow[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows: LogRow[]) => {
        if (err) {
          this.logEvent(`[dao.runQueryAll] Error running sql: ${sql}`);
          this.logEvent(err.message);
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
  run(sql: string, params: Record<string, any> = {}): Promise<{ id: number }> {
    const log = this.logEvent;
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          log(`[dao.run] Error running sql: ${sql}`);
          log(err.message);
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
  async getAllLogs(): Promise<LogRow[]> {
    return await this.runQueryAll('SELECT * from logs ORDER BY timestamp ASC');
  }

  /**
   * Log an event to the DB
   * @param {String} event - The event to log
   */
  logEvent(event: string) {
    this.run('INSERT INTO logs(event, timestamp) VALUES($event, $timestamp)', {
      $event: event,
      $timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log network events. Too spammy to add them to the primary log table
   */
  logNetworkEvent(event: string) {
    this.run(
      'INSERT INTO network_logs(event, timestamp) VALUES($event, $timestamp)',
      {
        $event: event,
        $timestamp: new Date().toISOString(),
      }
    );
  }
}

export default new DAO();
