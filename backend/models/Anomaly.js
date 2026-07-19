const mongoose = require('mongoose');

const AnomalySchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['impossible_travel', 'brute_force', 'off_hours_access', 'new_ip_or_asn'],
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    // The specific evidence records that justify this flag — anomalies are
    // never a black-box score (FR4.5); they must point at real data.
    relatedLogEntryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LogEntry',
      },
    ],
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'reviewed', 'false_positive', 'confirmed'],
      default: 'open',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    analystNote: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

AnomalySchema.index({ caseId: 1, status: 1, severity: 1 });

module.exports = mongoose.model('Anomaly', AnomalySchema);
