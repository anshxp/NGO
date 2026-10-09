import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../connection/db.js';
import { UserModel } from '../schema/user.js';

try {
  await connectDB();
  const result = await UserModel.updateMany(
    { role: { $nin: ['admin', 'volunteer'] } },
    { $set: { role: 'volunteer' } },
  );
  const missingRole = await UserModel.updateMany(
    { role: { $exists: false } },
    { $set: { role: 'volunteer' } },
  );
  console.log(`Role migration complete. Converted legacy roles: ${result.modifiedCount}; filled missing roles: ${missingRole.modifiedCount}.`);
} catch (error) {
  console.error(`Role migration failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
