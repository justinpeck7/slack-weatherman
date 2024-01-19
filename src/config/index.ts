import KeyvSqlite from '@keyv/sqlite';
import Keyv from 'keyv';
import { DB_PATH } from './constants';

export const configStore = new Keyv({
  store: new KeyvSqlite({
    uri: `sqlite://${DB_PATH}`,
  }),
  namespace: 'config',
});

export const KEYS = {
  OKR_POST_PROBABILITY: 'OKR_POST_PROBABILITY',
  OKR_CHANNEL_ID: 'OKR_CHANNEL_ID',
};
