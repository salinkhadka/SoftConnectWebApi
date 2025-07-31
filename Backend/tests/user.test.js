require("dotenv").config();
const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const connectDB = require("../Config/db");
const User = require("../Model/UserModel");
const jwt = require("jsonwebtoken");

jest.setTimeout(20000);

let authToken = "";
let testUserId = "";

// Generate unique identifier for this test run
const testRunId = `usertest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const testEmail = `ram345_${testRunId}@gmail.com`;

beforeAll(async () => {
  await connectDB();
  await User.deleteOne({ email: testEmail });
});

afterAll(async () => {
  // Clean up the test user
  if (testUserId) {
    await User.deleteOne({ _id: testUserId });
  }
  await mongoose.disconnect();
});

describe("User API full suite", () => {
  test("Registration with missing fields fails", async () => {
    const res = await request(app).post("/user/register").send({
      username: "ram",
      email: "ram2000@gmail.com",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("Register new user", async () => {
    const res = await request(app).post("/user/register").send({
      username: `rameyyyyy_${testRunId}`,
      email: testEmail,
      password: "1234567890",
      StudentId: parseInt(testRunId.replace(/\D/g, '').slice(-4)) || 9876,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test("Login existing user", async () => {
    const res = await request(app).post("/user/login").send({
      email: testEmail,
      password: "1234567890",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    authToken = res.body.token;
    testUserId = res.body.data._id;
  });

  test("Get user by ID", async () => {
    const res = await request(app).get(`/user/${testUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(testEmail);
  });

  test("Update user info", async () => {
    const res = await request(app)
      .put(`/user/${testUserId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ bio: `Updated Bio - ${testRunId}` });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.bio).toBe(`Updated Bio - ${testRunId}`);
  });

  test("Verify password correctly", async () => {
    const res = await request(app).post("/user/verify-password").send({
      userId: testUserId,
      currentPassword: "1234567890",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("Send password reset email", async () => {
    const res = await request(app)
      .post("/user/request-reset")
      .send({ email: testEmail });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  describe("Admin features", () => {
    beforeAll(async () => {
      await User.findByIdAndUpdate(testUserId, { role: "admin" });
    });

    test("Fetch all users as admin", async () => {
      const res = await request(app)
        .get("/user/getAll")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("Delete user by ID as admin", async () => {
      const res = await request(app)
        .delete(`/user/${testUserId}`)
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});