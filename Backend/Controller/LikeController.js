const Like = require("../Model/LikeModel");
const Post = require("../Model/PostModel");
const mongoose = require("mongoose");

// Like a post
exports.likePost = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const existingLike = await Like.findOne({ userId, postId });
    if (existingLike) {
      return res.status(400).json({ success: false, message: "Post already liked" });
    }

    const newLike = new Like({ userId, postId });
    await newLike.save();

    return res.status(201).json({ success: true, message: "Post liked", data: newLike });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const like = await Like.findOneAndDelete({ userId, postId });
    if (!like) {
      return res.status(404).json({ success: false, message: "Like not found" });
    }

    return res.status(200).json({ success: true, message: "Post unliked" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all likes for a post
exports.getPostLikes = async (req, res) => {
  try {
    const likes = await Like.find({ postId: req.params.postId }).populate("userId", "username profilePhoto");
    return res.status(200).json({ success: true, data: likes });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
