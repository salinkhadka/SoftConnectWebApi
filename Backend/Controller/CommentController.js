const Comment = require("../Model/CommentModel");
const Post = require("../Model/PostModel");
const Notification = require("../Model/NotificationModel");
const mongoose = require("mongoose");


exports.createComment = async (req, res) => {
  const { userId, postId, content, parentCommentId } = req.body;

  if (!content || !userId || !postId) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const newComment = new Comment({
      userId,
      postId,
      content,
      parentCommentId: parentCommentId || null,
    });

    await newComment.save();

    // Populate user for Flutter like model
    await newComment.populate("userId", "_id username profilePhoto");

    // Fetch post to get post owner
    const post = await Post.findById(postId).populate("userId", "_id");
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const postOwnerId = post.userId._id.toString();

    // 🔔 Avoid self-comment notification
    if (userId !== postOwnerId) {
      const notification = new Notification({
        recipient: postOwnerId,
        type: "comment",
        message: `${newComment.userId.username} commented on your post`,
        relatedId: postId,
      });

      await notification.save();
    }

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        ...newComment.toObject(),
        postOwnerId: postOwnerId,
      },
    });
  } catch (err) {
    console.error("Create Comment Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get all comments for a post
exports.getPostComments = async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ success: false, message: "Invalid postId" });
  }

  try {
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .populate("userId", "username profilePhoto");

    return res.status(200).json({ success: true, data: comments });
  } catch (err) {
    console.error("Get Comments Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.deleteOne({ _id: req.params.commentId });

    return res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete Comment Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

