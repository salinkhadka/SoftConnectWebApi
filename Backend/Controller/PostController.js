const Post = require("../Model/PostModel");
const User = require("../Model/UserModel");
const mongoose = require('mongoose');

// Create a new post
exports.createPost = async (req, res) => {
  const { userId, content, privacy } = req.body;
  const imageUrl = req.file?.path || ''; // If you're using file uploads (e.g., multer)

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId" });
  }

  try {
    // Optional: check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const newPost = new Post({
      userId:user._id,
      content,
      imageUrl,
      privacy: privacy || 'public'
    });

    await newPost.save();

    return res.status(201).json({ success: true, message: "Post created successfully", data: newPost });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all posts (with user info)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username profilePhoto'); // Populate username and profilePhoto

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single post (with user info)
exports.getOnePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'username profilePhoto');

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({ success: true, message: "Post fetched successfully", data: post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  const { content, privacy } = req.body;
  const imageUrl = req.file?.path;

  try {
    const updateFields = {};
    if (content !== undefined) updateFields.content = content;
    if (privacy !== undefined) updateFields.privacy = privacy;
    if (imageUrl) updateFields.imageUrl = imageUrl;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({ success: true, message: "Post updated successfully", data: updatedPost });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
  console.log("Delete request received for ID:", req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.log("Invalid ObjectId!");
    return res.status(400).json({ success: false, message: "Invalid post ID" });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    console.log("Post not found!");
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  console.log("Found post:", post);

  if (!req.user) {
    console.log("req.user not set!");
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  if (post.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    console.log("Unauthorized delete attempt!");
    return res.status(403).json({ success: false, message: "Unauthorized: Only the creator or admin can delete this post" });
  }

  await Post.findByIdAndDelete(req.params.id);
  console.log("Post deleted!");
  return res.status(200).json({ success: true, message: "Post deleted successfully" });
} catch (err) {
  console.error("Delete error:", err);
  return res.status(500).json({ success: false, message: "Server error" });
}

};


// // Get posts by a specific user
// exports.getUserPosts = async (req, res) => {
//   try {
//     const posts = await Post.find({ userId: req.params.userId })
//       .sort({ createdAt: -1 })
//       .populate('userId', 'username profilePhoto');
//     return res.status(200).json({
//       success: true,
//       message: "User's posts fetched successfully",
//       data: posts,
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// // Get posts by a specific user
exports.getUserPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username profilePhoto'); // Include user info if needed

    return res.status(200).json({
      success: true,
      message: "User's posts fetched successfully",
      data: posts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
