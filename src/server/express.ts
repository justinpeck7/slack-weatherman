import express from 'express';
import path from 'path';
import {
  getAllAppConfigVals,
  getMonthlyNetworkLogs,
  getYearlyAppLogs,
} from '../db/fns';
import { startScheduledTasks } from './scheduled-tasks';

export const startServer = () => {
  startScheduledTasks();

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  app.get('/dashboard', async (_, res) => {
    const [appLogs, networkLogs, appConfig] = await Promise.all([
      getYearlyAppLogs(),
      getMonthlyNetworkLogs(),
      getAllAppConfigVals(),
    ]);
    res.render('dashboard', { appLogs, networkLogs, appConfig });
  });

  app.listen(8080, '0.0.0.0');
};
