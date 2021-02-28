import { RTMClient } from "@slack/rtm-api";
import WeathermanDAO from "../server/dao";
import handleMessage from "./message-handler";
import installPlugins from "./install-plugins";

const token = process.env.SLACK_TOKEN;
const rtm = new RTMClient(token);

export const startBot = async () => {
  try {
    await rtm.start();
    WeathermanDAO.log("Bot start");
    installPlugins({ rtm, token });
    rtm.on("message", (event) => handleMessage(event, rtm));
    /* rtm.on("goodbye", () => WeathermanDAO.log("Disconnect")); */
  } catch (e) {
    WeathermanDAO.log(`ERR: Bot start -- ${JSON.stringify(e)}`);
  }
};
