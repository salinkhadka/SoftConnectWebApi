const Follow = require('../Model/FriendsModel');
const User = require('../Model/UserModel');
const mongoose = require('mongoose');

// ✅ Follow a user
exports.followUser = async (req, res) => {
  const { followerId, followeeId } = req.body;

  if (!followerId || !followeeId) {
    return res.status(400).json({ success: false, message: "Missing followerId or followeeId" });
  }

  if (followerId === followeeId) {
    return res.status(400).json({ success: false, message: "You cannot follow yourself" });
  }

  try {
    const follow = new Follow({ follower: followerId, followee: followeeId });
    await follow.save();

    // ✅ Update user follow counters
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(followeeId, { $inc: { followersCount: 1 } });

    return res.status(201).json({ success: true, message: "User followed", data: follow });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Already following" });
    }
    console.error("Follow Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// ✅ Unfollow a user
exports.unfollowUser = async (req, res) => {
  const { followerId, followeeId } = req.body;

  if (!followerId || !followeeId) {
    return res.status(400).json({ success: false, message: "Missing followerId or followeeId" });
  }

  try {
    const result = await Follow.findOneAndDelete({ follower: followerId, followee: followeeId });

    if (!result) {
      return res.status(404).json({ success: false, message: "Follow relationship not found" });
    }

    // ✅ Update user follow counters
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(followeeId, { $inc: { followersCount: -1 } });

    return res.status(200).json({ success: true, message: "User unfollowed" });
  } catch (err) {
    console.error("Unfollow Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// ✅ Get followers of a user
exports.getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await Follow.find({ followee: userId }).populate('follower', 'username profilePhoto');
    return res.status(200).json({ success: true, data: followers });
  } catch (err) {
    console.error("Get Followers Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get users a user is following
exports.getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await Follow.find({ follower: userId }).populate('followee', 'username profilePhoto');
    return res.status(200).json({ success: true, data: following });
  } catch (err) {
    console.error("Get Following Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
