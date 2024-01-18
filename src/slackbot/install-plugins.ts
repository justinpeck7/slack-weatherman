import { SocketModeClient } from '@slack/socket-mode';
import { WebClient } from '@slack/web-api';
import fs from 'fs';
import path from 'path';
import DAO from '../server/dao';

const installPlugins = async ({
  socketClient,
  webClient,
}: {
  socketClient: SocketModeClient;
  webClient: WebClient;
}) => {
  const pluginPath = path.join(process.cwd(), 'src', 'slackbot', 'plugins');
  const files = fs.readdirSync(pluginPath);

  files.forEach(async (file) => {
    const plugin = await import(`${pluginPath}/${file}`);
    try {
      plugin.default.install({ socketClient, webClient });
      DAO.logEvent(`Installed plugin: ${plugin.default.name}`);
    } catch (e) {
      DAO.logEvent(
        `ERR: installing ${plugin.default.name} plugin -- ${JSON.stringify(e)}`
      );
    }
  });
};

export default installPlugins;
