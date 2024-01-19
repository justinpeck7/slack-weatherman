import 'dotenv/config';
import { startServer } from './server/express';
import { startBot } from './slackbot/weatherman';

startServer();
startBot();
