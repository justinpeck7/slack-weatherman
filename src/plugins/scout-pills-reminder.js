import cron from "node-cron";
import { getIms } from "../slack-utils";

export default {
  name: "scout-pills-reminder",
  install: async ({ rtm, token, users }) => {
    const imList = await getIms(token);

    const me = users.find((member) => member.real_name === "Justin Peck");
    const convoWithMe = imList.ims.find((im) => im.user === me.id);

    cron.schedule("0 0 1 * *", () => {
      rtm.sendMessage("Give Scout his meds", convoWithMe.id);
    });
  },
};
