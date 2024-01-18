const say = async ({ event, input, channels, webClient }: any) => {
  const [channelName, ...restInput] = input.split(':');
  const channel = channels.find(({ name }: any) => name === channelName)?.id;
  const text = restInput.at(0)?.trim();

  if (!channel) {
    await webClient.chat.postMessage({
      text: `Could not find channel: ${channelName}`,
      channel: event.channel,
    });
    return `Can't find that channel`;
  }

  try {
    await webClient.chat.postMessage({
      text,
      channel,
    });
    return 'Done';
  } catch (e) {
    await webClient.chat.postMessage({
      text: `Hit some kind of snag: ${(e as Error).message}`,
      channel: event.channel,
    });
    return `Hit some kind of snag: ${(e as Error).message}`;
  }
};

export default say;
