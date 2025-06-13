const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Model/UserModel");
const mongoose = require('mongoose');

// Register
exports.registerUser = async (req, res) => {
  const { username, email, password, userId, StudentId, role, bio } = req.body;
  const fileName = req.file?.path;

  if (!email || !password || !userId) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { userId },{StudentId}],
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      userId,
      StudentId,
      profilePhoto: fileName || '', // optional, default empty
      password: hashedPassword,
      role: role || 'normal',
      bio: bio || '', // optional, default empty
    });

    await newUser.save();
    console.log("User saved in DB:", mongoose.connection.name);

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ success: false, message: "Invalid credentials" });

    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      userId: user.userId,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get one user
exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update one user
exports.updateOneUser = async (req, res) => {
  const { firstName, lastName, bio } = req.body;
  const fileName = req.file?.path;

  try {
    const updateFields = {};

    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (bio !== undefined) updateFields.bio = bio;
    // Only update profilePhoto if a new file was uploaded
    if (fileName) {
      updateFields.profilePhoto = fileName;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete one user
exports.deleteOneUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
