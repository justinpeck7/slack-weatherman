import { getConfigVal, logEvent, setConfigVal } from '../../db/fns';
import { KEYS } from '../plugins/daily-okr';
import { BotCommandFn } from '../types';

const config: BotCommandFn = async (input) => {
  try {
    const [key, ...value] = input.split(' ');
    const normalizedKey = key.trim().toUpperCase();

    if (normalizedKey === 'HELP' || normalizedKey === 'KEYS') {
      return Object.keys(KEYS)
        .map((k) => `\`${k}\``)
        .join('\n');
    }

    if (normalizedKey === 'CURRENT' || normalizedKey === '') {
      const kvPairs = await Promise.all(
        Object.keys(KEYS).map(
          async (k) => `\`${k}\`: \`${await getConfigVal(k)}\``
        )
      );
      return kvPairs.join('\n');
    }

    if (KEYS[normalizedKey as keyof typeof KEYS]) {
      const valToSet = value[0];
      await setConfigVal(normalizedKey, valToSet);
      logEvent(`CONFIG: Set [${normalizedKey}] to [${valToSet}]`);
      return `Set \`${normalizedKey}\` to \`${valToSet}\``;
    } else {
      return `Cannot set invalid key \`${normalizedKey}\``;
    }
  } catch (e) {
    console.log(e);
    logEvent(
      `ERR: could not set config from "${input}" -- ${JSON.stringify(e)}`
    );
    return `Could not set config from "${input}" -- ${JSON.stringify(e)}`;
  }
};

export default config;
