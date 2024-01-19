import { WebClient } from '@slack/web-api';
import { Channel } from '@slack/web-api/dist/types/response/ConversationsInfoResponse';
import { CronJob } from 'cron';
import { logEvent } from '../../db/logs';
import birthdays from '../../secrets/birthdays.json';

export default {
  name: 'birthdays',
  install: async ({ webClient }: { webClient: WebClient }) => {
    const res = await webClient.conversations.list({});
    const dtChat: Channel | undefined = res.channels?.find(
      (channel) => channel.name === 'dt_chat'
    );

    if (!dtChat) {
      logEvent('ERR birthdays plugin: could not locate dt_chat channel');
      return;
    }
    new CronJob(
      '0 8 * * *',
      async () => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const birthday = birthdays[`${month}-${day}` as keyof typeof birthdays];
        logEvent(`Checking birthdays for ${month}-${day}...`);

        if (birthday) {
          logEvent(`Yay! Happy birthday ${birthday}`);
          await webClient.chat.postMessage({
            text: `Happy birthday ${birthday}!`,
            channel: dtChat.id as string,
          });
        } else {
          logEvent('No birthdays found');
        }
      },
      null,
      true,
      'America/Chicago'
    );
  },
};
