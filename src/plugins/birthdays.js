import cron from "node-cron";
import { getChannel } from "../slack-utils";
import birthdays from "./birthdays.json";

export default {
  install: async ({ rtm, log, token }) => {
    const dtChat = await getChannel("dt_chat", token);
    if (!dtChat) {
      log("ERR birthdays plugin: could not locate dt_chat channel");
      return;
    }
    cron.schedule("0 8 * * *", () => {
      const date = new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const birthday = birthdays[`${month}-${day}`];
      log(`Checking birthdays for ${month}-${day}...`);

      if (birthday) {
        log(`Yay! Happy birthday ${birthday}`);
        /* rtm.sendMessage(`Happy birthday ${birthday}!`, dtChat.id); */
      } else {
        log("No birthdays found");
      }
    });
  },
};
