import { logEvent } from '../../db/logs';
import { BotCommandFn } from '../types';

type UrbanDictResponse = {
  list: [{ definition: string }];
};

const urbanDictApi = (searchTerm: string) =>
  `http://api.urbandictionary.com/v0/define?term=${searchTerm}`;

const define: BotCommandFn = async (input) => {
  try {
    const path = urbanDictApi(input.replace(/\s/g, '+'));
    const res = await fetch(path);
    const json = (await res.json()) as UrbanDictResponse;
    if (json.list && json.list.length) {
      let { definition } = json.list[0];
      definition = definition.replace(/\[/g, '').replace(/]/g, '');
      return definition;
    }
    return 'No.';
  } catch (e) {
    logEvent(
      `ERR: UrbanDict API with input "${input}" -- ${JSON.stringify(e)}`
    );
    return 'Dictionary API Error';
  }
};

export default define;
