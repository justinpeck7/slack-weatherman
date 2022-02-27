import cron from "node-cron";
import birthdays from "../../../secrets/birthdays.js";
import WeathermanDAO from "../../server/dao.js";

export default {
  name: "birthdays",
  install: async ({ webClient }) => {
    const res = await webClient.conversations.list();
    const dtChat = res.channels.find((channel) => channel.name === "dt_chat");

    if (!dtChat) {
      WeathermanDAO.log(
        "ERR birthdays plugin: could not locate dt_chat channel"
      );
      return;
    }
    cron.schedule(
      "0 8 * * *",
      async () => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const birthday = birthdays[`${month}-${day}`];
        WeathermanDAO.log(`Checking birthdays for ${month}-${day}...`);

        if (birthday) {
          WeathermanDAO.log(`Yay! Happy birthday ${birthday}`);

          await webClient.chat.postMessage({
            text: `Happy birthday ${birthday}!`,
            channel: dtChat.id,
          });
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
