import { CronJob } from 'cron';
import { run } from '../../db';

export const clearMonthlyLogs = () => {
  new CronJob(
    '0 0 * * *',
    () => {
      run(
        `DELETE FROM network_logs where timestamp <= datetime('now', '-30 day')`
      );
      run(`DELETE FROM app_logs where timestamp <= datetime('now', '-30 day')`);
    },
    null,
    true,
    'America/Chicago'
  );
};
