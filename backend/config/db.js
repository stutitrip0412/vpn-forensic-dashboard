// const mongoose = require('mongoose');

// /**
//  * Connects to MongoDB using MONGO_URI from environment.
//  * Exits the process on failure — a forensic tool must not run
//  * against a missing/unreachable database.
//  */
// async function connectDB() {
//   const uri = process.env.MONGO_URI;

//   if (!uri) {
//     console.error('[db] MONGO_URI is not set in the environment.');
//     process.exit(1);
//   }

//   try {
//     mongoose.set('strictQuery', true);
//     const conn = await mongoose.connect(uri);
//     console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

//     mongoose.connection.on('error', (err) => {
//       console.error('[db] MongoDB connection error:', err);
//     });

//     mongoose.connection.on('disconnected', () => {
//       console.warn('[db] MongoDB disconnected.');
//     });
//   } catch (err) {
//     console.error('[db] Initial MongoDB connection failed:', err.message);
//     process.exit(1);
//   }
// }

// module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("[db] MONGO_URI is not set in the environment.");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(uri);

    console.log(
      `[db] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`
    );

    mongoose.connection.on("error", (err) => {
      console.error("[db] MongoDB Connection Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("[db] MongoDB Disconnected.");
    });

  } catch (err) {
    console.error("[db] Initial MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
