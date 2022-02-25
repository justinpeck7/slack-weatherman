import fs from "fs";
import { getUsers } from "./slack-utils.js";
import WeathermanDAO from "../server/dao.js";
import path from "path";

const installPlugins = async ({ rtm, token }) => {
  const users = await getUsers(token);
  const pluginPath = path.join(process.cwd(), "src", "slackbot", "plugins");
  const files = fs.readdirSync(pluginPath);

  files.forEach(async (file) => {
    const plugin = await import(`${pluginPath}/${file}`);
    try {
      plugin.default.install({ rtm, token, users });
      WeathermanDAO.log(`Installed plugin: ${plugin.default.name}`);
    } catch (e) {
      WeathermanDAO.log(
        `ERR: installing ${plugin.default.name} plugin -- ${JSON.stringify(e)}`
      );
    }
  });
};

export default installPlugins;
