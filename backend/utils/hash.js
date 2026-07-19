const crypto = require('crypto');
const fs = require('fs');

/**
 * Streams a file through SHA-256 rather than reading it fully into memory —
 * important for the 100MB upload limit in FR1.1 (NFR: streaming reads).
 * Used by the evidence upload pipeline in Phase 2.
 */
function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

module.exports = { sha256File };
