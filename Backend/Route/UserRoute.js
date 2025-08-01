const express = require("express");
const router = express.Router();
const userController = require("../Controller/UserController");
const { authenticateUser, isAdmin } = require("../Middleware/AuthMiddleware");
const fileUpload=require("../Middleware/FileUpload")

// Public routes
router.post("/register",fileUpload.single("profilePhoto"), userController.registerUser);
router.post("/login", userController.loginUser);

// Protected routes
router.get("/getAll", userController.getUsers); 
router.get("/:id", userController.getOneUser);     // Logged-in user or admin
router.put("/:id", authenticateUser,fileUpload.single('profilePhoto'), userController.updateOneUser);  // Logged-in user
router.delete("/:id", authenticateUser, isAdmin, userController.deleteOneUser); // Admin-only
router.post("/request-reset", userController.sendResetLink);
router.post("/reset-password/:token", userController.resetPassword);
router.post("/verify-password",userController.verifyPassword)

router.post("/uploadImg",fileUpload.single("profilePhoto"),userController.uploadImage);

router.post("/google-login", userController.googleLogin);



module.exports = router;
