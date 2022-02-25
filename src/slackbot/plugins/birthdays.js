import cron from "node-cron";
import { getChannel } from "../slack-utils.js";
import birthdays from "../../../secrets/birthdays.js";
import WeathermanDAO from "../../server/dao.js";

export default {
  name: "birthdays",
  install: async ({ rtm, token }) => {
    const dtChat = await getChannel("dt_chat", token);
    if (!dtChat) {
      WeathermanDAO.log(
        "ERR birthdays plugin: could not locate dt_chat channel"
      );
      return;
    }
    cron.schedule(
      "0 8 * * *",
      () => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const birthday = birthdays[`${month}-${day}`];
        WeathermanDAO.log(`Checking birthdays for ${month}-${day}...`);

        if (birthday) {
          WeathermanDAO.log(`Yay! Happy birthday ${birthday}`);
          rtm.sendMessage(`Happy birthday ${birthday}!`, dtChat.id);
        } else {
          WeathermanDAO.log("No birthdays found");
        }
      },
      {
        timezone: "America/Chicago",
      }
    );
  },
};
