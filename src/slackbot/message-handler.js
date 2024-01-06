import define from './commands/define.js';
import weather from './commands/weather.js';
import say from './commands/say.js';
import WeathermanDAO from '../server/dao.js';
import config from './commands/config.js';

const botFns = { define, weather, config };

const getCommand = (input) => {
  if (input[0] === '!') {
    return input.split(' ')[0].slice(1)?.toLowerCase();
  }
  return null;
};

const handleMessage = async ({ event, webClient, channels = [] }) => {
  if (!event?.text) {
    return;
  }
  const command = getCommand(event.text);
  if (!command) return;
  const input = event.text.replace(`!${command}`, '').trim();

  // non-standard, bypass response logic
  if (command === 'say' && event.channel_type === 'im') {
    say({ event, input, channels, webClient });
    return;
  }

  if (botFns[command]) {
    const response = await botFns[command](input);
    try {
      WeathermanDAO.log(`CMD: ${event.text} => ${response}`);

      await webClient.chat.postMessage({
        text: response,
        channel: event.channel,
      });
    } catch (e) {
      WeathermanDAO.log(
        `ERR: ${command} command with input ${
          event.text
        }, error: ${JSON.stringify(e)}`
      );
    }
  }
};

export default handleMessage;
