import WeathermanDAO from "../dao.js";
import cron from "node-cron";

export const clearMonthlyLogs = () => {
  cron.schedule(
    "0 0 * * *",
    () => {
      WeathermanDAO.run(
        `DELETE FROM logs where timestamp <= datetime('now', '-30 day')`
      );
    },
    {
      timezone: "America/Chicago",
    }
  );
};
