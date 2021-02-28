import { startBot } from "./slackbot/weatherman";
import { startServer } from "./server/express";

startServer();
startBot();
