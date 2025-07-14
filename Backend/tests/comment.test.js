const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const connectDB = require("../Config/db");
const User = require("../Model/UserModel");
const Post = require("../Model/PostModel");
const Comment = require("../Model/CommentModel");

let authToken = "";
let testUserId = "";
let testPostId = "";
let testCommentId = "";

beforeAll(async () => {
  await connectDB();

  // Clean up test data
  await User.deleteOne({ email: "commentuser@gmail.com" });
  await Post.deleteMany({});
  await Comment.deleteMany({});

  // Register and login user
  await request(app).post("/user/register").send({
    username: "CommentTester",
    email: "commentuser@gmail.com",
    password: "testpass123",
    StudentId: 4444,
  });

  const loginRes = await request(app).post("/user/login").send({
    email: "commentuser@gmail.com",
    password: "testpass123",
  });

  authToken = loginRes.body.token;
  testUserId = loginRes.body.data._id;

  // Create a post to comment on
  const postRes = await request(app)
    .post("/post/createPost")
    .set("Authorization", `Bearer ${authToken}`)
    .field("userId", testUserId)
    .field("content", "Post to comment on")
    .field("privacy", "public");

  testPostId = postRes.body.data._id;
});

afterAll(async () => {
  await Comment.deleteMany({});
  await Post.deleteMany({ userId: testUserId });
  await User.deleteOne({ _id: testUserId });
  await mongoose.disconnect();
});

describe("📌 POST /comment/createComment", () => {
  test("✅ Create a comment successfully", async () => {
    const res = await request(app)
      .post("/comment/createComment")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        userId: testUserId,
        postId: testPostId,
        content: "This is a test comment",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Comment added successfully");
    expect(res.body.data).toHaveProperty("_id");
    testCommentId = res.body.data._id;
  });

  test("✅ Create a nested reply comment", async () => {
    const res = await request(app)
      .post("/comment/createComment")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        userId: testUserId,
        postId: testPostId,
        content: "This is a reply to comment",
        parentCommentId: testCommentId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.parentCommentId).toBe(testCommentId);
  });

  test("❌ Fail to create comment missing required fields", async () => {
    const res = await request(app)
      .post("/comment/createComment")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        userId: testUserId,
        postId: testPostId,
        // content missing
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Missing required fields");
  });

  test("❌ Fail to create comment without auth token", async () => {
    const res = await request(app)
      .post("/comment/createComment")
      .send({
        userId: testUserId,
        postId: testPostId,
        content: "No auth token",
      });

    expect(res.statusCode).toBe(401);
  });
});

describe("📌 GET /comment/comments/:postId", () => {
  test("✅ Get comments for a post", async () => {
    const res = await request(app).get(`/comment/comments/${testPostId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty("userId");
      expect(res.body.data[0]).toHaveProperty("content");
    }
  });

  test("❌ Fail to get comments for invalid postId format", async () => {
    const res = await request(app).get("/comment/comments/invalidPostId123");

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid postId");
  });
});

describe("📌 DELETE /comment/delete/:commentId", () => {
  test("✅ Delete comment successfully", async () => {
    const res = await request(app)
      .delete(`/comment/delete/${testCommentId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Comment deleted successfully");
  });

  test("❌ Fail to delete comment without auth token", async () => {
    const res = await request(app).delete(`/comment/delete/${testCommentId}`);

    expect(res.statusCode).toBe(401);
  });

  test("❌ Delete comment with invalid commentId format", async () => {
    const res = await request(app)
      .delete("/comment/delete/invalidCommentId123")
      .set("Authorization", `Bearer ${authToken}`);

    // Assuming your delete handler throws error or fails on invalid ObjectId
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});
