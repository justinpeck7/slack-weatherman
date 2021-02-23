import fetch from "node-fetch";

export const getIms = async (token) => {
  const res = await fetch(`https://slack.com/api/im.list?token=${token}`);
  return await res.json();
};

export const getChannel = async (channelName, token) => {
  const res = await fetch(
    `	https://slack.com/api/conversations.list?token=${token}`
  );
  const data = await res.json();
  return data.channels.find((channel) => channel.name === channelName);
};
