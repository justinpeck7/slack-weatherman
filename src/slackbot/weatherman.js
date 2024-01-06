import WeathermanDAO from '../server/dao.js';
import handleMessage from './message-handler.js';
import installPlugins from './install-plugins.js';
import { SocketModeClient } from '@slack/socket-mode';
import { LogLevel, WebClient } from '@slack/web-api';

function noop() {}

const logger = {
  warn(...msgs) {
    WeathermanDAO.log('warn: ' + JSON.stringify(msgs));
  },
  error(...msgs) {
    WeathermanDAO.log('error: ' + JSON.stringify(msgs));
  },
  getLevel() {
    return LogLevel.WARN;
  },
  info: noop,
  debug: noop,
  setLevel: noop,
  setName: noop,
};

const appToken = process.env.SLACK_APP_TOKEN;
const botToken = process.env.BOT_TOKEN;

const webClient = new WebClient(botToken);

const socketClient = new SocketModeClient({
  appToken,
  logger,
  autoReconnectEnabled: true,
  logLevel: LogLevel.WARN,
});

let channels;
webClient.conversations
  .list({ types: 'public_channel,private_channel', limit: 9999 })
  .then((res) => {
    channels = res.channels;
  });

socketClient.on('connecting', () => {
  WeathermanDAO.log('Connecting...');
});

socketClient.on('connected', () => {
  WeathermanDAO.log('Weatherman Connected');
});

socketClient.on('disconnecting', () => {
  WeathermanDAO.log('Disconnecting');
});

socketClient.on('disconnected', () => {
  WeathermanDAO.log('Disconnected');
});

socketClient.on('reconnecting', () => {
  WeathermanDAO.log('Reconnecting...');
});

socketClient.on('error', (error) => {
  WeathermanDAO.log(`Error: ${JSON.stringify(error)}`);
});

socketClient.on('unable_to_socket_mode_start', (error) => {
  WeathermanDAO.log(`unable_to_socket_mode_start: ${JSON.stringify(error)}`);
});

socketClient.on('message', async ({ event, ack }) => {
  await ack();
  handleMessage({ event, webClient, channels });
});

export const startBot = async () => {
  await socketClient.start();
  installPlugins({ socketClient, webClient });
};
