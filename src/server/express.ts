import express from 'express';
import path from 'path';
import DAO from './dao';
import startScheduledTasks from './scheduled-tasks/index';
import { formatTimestamp } from './utils';

console.log(path.join(__dirname, '../views'));

export const startServer = () => {
  startScheduledTasks();

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  app.get('/logs', async (_, res: any) => {
    const logs = await DAO.getAllLogs();
    const formattedLogs = logs.map((log) => ({
      ...log,
      formattedTimestamp: formatTimestamp(log.timestamp),
    }));
    res.render('index', { logs: formattedLogs });
  });

  app.listen(8080);
};
