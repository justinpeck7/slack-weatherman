const path = require("path");
const Keyv = require("keyv");
const KeyvSqlite = require("@keyv/sqlite");

const DB_PATH = path.join(__dirname, "db");

export const configStore = new Keyv({
  store: new KeyvSqlite(`sqlite://${path.join(DB_PATH, "config.db")}`),
});

export const KEYS = {
  OKR_POST_PROBABILITY: "OKR_POST_PROBABILITY",
};
