const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
      index: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    // Path to the immutable, untouched original file. Parsing always
    // operates on a copy — never on this file directly (FR1.4).
    storagePath: {
      type: String,
      required: true,
    },
    sha256Hash: {
      type: String,
      required: true,
      index: true,
    },
    fileSizeBytes: {
      type: Number,
      required: true,
    },
    sourceType: {
      type: String,
      enum: ['openvpn', 'wireguard', 'syslog_auth', 'unknown'],
      default: 'unknown',
    },
    parseStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    parseCoverage: {
      // Percentage (0-100) of lines successfully parsed (FR2.3)
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    quarantinedLineCount: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Last time the stored hash was re-verified against the file on disk (FR6.2)
    lastVerifiedAt: {
      type: Date,
    },
    lastVerificationResult: {
      type: String,
      enum: ['match', 'mismatch', null],
      default: null,
    },
  },
  { timestamps: true }
);

EvidenceSchema.index({ caseId: 1, createdAt: -1 });

module.exports = mongoose.model('Evidence', EvidenceSchema);
