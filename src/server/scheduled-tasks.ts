import { CronJob } from 'cron';
import { run } from '../db';

const clearMonthlyLogs = () => {
  new CronJob(
    '0 0 * * *',
    () => {
      run(
        `DELETE FROM network_logs where timestamp <= datetime('now', '-1 years')`
      );
      /* run(
        `DELETE FROM app_logs where timestamp <= datetime('now', '-1 years')`
      ); */
    },
    null,
    true,
    'America/Chicago'
  );
};

export const startScheduledTasks = () => {
  clearMonthlyLogs();
};
