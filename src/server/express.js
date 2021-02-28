import express from "express";
import logs from "./api/logs";

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use("/api/logs", logs);

  app.listen(8080);
};
