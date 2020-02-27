import axios from "axios";
import getLogger from "../logger";

const log = getLogger();
const zipRegex = /^\d{5}$/g;
const weatherDataApi = zip =>
  `http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${process.env.WEATHER_APPID}&units=imperial`;

const getReplyText = data => {
  const description = data.weather[0].description;
  const temp = Math.floor(data.main.temp);
  const feelsLike = Math.floor(data.main.feels_like);
  const showFeelsLike = Math.abs(temp - feelsLike) > 10;

  return `${temp} degrees, ${description} in ${data.name} right now.${
    showFeelsLike ? ` Feels like ${feelsLike}.` : ""
  }`;
};

const weather = async input => {
  input = input.trim();
  const isValidZip = zipRegex.test(input);

  if (isValidZip) {
    try {
      const res = await axios.get(weatherDataApi(input));
      return getReplyText(res.data);
    } catch (e) {
      log(`ERR Weather API -- ${e}`);
      return "The weather API seems to be down right now";
    }
  }
};

export default weather;
