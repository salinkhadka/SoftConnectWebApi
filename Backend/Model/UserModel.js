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
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('User', userSchema);
