require("dotenv").config();
const request = require("supertest");
const app = require("../index"); // Your Express app
const mongoose = require("mongoose");
const connectDB = require("../Config/db");
const User = require("../Model/UserModel");
const Post = require("../Model/PostModel");

jest.setTimeout(20000);

let authToken = "";
let userId = "";
let postId = "";

beforeAll(async () => {
  await connectDB();

  await User.deleteOne({ email: "testpost@gmail.com" });
  const userRes = await request(app).post("/user/register").send({
    username: "testpostuser",
    email: "testpost@gmail.com",
    password: "test123456",
  });

  const loginRes = await request(app).post("/user/login").send({
    email: "testpost@gmail.com",
    password: "test123456",
  });

  authToken = loginRes.body.token;
  userId = loginRes.body.data._id;
});

afterAll(async () => {
  await Post.deleteMany({ userId });
  await User.deleteOne({ _id: userId });
  await mongoose.disconnect();
});

describe("Post API", () => {
  test("should create a post", async () => {
    const res = await request(app)
      .post("/post/createPost")
      .set("Authorization", `Bearer ${authToken}`)
      .field("userId", userId)
      .field("content", "Test post content")
      .field("privacy", "public");

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toBe("Test post content");

    postId = res.body.data._id;
  });

  test("should get all posts", async () => {
    const res = await request(app).get("/post");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("should get one post by ID", async () => {
    const res = await request(app).get(`/post/${postId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(postId);
  });

  test("should update a post", async () => {
    const res = await request(app)
      .put(`/post/${postId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .field("content", "Updated content");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toBe("Updated content");
  });

  test("should get user’s posts", async () => {
    const res = await request(app).get(`/post/user/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("should delete a post", async () => {
    const res = await request(app)
      .delete(`/post/${postId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
