const path = require("path");
const sqlite3 = require("sqlite3");

const DB_PATH = path.join(__dirname, "db");

const db = new sqlite3.Database(
  path.join(`${DB_PATH}/weatherman.db`),
  (err) => {
    if (err) {
      console.log("Could not connect to DB: ", err);
    } else {
      console.log("Connected to DB");
    }
  }
);

db.run(
  `CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY,
    timestamp TEXT,
    event TEXT)`,
  [],
  (err) => {
    if (err) {
      console.log("Error creating logs table", err);
    } else {
      console.log("Logs table created");
    }
  }
);
