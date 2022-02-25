import dotenv from "dotenv";
import { createDB } from "./create-db.js";

dotenv.config();

(async () => {
  await createDB();
  // The import chain includes files that auto-connect to the DB
  // so we need to make sure that DB exists before the app
  // imports resolve
  const app = await import("./src/index.js");
  app.start();
})();
