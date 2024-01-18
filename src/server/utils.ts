export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  let minutes = date.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${formattedMinutes}`;
};
