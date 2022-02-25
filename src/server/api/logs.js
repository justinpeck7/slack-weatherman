import express from "express";
import WeathermanDAO from "../dao.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const logs = await WeathermanDAO.getAllLogs();
  res.json({ logs });
});

export default router;
