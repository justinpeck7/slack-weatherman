import { Logger, SocketModeClient } from '@slack/socket-mode';
import { LogLevel, WebClient } from '@slack/web-api';
import { Channel } from '@slack/web-api/dist/types/response/ChannelsInfoResponse.js';
import DAO from '../server/dao';
import installPlugins from './install-plugins';
import handleMessage from './message-handler';

function noop() {}

const logger: Logger = {
  warn(...msgs) {
    DAO.logNetworkEvent(`Socket Warn: ${JSON.stringify(msgs)}`);
  },
  error(...msgs) {
    DAO.logNetworkEvent(`Socket Error: ${JSON.stringify(msgs)}`);
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

const webClient: WebClient = new WebClient(botToken);

const socketClient = new SocketModeClient({
  appToken,
  logger,
  autoReconnectEnabled: true,
  logLevel: LogLevel.WARN,
});

let channels: Channel[];
webClient.conversations
  .list({ types: 'public_channel,private_channel', limit: 9999 })
  .then((res) => {
    channels = res.channels || [];
  });

socketClient.on('connecting', () => {
  DAO.logNetworkEvent('Connecting...');
});

socketClient.on('connected', () => {
  DAO.logNetworkEvent('Weatherman Connected');
});

socketClient.on('disconnecting', () => {
  DAO.logNetworkEvent('Disconnecting');
});

socketClient.on('disconnected', () => {
  DAO.logNetworkEvent('Disconnected');
});

socketClient.on('reconnecting', () => {
  DAO.logNetworkEvent('Reconnecting...');
});

socketClient.on('error', (error) => {
  DAO.logNetworkEvent(`Error: ${JSON.stringify(error)}`);
});

socketClient.on('unable_to_socket_mode_start', (error) => {
  DAO.logNetworkEvent(`unable_to_socket_mode_start: ${JSON.stringify(error)}`);
});

socketClient.on('message', async ({ event, ack }) => {
  await ack();
  handleMessage({ event, webClient, channels });
});

export const startBot = async () => {
  await socketClient.start();
  installPlugins({ socketClient, webClient });
};
