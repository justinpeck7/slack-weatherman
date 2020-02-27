import define from "./commands/define";
import weather from "./commands/weather";
import getLogger from "./logger";

const log = getLogger();
const botFns = { define, weather };

const getCommand = input => {
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
      await rtm.sendMessage(response, event.channel);
    } catch (e) {
      log(`ERR RTM -- command: ${command}, error: ${e}`);
    }
  }
};

export default handleMessage;
