import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { queryAll, queryOne, run } from '.';

dayjs.extend(utc);
dayjs.extend(timezone);

export type LogRow = {
  id: number;
  timestamp: string;
  event: string;
  central_time_formatted: string;
};

/**
 * Log an event to the DB
 * @param {String} event - The event to log
 */
export const logEvent = (event: string) => {
  run(
    `INSERT INTO app_logs(event, timestamp, central_time_formatted)
    VALUES($event, $timestamp, $central_time_formatted)`,
    {
      $event: event,
      $timestamp: new Date().toISOString(),
      $central_time_formatted: dayjs()
        .tz('America/Chicago')
        .format('MM-DD-YYYY hh:mmA'),
    }
  );
};

/**
 * Log network events. Too spammy to add them to the primary log table
 */
export const logNetworkEvent = (event: string) => {
  run(
    `INSERT INTO network_logs(event, timestamp, central_time_formatted)
    VALUES($event, $timestamp, $central_time_formatted)`,
    {
      $event: event,
      $timestamp: new Date().toISOString(),
      $central_time_formatted: dayjs()
        .tz('America/Chicago')
        .format('MM-DD-YYYY hh:mmA'),
    }
  );
};

/**
 * Get all of the logged app events for the past month
 * @returns {Array} all logs
 */
export const getYearlyAppLogs = async (): Promise<LogRow[]> => {
  return await queryAll<LogRow>(
    `SELECT central_time_formatted, event
    FROM app_logs
    WHERE timestamp >= datetime('now', '-1 years')
    ORDER BY timestamp ASC`
  );
};

/**
 * Get all of the logged network events for the psat month
 * @returns {Array} all logs
 */
export const getMonthlyNetworkLogs = async (): Promise<LogRow[]> => {
  return await queryAll<LogRow>(
    `SELECT central_time_formatted, event
    FROM network_logs
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
  return result?.value ?? '';
};

/**
 * Return all app config rows
 */
export const getAllAppConfigVals = async (): Promise<
  Record<string, string>[]
> => {
  return await queryAll<Record<string, string>>('SELECT * FROM app_config');
};
