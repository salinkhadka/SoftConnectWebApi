const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const { connectTestDB, clearTestDB, disconnectTestDB } = require("./setup");
const User = require("../Model/UserModel");
const Post = require("../Model/PostModel");
const Comment = require("../Model/CommentModel");

let authToken = "";
let testUserId = "";
let testPostId = "";
let testCommentId = "";

beforeAll(async () => {
  await connectTestDB(); // Connect to test database
});

beforeEach(async () => {
  await clearTestDB(); // Clear all test data before each test

  // Register and login test user
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
  await clearTestDB(); // Clean up after all tests
  await disconnectTestDB();
});

describe("📌 POST /comment/createComment", () => {
  

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
  

  test("❌ Fail to get comments for invalid postId format", async () => {
    const res = await request(app).get("/comment/comments/invalidPostId123");

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid postId");
  });
});

describe("📌 DELETE /comment/delete/:commentId", () => {
  test("✅ Delete comment successfully", async () => {
    // Create a comment first
    const createRes = await request(app)
      .post("/comment/createComment")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        userId: testUserId,
        postId: testPostId,
        content: "Comment to be deleted",
      });

    const commentId = createRes.body.data._id;

    const res = await request(app)
      .delete(`/comment/delete/${commentId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Comment deleted successfully");

    // Verify deletion
    const deletedComment = await Comment.findById(commentId);
    expect(deletedComment).toBeNull();
  });

  test("❌ Fail to delete comment without auth token", async () => {
    // Create a comment first
    const createRes = await request(app)
      .post("/comment/createComment")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        userId: testUserId,
        postId: testPostId,
        content: "Comment to be deleted",
      });

    const commentId = createRes.body.data._id;

    const res = await request(app).delete(`/comment/delete/${commentId}`);

    expect(res.statusCode).toBe(401);

    // Verify comment still exists
    const comment = await Comment.findById(commentId);
    expect(comment).toBeTruthy();
  });

  test("❌ Delete comment with invalid commentId format", async () => {
    const res = await request(app)
      .delete("/comment/delete/invalidCommentId123")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(500);
    
  });

  test("❌ Delete non-existent comment", async () => {
    const fakeCommentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/comment/delete/${fakeCommentId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Comment deleted successfully");
  });

  
});




