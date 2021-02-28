import path from "path";
import fs from "fs";
import { getUsers } from "./slack-utils";
import WeathermanDAO from "../server/dao";

const installPlugins = async ({ rtm, token }) => {
  const users = await getUsers(token);
  const pluginPath = path.join(__dirname, "plugins");
  fs.readdir(pluginPath, (err, files) => {
    if (err) {
      WeathermanDAO.log(`ERR: plugin directory read -- ${JSON.stringify(err)}`);
      return;
    }
    for (const file of files) {
      const plugin = require(`${pluginPath}/${file}`).default;
      try {
        plugin.install({ rtm, token, users });
        WeathermanDAO.log(`Installed plugin: ${plugin.name}`);
      } catch (e) {
        WeathermanDAO.log(
          `ERR: installing ${plugin.name} plugin -- ${JSON.stringify(e)}`
        );
      }
    }
  });
};

export default installPlugins;
