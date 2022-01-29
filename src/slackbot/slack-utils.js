import fetch from "node-fetch";

export const getIms = async (token) => {
  const res = await fetch(
    `https://slack.com/api/conversations.list?token=${token}&types=im`
  );
  const data = await res.json();
  return data.channels;
};

export const getChannel = async (channelName, token) => {
  const res = await fetch(
    `https://slack.com/api/conversations.list?token=${token}`
  );
  const data = await res.json();
  return data.channels.find((channel) => channel.name === channelName);
};

export const getUsers = async (token) => {
  const res = await fetch(`https://slack.com/api/users.list?token=${token}`);
  const json = await res.json();
  return json.members;
};
