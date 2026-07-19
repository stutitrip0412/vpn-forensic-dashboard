const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const caseRoutes = require('./routes/caseRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const anomalyRoutes = require('./routes/anomalyRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Phase 4+ route modules will be mounted here as they're built:
// const auditRoutes = require('./routes/auditRoutes');

const app = express();

// --- Security & parsing middleware ---
app.use(helmet()); // HTTP header hardening (NFR Security)
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || '').split(',').filter(Boolean),
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' })); // JSON bodies only — file uploads use multer separately (Phase 2)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/anomalies', anomalyRoutes);

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
