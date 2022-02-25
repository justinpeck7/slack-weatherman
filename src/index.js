import { startBot } from "./slackbot/weatherman.js";
import { startServer } from "./server/express.js";

export const start = () => {
  startServer();
  startBot();
};
