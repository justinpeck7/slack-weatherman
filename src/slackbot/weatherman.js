import { RTMClient } from "@slack/rtm-api";
import WeathermanDAO from "../server/dao.js";
import handleMessage from "./message-handler.js";
import installPlugins from "./install-plugins.js";

export const startBot = async () => {
  const token = process.env.SLACK_TOKEN;
  const rtm = new RTMClient(token);
  try {
    await rtm.start();
    WeathermanDAO.log("Bot start");
    installPlugins({ rtm, token });
    rtm.on("message", (event) => handleMessage(event, rtm));
  } catch (e) {
    WeathermanDAO.log(`ERR: Bot start -- ${JSON.stringify(e)}`);
  }
};
