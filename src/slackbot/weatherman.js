import WeathermanDAO from "../server/dao.js";
import handleMessage from "./message-handler.js";
import installPlugins from "./install-plugins.js";
import { SocketModeClient } from "@slack/socket-mode";
import { WebClient } from "@slack/web-api";

const appToken = process.env.SLACK_APP_TOKEN;
const botToken = process.env.BOT_TOKEN;

const webClient = new WebClient(botToken);

const socketClient = new SocketModeClient({
  appToken,
  autoReconnectEnabled: true,
});

socketClient.on("connected", () => {
  WeathermanDAO.log("Weatherman Connected");
});

socketClient.on("disconnected", () => {
  WeathermanDAO.log("Disconnected");
});

socketClient.on("reconnecting", () => {
  WeathermanDAO.log("Reconnecting...");
});

socketClient.on("message", async ({ event, ack }) => {
  await ack();
  handleMessage({ event, webClient });
});

export const startBot = async () => {
  await socketClient.start();
  installPlugins({ socketClient, webClient });
};
