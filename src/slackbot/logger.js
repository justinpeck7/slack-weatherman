import fs from "fs";
import DateTime from "luxon/src/datetime.js";
import cron from "node-cron";
import path from "path";

const LOG_FILE_PATH = path.resolve(__dirname, "../logs/log.txt");

class Logger {
  constructor() {
    this.writeStream = fs.createWriteStream(LOG_FILE_PATH, {
      flags: "a",
    });
    this.clearLogsTask();
  }

  clearLogsTask() {
    cron.schedule(
      "0 0 1 * *",
      () => {
        fs.writeFile(LOG_FILE_PATH, "", (err) => {
          if (err) {
            this.log(`ERR: emptying log file -- ${JSON.stringify(err)}`);
          }
        });
      },
      {
        scheduled: false,
      }
    );
  }

  log(text) {
    const datePrefix = DateTime.local().toFormat("dd-LLL-yyyy t");
    if (typeof text === "object") {
      text = JSON.stringify(text);
    }
    this.writeStream.write(`${datePrefix}: ${text}\n`);
  }
}

export default new Logger();
