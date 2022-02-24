import define from "./commands/define";
import weather from "./commands/weather";
import config from "./commands/config";
import WeathermanDAO from "../server/dao";

const botFns = { define, weather, config };

const getCommand = (input) => {
  if (input[0] === "!") {
    return input.split(" ")[0].slice(1);
  }
  return null;
};

const handleMessage = async (event, rtm) => {
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
