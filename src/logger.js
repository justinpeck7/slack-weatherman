import fs from "fs";
import DateTime from "luxon/src/datetime.js";
import cron from "node-cron";
import express from "express";

const app = express();

let log;
const LOG_FILE_PATH = `${__dirname}/../logs/log.txt`;
const clearLogsTask = cron.schedule(
  "0 0 1 * *",
  () => {
    try {
      fs.unlink(LOG_FILE_PATH);
    } catch (e) {
      /* who cares */
    }
  },
  {
    scheduled: false
  }
);

app.get("/", (req, res, next) => {
  res.sendFile("log.txt", { root: `${__dirname}/../logs/` }, err => {
    if (err) {
      if (log) {
        log(`Express ERR -- ${err}`);
      }
      next(err);
    }
  });
});

app.listen(80);

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
