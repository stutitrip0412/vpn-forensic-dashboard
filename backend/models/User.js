const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 64,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.VIEWER,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Instance method — never expose passwordHash even accidentally via JSON responses
UserSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    username: this.username,
    role: this.role,
    isActive: this.isActive,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
  };
};

UserSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

// Static helper to hash a plaintext password with a consistent cost factor
UserSchema.statics.hashPassword = async function hashPassword(plaintext) {
  const SALT_ROUNDS = 12;
  return bcrypt.hash(plaintext, SALT_ROUNDS);
};

module.exports = mongoose.model('User', UserSchema);
