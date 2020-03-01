import fs from "fs";
import DateTime from "luxon/src/datetime.js";
import cron from "node-cron";
import express from "express";
import path from "path";

let log;
const LOG_FILE_PATH = path.resolve(__dirname, "../logs/log.txt");

const app = express();

app.get("/", (req, res, next) => {
  res.sendFile(
    "log.txt",
    { root: path.resolve(__dirname, "../logs/") },
    err => {
      if (err) {
        if (log) {
          log(`Express ERR -- ${err}`);
        }
        next(err);
      }
    }
  );
});

app.listen(8080);

const clearLogsTask = cron.schedule(
  "0 0 1 * *",
  () => {
    fs.writeFile(LOG_FILE_PATH, "", err => {
      if (err) {
        log(`ERR emptying log file -- ${err}`);
      }
    });
  },
  {
    scheduled: false
  }
);

const createLogger = () => {
  const datePrefix = DateTime.local().toFormat("dd-LLL-yyyy t");
  const writeStream = fs.createWriteStream(LOG_FILE_PATH, {
    flags: "a"
  });

  clearLogsTask.start();
  log = text => writeStream.write(`${datePrefix}: ${text}\n`);
};

const getLogger = () => {
  if (!log) {
    createLogger();
  }
  return log;
};

export default getLogger;
