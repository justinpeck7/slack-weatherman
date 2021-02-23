import cron from "node-cron";
import { getIms } from "../slack-utils";

export default {
  install: async ({ rtm, log, token, users }) => {
    try {
      const imList = await getIms(token);

      const me = users.find((member) => member.real_name === "Justin Peck");
      const convoWithMe = imList.ims.find((im) => im.user === me.id);

      cron.schedule("0 0 1 * *", () => {
        rtm.sendMessage("Give Scout his meds", convoWithMe.id);
      });
      log(`Plugin "scout-pills-reminder" Installed`);
    } catch (e) {
      log(
        `ERR: installing scout-pills-reminder plugin -- ${JSON.stringify(e)}`
      );
    }
  },
};
