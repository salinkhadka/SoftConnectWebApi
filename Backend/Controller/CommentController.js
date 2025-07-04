const Comment = require("../Model/CommentModel");
const Post = require("../Model/PostModel");
const mongoose = require("mongoose");

// Create a comment
exports.createComment = async (req, res) => {
  const { userId, postId, text } = req.body;

  if (!text || !userId || !postId) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const newComment = new Comment({ userId, postId, text });
    await newComment.save();

    return res.status(201).json({ success: true, message: "Comment added", data: newComment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get comments for a post
exports.getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: -1 })
      .populate("userId", "username profilePhoto");

    return res.status(200).json({ success: true, data: comments });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    // Optional: check if requester is the comment owner or admin
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
