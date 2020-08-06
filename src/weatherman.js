import dotenv from "dotenv";
import { RTMClient } from "@slack/rtm-api";
import getLogger from "./logger";
import handleMessage from "./message-handler";
import installPlugins from "./install-plugins";

dotenv.config();

const token = process.env.SLACK_TOKEN;
const log = getLogger();
const rtm = new RTMClient(token);

(async () => {
  try {
    await rtm.start();
    log("Bot start");
    installPlugins({ rtm, log, token });
    rtm.on("message", (event) => handleMessage(event, rtm));
    rtm.on("goodbye", () => log("Disconnect"));
  } catch (e) {
    log(`ERR Starting bot -- ${e}`);
  }
})();
