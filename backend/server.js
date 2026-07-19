const dotenv = require("dotenv");
dotenv.config();
console.log("CORS_ORIGIN =", process.env.CORS_ORIGIN);
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[server] VPN Forensic Log Analyzer API listening on port ${PORT}`);
    console.log(`[server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

start().catch((err) => {
  console.error('[server] Fatal startup error:', err);
  process.exit(1);
});



