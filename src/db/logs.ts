import { queryAll, run } from '.';

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
 * Get all of the logged events
 * @returns {Array} all logs
 */
export const getAllLogs = async (): Promise<LogRow[]> => {
  return await queryAll<LogRow>(
    'SELECT * from app_logs ORDER BY timestamp ASC'
  );
};
