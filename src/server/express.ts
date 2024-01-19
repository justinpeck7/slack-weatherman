import express from 'express';
import path from 'path';
import { getAllLogs } from '../db/logs';
import { startScheduledTasks } from './scheduled-tasks';
import { formatTimestamp } from './utils';

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
