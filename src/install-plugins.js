import path from "path";
import fs from "fs";
import axios from "axios";

const getUsers = async (token, log) => {
  try {
    const res = await axios.get(
      `https://slack.com/api/users.list?token=${token}`
    );
    return res.data.members;
  } catch (e) {
    log(`ERR getting users -- ${e}`);
  }
};

const installPlugins = async ({ rtm, log, token }) => {
  const users = await getUsers(token, log);
  const pluginPath = path.join(__dirname, "plugins");
  fs.readdir(pluginPath, (err, files) => {
    if (err) {
      log(`ERR reading plugin directory -- ${err}`);
      return;
    }
    for (const file of files) {
      try {
        const plugin = require(`${pluginPath}/${file}`).default;
        plugin.install({ rtm, log, token, users });
      } catch (e) {
        log(`ERR installing ${file} plugin -- ${e}`);
      }
    }
  });
};

export default installPlugins;
