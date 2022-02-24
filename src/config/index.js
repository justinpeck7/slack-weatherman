const path = require("path");
const Keyv = require("keyv");
const KeyvSqlite = require("@keyv/sqlite");

const DB_PATH = path.join(process.cwd(), "db");

console.log("config db at", `sqlite://${path.join(DB_PATH, "weatherman.db")}`);

export const configStore = new Keyv({
  store: new KeyvSqlite({
    uri: `sqlite://${path.join(DB_PATH, "weatherman.db")}`,
  }),
  namespace: "config",
});

export const KEYS = {
  OKR_POST_PROBABILITY: "OKR_POST_PROBABILITY",
  OKR_CHANNEL_ID: "OKR_CHANNEL_ID",
};
