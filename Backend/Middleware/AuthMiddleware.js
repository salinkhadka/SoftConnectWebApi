// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

const jwt=require("jsonwebtoken")
const User=require("../Model/UserModel")

exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

    // Verify token - throws if invalid/expired
    const decoded = jwt.verify(token, process.env.SECRET);

    // Look up user by decoded id (_id is the field in token payload)
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found for provided token",
      });
    }

    // Attach user info to req for further use
    req.user = user;

    next(); // Continue to next middleware/controller
  } catch (err) {
    console.error("Authentication error:", err.message);

    // Check if error is related to JWT verification
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Other errors
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Admin privilege required",
    });
  }
};
