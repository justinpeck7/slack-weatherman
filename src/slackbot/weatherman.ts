import { Logger, SocketModeClient } from '@slack/socket-mode';
import { LogLevel, WebClient } from '@slack/web-api';
import { Channel } from '@slack/web-api/dist/types/response/ChannelsInfoResponse.js';
import { Member } from '@slack/web-api/dist/types/response/UsersListResponse';
import { logNetworkEvent } from '../db/fns';
import installPlugins from './install-plugins';
import handleMessage from './message-handler';

function noop() {}

const logger: Logger = {
  warn(...msgs) {
    logNetworkEvent(`Socket Warn: ${JSON.stringify(msgs)}`);
  },
  error(...msgs) {
    logNetworkEvent(`Socket Error: ${JSON.stringify(msgs)}`);
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
let users: Member[];

webClient.conversations
  .list({ types: 'public_channel,private_channel', limit: 9999 })
  .then((res) => {
    channels = res.channels || [];
  });

webClient.users.list({}).then((res) => {
  users = res.members || [];
});

socketClient.on('connected', () => {
  console.log('Weatherman Connected');
});

socketClient.on('error', (error) => {
  logNetworkEvent(`Socket error: ${JSON.stringify(error)}`);
});

socketClient.on('unable_to_socket_mode_start', (error) => {
  logNetworkEvent(`unable_to_socket_mode_start: ${JSON.stringify(error)}`);
});

socketClient.on('message', async ({ event, ack }) => {
  await ack();
  handleMessage({ event, webClient, channels, users });
});

export const startBot = async () => {
  await socketClient.start();
  installPlugins({ socketClient, webClient });
};
