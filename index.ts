import 'dotenv/config';
import { createDB } from './src/config/create-db';

(async () => {
  // The import chain includes files that auto-connect to the DB
  // so we need to make sure that DB exists before the app
  // imports resolve
  await createDB();
  await import('./src/index');
})();
