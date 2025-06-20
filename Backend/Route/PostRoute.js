const express = require("express");
const router = express.Router();
const postController = require("../Controller/PostController");
const { authenticateUser, isAdmin } = require("../Middleware/AuthMiddleware");
const fileUpload = require("../Middleware/FileUpload");

// Public routes
router.get("/user/:userId", postController.getUserPosts);   // Get posts by user (public or protected as you wish)
router.get("/", postController.getAllPosts);                // Get all posts
router.get("/:id", postController.getOnePost);              // Get single post

// Protected routes (require login)
router.post("/createPost", authenticateUser, fileUpload.single("imageUrl"), postController.createPost);     // Create post
router.put("/:id", authenticateUser, fileUpload.single("imageUrl"), postController.updatePost);   // Update post
router.delete("/:id", authenticateUser, postController.deletePost);                              // Delete post

module.exports = router;
