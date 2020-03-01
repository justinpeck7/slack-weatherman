import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { RTMClient } from "@slack/rtm-api";
import getLogger from "./logger";
import handleMessage from "./message-handler";

dotenv.config();

const token = process.env.SLACK_TOKEN;
const log = getLogger();
const rtm = new RTMClient(token);

const installPlugins = () => {
  const pluginPath = path.join(__dirname, "plugins");
  fs.readdir(pluginPath, (err, files) => {
    if (err) {
      log(`ERR reading plugin directory -- ${err}`);
      return;
    }
    for (const file of files) {
      try {
        const plugin = require(`${pluginPath}/${file}`).default;
        plugin.install({ rtm, log, token });
      } catch (e) {
        log(`ERR installing ${file} plugin -- ${e}`);
      }
    }
  });
};

(async () => {
  try {
    await rtm.start();
    log("Bot start");
    installPlugins();
    rtm.on("message", event => handleMessage(event, rtm));
  } catch (e) {
    log(`ERR Starting bot -- ${e}`);
  }
})();
