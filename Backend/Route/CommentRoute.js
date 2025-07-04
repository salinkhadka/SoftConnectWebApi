const express = require("express");
const router = express.Router();
const commentController = require("../Controller/CommentController");
const { authenticateUser } = require("../Middleware/AuthMiddleware");

// Protected route
router.post("/", authenticateUser, commentController.createComment);              // Add a comment

// Public route
router.get("/post/:postId", commentController.getPostComments);                   // Get comments on a post

// Protected route
router.delete("/:commentId", authenticateUser, commentController.deleteComment);  // Delete a comment

module.exports = router;
