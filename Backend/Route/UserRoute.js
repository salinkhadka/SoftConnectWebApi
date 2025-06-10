const express = require("express");
const router = express.Router();
const userController = require("../Controller/UserController");
const { authenticateUser, isAdmin } = require("../Middleware/AuthMiddleware");

// Public routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected routes
router.get("/", authenticateUser, isAdmin, userController.getUsers); // Admin-only
router.get("/:id", authenticateUser, userController.getOneUser);     // Logged-in user or admin
router.put("/:id", authenticateUser, userController.updateOneUser);  // Logged-in user
router.delete("/:id", authenticateUser, isAdmin, userController.deleteOneUser); // Admin-only

module.exports = router;
