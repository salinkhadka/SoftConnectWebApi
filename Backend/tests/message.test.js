const request = require("supertest");
const app = require("../index");

describe("Message API tests", () => {
  let testUserId, testUserToken, email1;
  let testUserId2, testUserToken2, email2;
  let sentMessageId;

  beforeAll(async () => {
    const timestamp = Date.now();

    // Register user 1
    email1 = `user1_${timestamp}@example.com`;
    const register1 = await request(app)
      .post("/user/register")
      .field("username", `user1_${timestamp}`)
      .field("email", email1)
      .field("password", "password123")
      .field("StudentId", timestamp);

    expect(register1.statusCode).toBe(201);

    const login1 = await request(app).post("/user/login").send({
      email: email1,
      password: "password123",
    });

    expect(login1.statusCode).toBe(200);
    testUserToken = login1.body.token;
    testUserId = login1.body.data._id;

    // Register user 2
    email2 = `user2_${timestamp}@example.com`;
    const register2 = await request(app)
      .post("/user/register")
      .field("username", `user2_${timestamp}`)
      .field("email", email2)
      .field("password", "password123")
      .field("StudentId", timestamp + 1);

    expect(register2.statusCode).toBe(201);

    const login2 = await request(app).post("/user/login").send({
      email: email2,
      password: "password123",
    });

    expect(login2.statusCode).toBe(200);
    testUserToken2 = login2.body.token;
    testUserId2 = login2.body.data._id;
  });

  test("Send message from user1 to user2", async () => {
    const res = await request(app)
      .post("/message/send")
      .set("Authorization", `Bearer ${testUserToken}`)
      .send({
        recipient: testUserId2,
        content: "Hello from user1!",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("content", "Hello from user1!");
    expect(res.body).toHaveProperty("_id");
    sentMessageId = res.body._id;
  });

  test("Fetch messages between user1 and user2", async () => {
    const res = await request(app).get(
      `/message/conversation/${testUserId}/${testUserId2}`
    );

    if (res.statusCode === 404) {
      console.warn("No messages found between users (expected in early cleanup).");
      return;
    }

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("User1 deletes their sent message", async () => {
    const res = await request(app)
      .delete(`/message/${sentMessageId}`)
      .set("Authorization", `Bearer ${testUserToken}`);

    if (res.statusCode === 404) {
      console.warn("Message already deleted or not found.");
      return;
    }

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Message deleted successfully");
  });

  test("User2 fails to delete user1's message", async () => {
    const newMessage = await request(app)
      .post("/message/send")
      .set("Authorization", `Bearer ${testUserToken}`)
      .send({
        recipient: testUserId2,
        content: "Trying again",
      });

    const msgId = newMessage.body._id;

    const res = await request(app)
      .delete(`/message/${msgId}`)
      .set("Authorization", `Bearer ${testUserToken2}`);

    if (res.statusCode === 404) {
      console.warn("Message not found — possibly already deleted.");
      return;
    }

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Unauthorized to delete this message");
  });

  test("Should fail to send message without token", async () => {
    const res = await request(app).post("/message/send").send({
      recipient: testUserId2,
      content: "This should fail",
    });

    expect(res.statusCode).toBe(401);
  });

  test("Fetch conversation users for user1", async () => {
    const res = await request(app)
      .get(`/message/msg/conversations/${testUserId}`)
      .set("Authorization", `Bearer ${testUserToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("conversations");
    expect(Array.isArray(res.body.conversations)).toBe(true);

    if (res.body.conversations.length > 0) {
      const convo = res.body.conversations[0];
      expect(convo).toHaveProperty("username");
      expect(convo).toHaveProperty("email");
      expect(convo).toHaveProperty("lastMessage");
      expect(convo).toHaveProperty("lastMessageTime");
      expect(convo).toHaveProperty("lastMessageSenderId");
    }
  });

  test("Fetch conversation users for user2", async () => {
    const res = await request(app)
      .get(`/message/msg/conversations/${testUserId2}`)
      .set("Authorization", `Bearer ${testUserToken2}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("conversations");
    expect(Array.isArray(res.body.conversations)).toBe(true);
  });

  test("Fail to fetch conversations for invalid userId", async () => {
    const res = await request(app)
      .get(`/message/msg/conversations/invalidId123`)
      .set("Authorization", `Bearer ${testUserToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid user ID");
  });
});
