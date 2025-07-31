require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Model/UserModel");
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const admin = require('../Config/firebase'); 
// test commit update 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const base64urlEncode = (str) =>
  Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

exports.sendResetLink = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "15m",
    });

    // Encode token URL-safe base64
    const encodedToken = base64urlEncode(token);

    const resetUrl = `http://localhost:3000/reset-password/${encodedToken}`;

    const mailOptions = {
      from: `"SoftConnect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <p>Hello ${user.username},</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#37225C;color:#fff;text-decoration:none;border-radius:4px;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Error sending email" });
      console.log("Email sent: " + info.response);
      res.status(200).json({ success: true, message: "Reset email sent" });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.googleLogin = async (req, res) => {
  const idToken = req.body.idToken;

  if (!idToken) {
    return res.status(400).json({ success: false, message: "ID token required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        username: name,
        profilePhoto: picture,
        password: "GOOGLE_AUTH", // placeholder to avoid login via password
        role: "normal",
      });
    }

    // Generate your own JWT token
    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      data: user,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};






exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }
};


// Register
exports.registerUser = async (req, res) => {
  const { username, email, password, StudentId, role, bio, profilePhoto } = req.body;

  // If file uploaded, use its filename, else fallback to profilePhoto string in body
  const fileName = req.file?.filename || profilePhoto || '';

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  // if (!email || !password ) {
  //   return res.status(400).json({ success: false, message: "Missing fields" });
  // }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { StudentId }],
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
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
  const { email, password, fcmToken } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ success: false, message: "Invalid credentials" });

    // 🔥 Update FCM token if changed
    if (fcmToken && fcmToken !== user.fcmToken) {
      user.fcmToken = fcmToken;
      await user.save();
    }

    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
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




exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select("username email profilePhoto role createdAt updatedAt") // Only return needed fields
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
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

exports.updateOneUser = async (req, res) => {
  const { username, email, bio, role, profilePhoto } = req.body; // Added profilePhoto from body
  const fileName = req.file?.filename || profilePhoto || null;  // Use uploaded file or profilePhoto URL or null

  try {
    const updateFields = {};
    if (username !== undefined) updateFields.username = username;
    if (email !== undefined) updateFields.email = email;
    if (bio !== undefined) updateFields.bio = bio;
    if (role !== undefined) updateFields.role = role;
    if (fileName !== null) updateFields.profilePhoto = fileName;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
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


//upload image for mobileapp
exports.uploadImage = (async (req, res, next) => {
  // // check for the file size and send an error message
  // if (req.file.size > process.env.MAX_FILE_UPLOAD) {
  //   return res.status(400).send({
  //     message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
  //   });
  // }

  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: `uploads/`+req.file.filename,
  });
});


// POST /user/verify-password
exports.verifyPassword = async (req, res) => {
  try {
    const { userId, currentPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (isMatch) {
      const secret = process.env.SECRET || process.env.JWT_SECRET;
      if (!secret) {
        console.error("JWT secret not defined");
        return res.status(500).json({ success: false, message: "JWT secret not configured" });
      }

      const token = jwt.sign({ id: user._id }, secret, { expiresIn: "10m" });
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Password verification error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
