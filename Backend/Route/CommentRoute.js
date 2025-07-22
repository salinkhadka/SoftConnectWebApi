const express = require("express");
const router = express.Router();
const commentController = require("../Controller/CommentController");
const { authenticateUser } = require("../Middleware/AuthMiddleware");

// Protected route
router.post("/createComment", authenticateUser, commentController.createComment);              

// Public route
router.get("/comments/:postId", commentController.getPostComments);       

// Protected route
router.delete("/delete/:commentId", authenticateUser, commentController.deleteComment);  

module.exports = router;
