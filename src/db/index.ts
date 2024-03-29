import sqlite3 from 'sqlite3';
import { DB_PATH } from './paths';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('Connected to DB');
  }
});

/**
 * Runs a query. Returns no result rows.
 * @param {String} sql - the query
 * @param {Object} params - params object to pass to the SQL
 */
export const run = (
  sql: string,
  params: Record<string, string | number> = {}
): Promise<{ id: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
};

/**
 * Runs a query and returns all result rows
 * @param {*} sql - the query
 * @param {*} params - params object to pass to the SQL
 * @returns
 */
export const queryAll = <T>(
  sql: string,
  params: Record<string, string | number> = {}
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows: T[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

/**
 * Runs a query and returns the first result row
 * @param {*} sql - the query
 * @param {*} params - array of params to pass to the SQL
 * @returns
 */
export const queryOne = <T>(
  sql: string,
  params: Record<string, string | number> = {}
): Promise<T> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row: T) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};
