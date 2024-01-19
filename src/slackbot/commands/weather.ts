import { logEvent } from '../../db/logs';
import { BotCommandFn } from '../types';

type OpenWeathermapResponse = {
  name: string;
  weather: [{ description: string }];
  main: {
    temp: number;
    feels_like: number;
  };
};

const zipRegex = /^\d{5}$/;
const weatherDataApi = (zip: string) =>
  `http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${process.env.WEATHER_APPID}&units=imperial`;

const getReplyText = (data: OpenWeathermapResponse) => {
  const description = data.weather[0].description;
  const temp = Math.floor(data.main.temp);
  const feelsLike = Math.floor(data.main.feels_like);
  const showFeelsLike = Math.abs(temp - feelsLike) > 10;

  return `${temp} degrees, ${description} in ${data.name} right now.${
    showFeelsLike ? ` Feels like ${feelsLike}` : ''
  }`;
};

const weather: BotCommandFn = async (input) => {
  if (zipRegex.test(input)) {
    try {
      const res = await fetch(weatherDataApi(input));
      const json = (await res.json()) as OpenWeathermapResponse;
      return getReplyText(json);
    } catch (e: any) {
      let reason;
      if (e.response && e.response.data) {
        reason = e.response.data.message;
      }
      if (reason === 'city not found') {
        return 'City not found';
      }

      logEvent(
        `ERR: Weather API ${reason} with input "${input}" -- ${JSON.stringify(
          e
        )}`
      );
      return 'Weather API Error';
    }
  } else {
    return 'Is that a real zipcode?';
  }
};

export default weather;
