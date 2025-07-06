const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = new Schema(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followee: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);

// Ensure uniqueness (follower can't follow the same followee twice)
followSchema.index({ follower: 1, followee: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);
