import express from "express";
import logs from "./api/logs";
import startScheduledTasks from "./scheduled-tasks";
import cors from "cors";
import path from "path";

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
