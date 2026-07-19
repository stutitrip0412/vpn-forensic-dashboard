/**
 * Run once after first deploy: `npm run seed:admin`
 * Creates the first admin account from SEED_ADMIN_USERNAME/PASSWORD in .env.
 * There is deliberately no public "sign up" endpoint — accounts for a
 * forensic tool are provisioned by an admin (FR7.2), starting with this one.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

async function seed() {
  await connectDB();

  const username = process.env.SEED_ADMIN_USERNAME || 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    console.error('SEED_ADMIN_PASSWORD is not set in .env — aborting.');
    process.exit(1);
  }

  const existing = await User.findOne({ username });
  if (existing) {
    console.log(`User '${username}' already exists — skipping.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await User.hashPassword(password);
  await User.create({ username, passwordHash, role: ROLES.ADMIN });

  console.log(`Admin user '${username}' created. Log in and change the password.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
