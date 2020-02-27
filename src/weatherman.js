import dotenv from "dotenv";
import { RTMClient } from "@slack/rtm-api";
import getLogger from "./logger";
import handleMessage from "./message-handler";

dotenv.config();
const token = process.env.SLACK_TOKEN;
const log = getLogger();

const rtm = new RTMClient(token);

rtm
  .start()
  .then(() => log("Bot start"))
  .catch(console.log);

rtm.on("message", event => handleMessage(event, rtm));
