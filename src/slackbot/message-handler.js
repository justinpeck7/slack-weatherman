import define from "./commands/define.js";
import weather from "./commands/weather.js";
import WeathermanDAO from "../server/dao.js";
import config from "./commands/config.js";

const botFns = { define, weather, config };

const getCommand = (input) => {
  if (input[0] === "!") {
    return input.split(" ")[0].slice(1);
  }
  return null;
};

const handleMessage = async (event, rtm) => {
  if (!event || !event.text) {
    WeathermanDAO.log(
      `Hey, weird invalid text from slack: ${JSON.stringify(event)}`
    );
    return;
  }
  const command = getCommand(event.text);
  if (command && botFns[command]) {
    const input = event.text.replace(`!${command}`, "").trim();
    const response = await botFns[command](input);
    try {
      WeathermanDAO.log(`CMD: ${event.text} => ${response}`);
      await rtm.sendMessage(response, event.channel);
    } catch (e) {
      WeathermanDAO.log(
        `ERR: ${command} command with input ${
          event.text
        }, error: ${JSON.stringify(e)}`
      );
    }
  }
};

export default handleMessage;
