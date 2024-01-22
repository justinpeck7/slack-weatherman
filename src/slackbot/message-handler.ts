import { WebClient } from '@slack/web-api';
import { Channel } from '@slack/web-api/dist/types/response/ChannelsInfoResponse.js';
import { Member } from '@slack/web-api/dist/types/response/UsersListResponse';
import { logEvent } from '../db/fns';
import config from './commands/config';
import define from './commands/define';
import say from './commands/say';
import weather from './commands/weather';

const botFns = { define, weather, config };
type CommandName = keyof typeof botFns;

const getCommandStr = (input: string): string => {
  if (input[0] === '!') {
    return input.split(' ')[0].slice(1)?.toLowerCase();
  }
  return '';
};

const isValidCommand = (cmd: string): cmd is CommandName => {
  return ['define', 'weather', 'config'].includes(cmd);
};

const handleMessage = async ({
  event,
  webClient,
  channels = [],
  users = [],
}: {
  event: { text?: string; channel_type: string; channel: string; user: string };
  webClient: WebClient;
  channels: Channel[];
  users: Member[];
}) => {
  if (!event?.text) {
    return;
  }
  const command: string = getCommandStr(event.text);
  const input = event.text.replace(`!${command}`, '').trim();
  const userName = users.find(({ id }) => id === event.user)?.name;
  const channelName = channels.find(({ id }) => id === event.channel)?.name;

  /* short circuit */
  if (command === 'say' && event.channel_type === 'im') {
    logEvent(`${userName}: ${event.text}`);
    say({ event, input, channels, webClient });
    return;
  }

  if (!isValidCommand(command)) return;

  if (botFns[command]) {
    const response = await botFns[command](input);
    try {
      logEvent(`${userName} in ${channelName}: "${event.text}" // ${response}`);

      await webClient.chat.postMessage({
        text: response,
        channel: event.channel,
      });
    } catch (e) {
      logEvent(
        `ERR ${userName} in ${channelName}: "${event.text}" // ${JSON.stringify(
          e
        )}`
      );
    }
  }
};

export default handleMessage;
