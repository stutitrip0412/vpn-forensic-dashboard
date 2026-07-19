const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || path.join(__dirname, '..', 'uploads');
const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB) || 100;
const ALLOWED_EXTENSIONS = new Set(['.log', '.txt']);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Evidence is stored under uploads/<caseId>/ so files are naturally
    // segregated per case on disk (helps with retention/legal-hold cleanup
    // later, and keeps a directory listing meaningful during an audit).
    const caseDir = path.join(UPLOAD_ROOT, req.params.caseId);
    fs.mkdir(caseDir, { recursive: true }, (err) => cb(err, caseDir));
  },
  filename(req, file, cb) {
    // Never trust the original filename for the on-disk name (path
    // traversal, collisions). The real original name is preserved
    // separately in Evidence.originalFilename.
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    cb(null, safeName);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new Error(`Unsupported file type "${ext}". Only .log and .txt are accepted.`));
  }
  cb(null, true);
}

const uploadEvidence = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_UPLOAD_MB * 1024 * 1024,
  },
});

module.exports = { uploadEvidence, UPLOAD_ROOT };
