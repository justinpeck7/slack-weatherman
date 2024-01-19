import { WebClient } from '@slack/web-api';
import { Channel } from '@slack/web-api/dist/types/response/ChannelsInfoResponse.js';
import { logEvent } from '../db/logs';
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
}: {
  event: { text?: string; channel_type: string; channel: string };
  webClient: WebClient;
  channels: Channel[];
}) => {
  if (!event?.text) {
    return;
  }
  const command: string = getCommandStr(event.text);
  const input = event.text.replace(`!${command}`, '').trim();

  /* short circuit */
  if (command === 'say' && event.channel_type === 'im') {
    say({ event, input, channels, webClient });
    return;
  }

  if (!isValidCommand(command)) return;

  if (botFns[command]) {
    const response = await botFns[command](input);
    try {
      logEvent(`CMD: ${event.text} => ${response}`);

      await webClient.chat.postMessage({
        text: response,
        channel: event.channel,
      });
    } catch (e) {
      logEvent(
        `ERR: ${command} command with input ${
          event.text
        }, error: ${JSON.stringify(e)}`
      );
    }
  }
};

export default handleMessage;
