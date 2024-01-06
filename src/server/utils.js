export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  let minutes = date.getMinutes();
  if (minutes < 10) minutes = `0${minutes}`;
  return `${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${minutes}`;
};
