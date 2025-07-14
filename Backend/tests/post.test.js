const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const connectDB = require("../Config/db");
const User = require("../Model/UserModel");
const Post = require("../Model/PostModel");

let authToken = "";
let testUserId = "";
let createdPostId = "";

beforeAll(async () => {
  await connectDB();
  await User.deleteOne({ email: "postuser@gmail.com" });

  const registerRes = await request(app).post("/user/register").send({
    username: "PostTester",
    email: "postuser@gmail.com",
    password: "testpass123",
    StudentId: 2222,
  });

  const loginRes = await request(app).post("/user/login").send({
    email: "postuser@gmail.com",
    password: "testpass123",
  });

  authToken = loginRes.body.token;
  testUserId = loginRes.body.data._id;
});

afterAll(async () => {
  await Post.deleteMany({ userId: testUserId });
  await User.deleteOne({ _id: testUserId });
  await mongoose.disconnect();
});

describe("📌 POST /post/createPost", () => {
  test("✅ Create a post without image", async () => {
    const res = await request(app)
      .post("/post/createPost")
      .set("Authorization", `Bearer ${authToken}`)
      .field("userId", testUserId)
      .field("content", "This is a test post")
      .field("privacy", "private");

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    createdPostId = res.body.data._id;
  });

  test("❌ Fail to create a post without userId", async () => {
    const res = await request(app)
      .post("/post/createPost")
      .set("Authorization", `Bearer ${authToken}`)
      .field("content", "Missing userId");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing userId");
  });
});

describe("📌 GET /post", () => {
  test("✅ Get all posts", async () => {
    const res = await request(app).get("/post");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("✅ Get a post by ID", async () => {
    const res = await request(app).get(`/post/${createdPostId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(createdPostId);
  });

  test("❌ Get post with invalid ID", async () => {
    const res = await request(app).get("/post/invalidId123");
    expect(res.statusCode).toBe(500);
  });
});

describe("📌 PUT /post/:id", () => {
  test("✅ Update post content", async () => {
    const res = await request(app)
      .put(`/post/${createdPostId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .field("content", "Updated content");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.content).toBe("Updated content");
  });

  test("❌ Update non-existent post", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/post/${fakeId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .field("content", "No post here");

    expect(res.statusCode).toBe(404);
  });
});

describe("📌 GET /post/user/:userId", () => {
  test("✅ Get all posts by user", async () => {
    const res = await request(app).get(`/post/user/${testUserId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("📌 DELETE /post/:id", () => {
  test("✅ Delete a post by creator", async () => {
    const res = await request(app)
      .delete(`/post/${createdPostId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Post deleted successfully");
  });

  test("❌ Delete with invalid ID format", async () => {
    const res = await request(app)
      .delete(`/post/invalid-id`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
  });

  
});
