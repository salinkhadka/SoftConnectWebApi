const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const connectDB = require("../Config/db");
const User = require("../Model/UserModel");
const Post = require("../Model/PostModel");
const Like = require("../Model/LikeModel");

let authToken = "";
let testUserId = "";
let testPostId = "";
let likeId = "";

beforeAll(async () => {
  await connectDB();

  // Cleanup test user if exists
  await User.deleteOne({ email: "likeuser@gmail.com" });
  await Like.deleteMany({});
  await Post.deleteMany({});

  // Register user
  const registerRes = await request(app).post("/user/register").send({
    username: "LikeTester",
    email: "likeuser@gmail.com",
    password: "testpass123",
    StudentId: 3333,
  });

  // Login user
  const loginRes = await request(app).post("/user/login").send({
    email: "likeuser@gmail.com",
    password: "testpass123",
  });

  authToken = loginRes.body.token;
  testUserId = loginRes.body.data._id;

  // Create a test post to like
  const postRes = await request(app)
    .post("/post/createPost")
    .set("Authorization", `Bearer ${authToken}`)
    .field("userId", testUserId)
    .field("content", "Post to be liked")
    .field("privacy", "public");

  testPostId = postRes.body.data._id;
});

afterAll(async () => {
  await Like.deleteMany({});
  await Post.deleteMany({ userId: testUserId });
  await User.deleteOne({ _id: testUserId });
  await mongoose.disconnect();
});

describe("📌 POST /like/like", () => {
  test("✅ Like a post successfully", async () => {
    const res = await request(app)
      .post("/like/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: testUserId, postId: testPostId });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Post liked");
    likeId = res.body.data._id;
  });

  test("❌ Fail to like the same post twice", async () => {
    const res = await request(app)
      .post("/like/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: testUserId, postId: testPostId });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Post already liked");
  });

  test("❌ Like post with invalid postId format", async () => {
    const res = await request(app)
      .post("/like/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: testUserId, postId: "invalidId123" });

    // Adjust status if you validate early, otherwise 500 expected
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe("📌 POST /like/unlike", () => {
  test("✅ Unlike a post successfully", async () => {
    const res = await request(app)
      .post("/like/unlike")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: testUserId, postId: testPostId });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Post unliked");
  });

  test("❌ Fail to unlike a post that wasn't liked", async () => {
    const res = await request(app)
      .post("/like/unlike")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: testUserId, postId: testPostId });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Like not found");
  });

  test("❌ Unlike post with invalid postId format", async () => {
    const res = await request(app)
      .post("/like/unlike")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: testUserId, postId: "notavalidobjectid" });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe("📌 GET /like/like/:postId", () => {
  test("✅ Get all likes for a post", async () => {
    // Like the post again to have something to fetch
    await request(app)
      .post("/like/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: testUserId, postId: testPostId });

    const res = await request(app).get(`/like/like/${testPostId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty("userId");
  });

  test("❌ Get likes with invalid postId format", async () => {
    const res = await request(app).get("/like/like/invalidPostId123");

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe("📌 Validation tests for Like/Unlike endpoints", () => {
  test("❌ Like post without userId", async () => {
    const res = await request(app)
      .post("/like/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ postId: testPostId }); // missing userId

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });

  test("❌ Like post without postId", async () => {
    const res = await request(app)
      .post("/like/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: testUserId }); // missing postId

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });

  test("❌ Unlike post without userId", async () => {
    const res = await request(app)
      .post("/like/unlike")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ postId: testPostId }); // missing userId

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test("❌ Unlike post without postId", async () => {
    const res = await request(app)
      .post("/like/unlike")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: testUserId }); // missing postId

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe("📌 Auth tests for Like endpoints", () => {
  test("❌ Like post without auth token", async () => {
    const res = await request(app)
      .post("/like/like")
      .send({ userId: testUserId, postId: testPostId });

    expect(res.statusCode).toBe(401);
  });

  test("❌ Unlike post without auth token", async () => {
    const res = await request(app)
      .post("/like/unlike")
      .send({ userId: testUserId, postId: testPostId });

    expect(res.statusCode).toBe(401);
  });
});
