const mongoose = require('mongoose');

const LogEntrySchema = new mongoose.Schema(
  {
    evidenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evidence',
      required: true,
      index: true,
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
      index: true,
    },
    timestampUTC: {
      type: Date,
      required: true,
      index: true,
    },
    timestampRaw: {
      type: String, // original string as it appeared in the log line
    },
    originalTimezone: {
      type: String,
      default: null,
    },
    user: {
      type: String,
      index: true,
    },
    sourceIp: {
      type: String,
      index: true,
    },
    vpnAssignedIp: {
      type: String,
      default: null,
    },
    action: {
      type: String,
      enum: ['connect', 'disconnect', 'auth_success', 'auth_failure', 'other'],
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      default: null,
      index: true,
    },
    rawLine: {
      type: String,
      required: true,
    },
    geo: {
      country: { type: String, default: null },
      region: { type: String, default: null },
      city: { type: String, default: null },
      lat: { type: Number, default: null },
      long: { type: Number, default: null },
      asn: { type: String, default: null },
      isApproximate: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

LogEntrySchema.index({ caseId: 1, timestampUTC: 1 });
LogEntrySchema.index({ caseId: 1, user: 1, timestampUTC: 1 });

module.exports = mongoose.model('LogEntry', LogEntrySchema);
