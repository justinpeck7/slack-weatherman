import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import WeathermanDAO from './dao.js';
import startScheduledTasks from './scheduled-tasks/index.js';
import { formatTimestamp } from './utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const startServer = () => {
  startScheduledTasks();

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  app.get('/logs', async (_, res) => {
    const logs = await WeathermanDAO.getAllLogs();
    const formattedLogs = logs.map((log) => ({
      ...log,
      formattedTimestamp: formatTimestamp(log.timestamp),
    }));
    res.render('index', { logs: formattedLogs.slice(0, 20) });
  });

  app.listen(8080);
};
