const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {

    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
    },
    StudentId: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String, // URL or file path
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'normal',
    },
    // isVerified: { type: Boolean, default: false }, // if you implement email verification
    followersCount: { type: Number, default: 0 },  // if you want faster follower count
    followingCount: { type: Number, default: 0 },
    fcmToken: {
  type: String,
  default: '',
},


  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('User', userSchema);
