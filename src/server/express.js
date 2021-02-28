import express from "express";
import logs from "./api/logs";
import startScheduledTasks from "./scheduled-tasks";

export const startServer = () => {
  startScheduledTasks();

  const app = express();

  app.use(express.json());
  app.use("/api/logs", logs);

  app.listen(8080);
};
