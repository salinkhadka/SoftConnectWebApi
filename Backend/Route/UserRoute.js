const express = require("express");
const router = express.Router();
const userController = require("../Controller/UserController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getOneUser);
router.put("/:id", userController.updateOneUser);
router.delete("/:id", userController.deleteOneUser);

module.exports = router;
