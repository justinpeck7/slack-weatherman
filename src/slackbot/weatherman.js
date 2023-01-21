import WeathermanDAO from "../server/dao.js";
import handleMessage from "./message-handler.js";
import installPlugins from "./install-plugins.js";
import { SocketModeClient } from "@slack/socket-mode";
import { WebClient } from "@slack/web-api";

const logger = {
  debug(...msgs) {
    WeathermanDAO.log("debug: " + JSON.stringify(msgs));
  },
  info(...msgs) {
    WeathermanDAO.log("info: " + JSON.stringify(msgs));
  },
  warn(...msgs) {
    WeathermanDAO.log("warn: " + JSON.stringify(msgs));
  },
  error(...msgs) {
    WeathermanDAO.log("error: " + JSON.stringify(msgs));
  },
  setLevel() {},
  setName() {},
};

const appToken = process.env.SLACK_APP_TOKEN;
const botToken = process.env.BOT_TOKEN;

const webClient = new WebClient(botToken);

const socketClient = new SocketModeClient({
  appToken,
  logger,
  autoReconnectEnabled: true,
});

socketClient.on("connecting", () => {
  WeathermanDAO.log("Connecting...");
});

socketClient.on("connected", () => {
  WeathermanDAO.log("Weatherman Connected");
});

socketClient.on("disconnecting", () => {
  WeathermanDAO.log("Disconnecting");
});

socketClient.on("disconnected", () => {
  WeathermanDAO.log("Disconnected");
});

socketClient.on("reconnecting", () => {
  WeathermanDAO.log("Reconnecting...");
});

socketClient.on("error", (error) => {
  WeathermanDAO.log(`Error: ${JSON.stringify(error)}`);
});

socketClient.on("unable_to_socket_mode_start", (error) => {
  WeathermanDAO.log(`unable_to_socket_mode_start: ${JSON.stringify(error)}`);
});

socketClient.on("message", async ({ event, ack }) => {
  await ack();
  handleMessage({ event, webClient });
});

export const startBot = async () => {
  await socketClient.start();
  installPlugins({ socketClient, webClient });
};
