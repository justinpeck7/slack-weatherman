import axios from "axios";
import _get from "lodash.get";
import getLogger from "../logger";

const log = getLogger();
const zipRegex = /^\d{5}$/;
const weatherDataApi = zip =>
  `http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${process.env.WEATHER_APPID}&units=imperial`;

const getReplyText = data => {
  const description = data.weather[0].description;
  const temp = Math.floor(data.main.temp);
  const feelsLike = Math.floor(data.main.feels_like);
  const showFeelsLike = Math.abs(temp - feelsLike) > 10;

  return `${temp} degrees, ${description} in ${data.name} right now.${
    showFeelsLike ? ` Feels like ${feelsLike}` : ""
  }`;
};

const weather = async input => {
  if (zipRegex.test(input)) {
    try {
      const res = await axios.get(weatherDataApi(input));
      return getReplyText(res.data);
    } catch (e) {
      const reason = _get(e, "response.data.message", "");
      if (reason === "city not found") {
        return "City not found";
      }

      log(`ERR Weather API ${reason} with input "${input}" -- ${e}`);
      return "Weather API Error";
    }
  }
};

export default weather;
