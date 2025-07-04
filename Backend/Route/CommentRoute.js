const express = require("express");
const router = express.Router();
const commentController = require("../Controller/CommentController");
const { authenticateUser } = require("../Middleware/AuthMiddleware");

// Protected route
router.post("/createComment", authenticateUser, commentController.createComment);              // Add a comment

// Public route
router.get("/comments/:postId", commentController.getPostComments);                   // Get comments on a post

// Protected route
router.delete("/delete/:commentId", authenticateUser, commentController.deleteComment);  // Delete a comment

module.exports = router;
