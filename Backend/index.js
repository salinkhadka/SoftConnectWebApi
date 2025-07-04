require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/db');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./Route/UserRoute');
const postRoutes = require('./Route/PostRoute');
const likeRoutes = require('./Route/LikeRoute');         // ✅ New
const commentRoutes = require('./Route/CommentRoute');   // ✅ New

const app = express();
const PORT = process.env.PORT || 3000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "*" }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

// API Routes
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/like", likeRoutes);           // ✅ New
app.use("/comment", commentRoutes);     // ✅ New

// Test Route
app.get('/hey', (req, res) => {
  res.send('Hello World!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`);
});
