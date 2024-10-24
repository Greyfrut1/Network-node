import app from './app';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database';
import { createUserTables } from './migrations/userMigration';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await connectToDatabase();

  await createUserTables();
});
