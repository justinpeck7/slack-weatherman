import express from 'express';
import path from 'path';
import { getAllConfigVals, getMonthlyAppLogs } from '../db/fns';
import { startScheduledTasks } from './scheduled-tasks';
import { formatTimestamp } from './utils';

export const startServer = () => {
  startScheduledTasks();

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  app.get('/dashboard', async (_, res: any) => {
    const logs = await getMonthlyAppLogs();
    const formattedLogs = logs.map((log) => ({
      ...log,
      formattedTimestamp: formatTimestamp(log.timestamp),
    }));
    const appConfig = await getAllConfigVals();
    res.render('index', { logs: formattedLogs, appConfig });
  });

  app.listen(8080);
};
