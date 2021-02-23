import path from "path";
import fs from "fs";
import fetch from "node-fetch";

const getUsers = async (token, log) => {
  try {
    const res = await fetch(`https://slack.com/api/users.list?token=${token}`);
    const json = await res.json();
    return json.members;
  } catch (e) {
    log(`ERR: fetching users -- ${JSON.stringify(e)}`);
  }
};

const installPlugins = async ({ rtm, log, token }) => {
  const users = await getUsers(token, log);
  const pluginPath = path.join(__dirname, "plugins");
  fs.readdir(pluginPath, (err, files) => {
    if (err) {
      log(`ERR: plugin directory read -- ${JSON.stringify(err)}`);
      return;
    }
    for (const file of files) {
      const plugin = require(`${pluginPath}/${file}`).default;
      try {
        plugin.install({ rtm, log, token, users });
        log(`Installed plugin: ${plugin.name}`);
      } catch (e) {
        log(`ERR: installing ${plugin.name} plugin -- ${JSON.stringify(e)}`);
      }
    }
  });
};

export default installPlugins;
