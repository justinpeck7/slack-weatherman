import { queryAll, queryOne, run } from '.';

export type LogRow = {
  id: number;
  timestamp: string;
  event: string;
};

/**
 * Log an event to the DB
 * @param {String} event - The event to log
 */
export const logEvent = (event: string) => {
  run('INSERT INTO app_logs(event, timestamp) VALUES($event, $timestamp)', {
    $event: event,
    $timestamp: new Date().toISOString(),
  });
};

/**
 * Log network events. Too spammy to add them to the primary log table
 */
export const logNetworkEvent = (event: string) => {
  run('INSERT INTO network_logs(event, timestamp) VALUES($event, $timestamp)', {
    $event: event,
    $timestamp: new Date().toISOString(),
  });
};

/**
 * Get all of the logged app events for the past month
 * @returns {Array} all logs
 */
export const getMonthlyAppLogs = async (): Promise<LogRow[]> => {
  return await queryAll<LogRow>(
    `SELECT * from app_logs
    WHERE timestamp >= datetime('now', '-1 month')
    ORDER BY timestamp ASC`
  );
};

/**
 * Get all of the logged network events for the psat month
 * @returns {Array} all logs
 */
export const getMonthlyNetworkLogs = async (): Promise<LogRow[]> => {
  return await queryAll<LogRow>(
    `SELECT * from network_logs
    WHERE timestamp >= datetime('now', '-1 month')
    ORDER BY timestamp ASC`
  );
};

/**
 * Key/Value store setter
 */
export const setConfigVal = async (
  itemKey: string,
  value: string
): Promise<{ id: number }> => {
  const sql = `
  INSERT INTO app_config (item_key, value) VALUES ($itemKey, $value)
  ON CONFLICT(item_key) DO UPDATE SET value = excluded.value;`;
  return await run(sql, { $itemKey: itemKey, $value: value });
};

/**
 * Key/Value store getter
 */
export const getConfigVal = async (itemKey: string): Promise<string> => {
  const result = await queryOne<{ value: string }>(
    `SELECT value FROM app_config WHERE item_key = $itemKey`,
    { $itemKey: itemKey }
  );
  return result.value;
};

/**
 * Return all app config rows
 */
export const getAllConfigVals = async (): Promise<Record<string, string>[]> => {
  return await queryAll<Record<string, string>>('SELECT * FROM app_config');
};
