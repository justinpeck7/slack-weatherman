import { CronJob } from 'cron';
import DAO from '../dao';

export const clearMonthlyLogs = () => {
  new CronJob(
    '0 0 * * *',
    () => {
      DAO.run(
        `DELETE FROM network_logs where timestamp <= datetime('now', '-30 day')`
      );
      DAO.run(
        `DELETE FROM app_logs where timestamp <= datetime('now', '-30 day')`
      );
    },
    null,
    true,
    'America/Chicago'
  );
};
