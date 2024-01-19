import express from 'express';
import path from 'path';
import startScheduledTasks from './scheduled-tasks/index';
import { formatTimestamp } from './utils';
import { getAllLogs } from '../db/logs';

export const startServer = () => {
  startScheduledTasks();

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  app.get('/logs', async (_, res: any) => {
    const logs = await getAllLogs();
    const formattedLogs = logs.map((log) => ({
      ...log,
      formattedTimestamp: formatTimestamp(log.timestamp),
    }));
    res.render('index', { logs: formattedLogs });
  });

  app.listen(8080);
};
