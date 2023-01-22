const say = async ({ event, input, channels, webClient }) => {
  const [channelName, ...restInput] = input.split(":");
  const channel = channels.find(({ name }) => name === channelName)?.id;
  const text = restInput?.join(":")?.trim();

  if (!channel) {
    await webClient.chat.postMessage({
      text: `Could not find channel: ${channelName}`,
      channel: event.channel,
    });
    return;
  }

  try {
    await webClient.chat.postMessage({
      text,
      channel,
    });
  } catch (e) {
    await webClient.chat.postMessage({
      text: `Hit some kind of snag: ${e.message}`,
      channel: event.channel,
    });
  }
};

export default say;
