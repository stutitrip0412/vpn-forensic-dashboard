const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'archived'],
      default: 'open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Analysts/investigators granted access to this case (RBAC is global-role
    // based, but this lets us scope case *visibility* independent of role).
    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    legalHold: {
      type: Boolean,
      default: false,
    },
    retentionPolicyDays: {
      type: Number,
      default: null, // null = no automatic deletion
    },
    // Off-hours anomaly detection window (FR4.3), UTC hours 0-23. Null
    // means "use the system default" (config/anomalyConfig.js).
    normalHoursStart: {
      type: Number,
      min: 0,
      max: 23,
      default: null,
    },
    normalHoursEnd: {
      type: Number,
      min: 0,
      max: 23,
      default: null,
    },
  },
  { timestamps: true }
);

CaseSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Case', CaseSchema);
