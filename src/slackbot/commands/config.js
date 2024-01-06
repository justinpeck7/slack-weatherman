import WeathermanDAO from '../../server/dao.js';
import { configStore, KEYS } from '../../config/index.js';

const config = async (input) => {
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

    if (KEYS[normalizedKey]) {
      await configStore.set(normalizedKey, value);
      WeathermanDAO.log(`CONFIG: Set [${normalizedKey}] to [${value}]`);
      return `Set \`${normalizedKey}\` to \`${value}\``;
    } else {
      return `Cannot set invalid key \`${normalizedKey}\``;
    }
  } catch (e) {
    WeathermanDAO.log(
      `ERR: could not set config from "${input}" -- ${JSON.stringify(e)}`
    );
    return `Could not set config from "${input}" -- ${JSON.stringify(e)}`;
  }
};

export default config;
