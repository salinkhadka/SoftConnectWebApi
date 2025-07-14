require("dotenv").config();
const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

const User = require("../Model/UserModel");
const Post = require("../Model/PostModel");
const Like = require("../Model/LikeModel");

jest.setTimeout(20000);

let authToken = "";
let userId = "";
let postId = "";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Cleanup test data
  await User.deleteOne({ email: "likeuser@gmail.com" });

  // Create a user
  const registerRes = await request(app).post("/user/register").send({
    username: "likeuser",
    email: "likeuser@gmail.com",
    password: "1234567890",
  });

  expect(registerRes.statusCode).toBe(201);

  // Login
  const loginRes = await request(app).post("/user/login").send({
    email: "likeuser@gmail.com",
    password: "1234567890",
  });

  expect(loginRes.body.token).toBeDefined();
  authToken = loginRes.body.token;
  userId = loginRes.body.data._id;

  // Create a post to like
  const postRes = await request(app)
    .post("/post/createPost")
    .set("Authorization", `Bearer ${authToken}`)
    .send({
      userId,
      content: "Test post for like",
      privacy: "public",
    });

  expect(postRes.statusCode).toBe(201);
  postId = postRes.body.data._id;
});

afterAll(async () => {
  await Like.deleteMany({});
  await Post.deleteMany({ userId });
  await User.deleteOne({ _id: userId });
  await mongoose.connection.close();
});

describe("Like API", () => {
  test("can like a post", async () => {
    const res = await request(app)
      .post("/like/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId, postId });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Post liked");
  });

  test("cannot like a post twice", async () => {
    const res = await request(app)
      .post("/like/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId, postId });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already liked/i);
  });

  test("can get likes for a post", async () => {
    const res = await request(app).get(`/like/like/${postId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.success).toBe(true);
  });

  test("can unlike a post", async () => {
    const res = await request(app)
      .post("/like/unlike")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId, postId });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Post unliked");
  });
});
