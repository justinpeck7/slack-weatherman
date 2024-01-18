import { configStore, KEYS } from '../../config';
import DAO from '../../server/dao';
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
          async (k) => `\`${k}\`: \`${await configStore.get(k)}\``
        )
      );
      return kvPairs.join('\n');
    }

    if (KEYS[normalizedKey as keyof typeof KEYS]) {
      const valToSet = value[0];
      await configStore.set(normalizedKey, valToSet);
      DAO.logEvent(`CONFIG: Set [${normalizedKey}] to [${valToSet}]`);
      return `Set \`${normalizedKey}\` to \`${valToSet}\``;
    } else {
      return `Cannot set invalid key \`${normalizedKey}\``;
    }
  } catch (e) {
    DAO.logEvent(
      `ERR: could not set config from "${input}" -- ${JSON.stringify(e)}`
    );
    return `Could not set config from "${input}" -- ${JSON.stringify(e)}`;
  }
};

export default config;