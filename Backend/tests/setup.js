// tests/test-setup.js
const mongoose = require('mongoose');
const User = require('../Model/UserModel');
const Post = require('../Model/PostModel');
const Comment = require('../Model/CommentModel');

// Test database configuration
const TEST_DB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/softconnect-test';

/**
 * Connect to test database
 */
const connectTestDB = async () => {
  try {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Connect to test database
    await mongoose.connect(TEST_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Test database connected successfully');
  } catch (error) {
    console.error('Test database connection failed:', error);
    throw error;
  }
};

/**
 * Clear all test data from database
 */
const clearTestDB = async () => {
  try {
    // Clear all collections
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
    ]);

    console.log('Test database cleared');
  } catch (error) {
    console.error('Failed to clear test database:', error);
    throw error;
  }
};

/**
 * Disconnect from test database
 */
const disconnectTestDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Test database disconnected');
  } catch (error) {
    console.error('Failed to disconnect from test database:', error);
    throw error;
  }
};

/**
 * Drop entire test database (use with caution)
 */
const dropTestDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log('Test database dropped');
  } catch (error) {
    console.error('Failed to drop test database:', error);
    throw error;
  }
};

module.exports = {
  connectTestDB,
  clearTestDB,
  disconnectTestDB,
  dropTestDB,
};