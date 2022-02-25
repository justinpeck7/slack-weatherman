import express from "express";
import logs from "./api/logs.js";
import startScheduledTasks from "./scheduled-tasks/index.js";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const startServer = () => {
  startScheduledTasks();

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api/logs", logs);

  app.get("/logs", (req, res, next) => {
    res.sendFile(
      "index.html",
      { root: path.resolve(__dirname, "../client/") },
      (err) => {
        if (err) {
          next(err);
        }
      }
    );
  });

  app.listen(8080);
};
