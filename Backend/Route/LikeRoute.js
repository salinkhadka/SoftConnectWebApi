const express = require("express");
const router = express.Router();
const likeController = require("../Controller/LikeController");
const { authenticateUser } = require("../Middleware/AuthMiddleware");

// Protected routes
router.post("/like", authenticateUser, likeController.likePost);           // Like a post
router.post("/unlike", authenticateUser, likeController.unlikePost);       // Unlike a post

// Public route (or protect if necessary)
router.get("/like/:postId", likeController.getPostLikes);                  // Get all likes for a post

module.exports = router;
