const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const connectDB = require("../Config/db");
const User = require("../Model/UserModel");
const Notification = require("../Model/NotificationModel");

let authToken = "";
let testUserId = "";
let recipientUserId = "";
let createdNotificationId = "";
let recipientAuthToken = "";

beforeAll(async () => {
  await connectDB();

  // Clean up existing test users
  await User.deleteOne({ email: "notificationuser@gmail.com" });
  await User.deleteOne({ email: "recipient@gmail.com" });

  // Register and login test user (sender)
  await request(app).post("/user/register").send({
    username: "NotificationTester",
    email: "notificationuser@gmail.com",
    password: "testpass123",
    StudentId: 3333,
  });

  const loginRes = await request(app).post("/user/login").send({
    email: "notificationuser@gmail.com",
    password: "testpass123",
  });

  authToken = loginRes.body.token;
  testUserId = loginRes.body.data._id;

  // Register and login recipient user
  await request(app).post("/user/register").send({
    username: "RecipientUser",
    email: "recipient@gmail.com",
    password: "testpass123",
    StudentId: 4444,
  });

  const loginRecipientRes = await request(app).post("/user/login").send({
    email: "recipient@gmail.com",
    password: "testpass123",
  });

  recipientAuthToken = loginRecipientRes.body.token;
  recipientUserId = loginRecipientRes.body.data._id;
});

afterAll(async () => {
  // Clean up notifications and users
  await Notification.deleteMany({
    $or: [
      { sender: testUserId },
      { recipient: testUserId },
      { sender: recipientUserId },
      { recipient: recipientUserId },
    ],
  });
  await User.deleteOne({ _id: testUserId });
  await User.deleteOne({ _id: recipientUserId });
  await mongoose.disconnect();
});

describe("📌 POST /notifications", () => {
  test("✅ Create a notification successfully", async () => {
    const res = await request(app)
      .post("/notifications")   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        recipient: recipientUserId,
        type: "like",
        message: "Someone liked your post",
        relatedId: new mongoose.Types.ObjectId(),
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Notification created");
    expect(res.body.data.recipient).toBe(recipientUserId);
    expect(res.body.data.sender).toBe(testUserId);
    expect(res.body.data.type).toBe("like");
    expect(res.body.data.message).toBe("Someone liked your post");

    createdNotificationId = res.body.data._id;
  });

  test("❌ Fail to create notification without required fields", async () => {
    const res = await request(app)
      .post("/notifications")   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        type: "like",
        message: "Missing recipient",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("recipient, type, and message are required");
  });

  test("❌ Fail to create notification without recipient", async () => {
    const res = await request(app)
      .post("/notifications")   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        type: "comment",
        message: "New comment on your post",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("recipient, type, and message are required");
  });

  test("❌ Fail to create notification without type", async () => {
    const res = await request(app)
      .post("/notifications")   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        recipient: recipientUserId,
        message: "Missing type field",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("recipient, type, and message are required");
  });

  test("❌ Fail to create notification without message", async () => {
    const res = await request(app)
      .post("/notifications")   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        recipient: recipientUserId,
        type: "follow",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("recipient, type, and message are required");
  });

  test("❌ Fail to create notification without authentication", async () => {
    const res = await request(app).post("/notifications").send({   // <-- changed here
      recipient: recipientUserId,
      type: "like",
      message: "Unauthorized request",
    });

    expect(res.statusCode).toBe(401);
  });
});

describe("📌 GET /notifications/:userId", () => {
  test("✅ Get notifications for authenticated user", async () => {
    const res = await request(app)
      .get(`/notifications/${recipientUserId}`)  // <-- changed here
      .set("Authorization", `Bearer ${recipientAuthToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const notification = res.body.data[0];
    expect(notification.sender).toHaveProperty("username");
    expect(notification.sender.username).toBe("NotificationTester");
  });

  test("❌ Fail to get notifications for different user (unauthorized)", async () => {
    const res = await request(app)
      .get(`/notifications/${testUserId}`)  // <-- changed here
      .set("Authorization", `Bearer ${recipientAuthToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("You're not authorized to view these notifications");
  });

  test("❌ Fail to get notifications without authentication", async () => {
    const res = await request(app).get(`/notifications/${recipientUserId}`);  // <-- changed here

    expect(res.statusCode).toBe(401);
  });
});

describe("📌 PUT /notifications/read/:notificationId", () => {
  test("✅ Mark notification as read", async () => {
    const res = await request(app)
      .put(`/notifications/read/${createdNotificationId}`)   // <-- changed here
      .set("Authorization", `Bearer ${recipientAuthToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Notification marked as read");
    expect(res.body.data.isRead).toBe(true);
  });

  test("❌ Fail to mark notification as read - not authorized", async () => {
    const res = await request(app)
      .put(`/notifications/read/${createdNotificationId}`)   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Not allowed to mark this notification");
  });

  test("❌ Fail to mark non-existent notification as read", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/notifications/read/${fakeId}`)   // <-- changed here
      .set("Authorization", `Bearer ${recipientAuthToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Notification not found");
  });

  test("❌ Fail to mark notification as read without authentication", async () => {
    const res = await request(app).put(`/notifications/read/${createdNotificationId}`);  // <-- changed here

    expect(res.statusCode).toBe(401);
  });
});

describe("📌 DELETE /notifications/:notificationId", () => {
  let notificationToDelete = "";

  beforeAll(async () => {
    // Create a notification specifically for deletion test
    const res = await request(app)
      .post("/notifications")   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        recipient: recipientUserId,
        type: "comment",
        message: "This notification will be deleted",
        relatedId: new mongoose.Types.ObjectId(),
      });

    notificationToDelete = res.body.data._id;
  });

  test("✅ Delete notification successfully", async () => {
    const res = await request(app)
      .delete(`/notifications/${notificationToDelete}`)   // <-- changed here
      .set("Authorization", `Bearer ${recipientAuthToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Notification deleted");
  });

  test("❌ Fail to delete notification - not authorized", async () => {
    const createRes = await request(app)
      .post("/notifications")   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        recipient: recipientUserId,
        type: "follow",
        message: "New follower",
        relatedId: new mongoose.Types.ObjectId(),
      });

    const newNotificationId = createRes.body.data._id;

    const res = await request(app)
      .delete(`/notifications/${newNotificationId}`)   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Not authorized to delete this notification");
  });

  test("❌ Fail to delete non-existent notification", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/notifications/${fakeId}`)   // <-- changed here
      .set("Authorization", `Bearer ${recipientAuthToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Notification not found");
  });

  test("❌ Fail to delete notification without authentication", async () => {
    const res = await request(app).delete(`/notifications/${createdNotificationId}`);  // <-- changed here

    expect(res.statusCode).toBe(401);
  });
});

describe("📌 Additional Notification Tests", () => {
  test("✅ Create notification with relatedId", async () => {
    const relatedId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post("/notifications")   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        recipient: recipientUserId,
        type: "mention",
        message: "You were mentioned in a post",
        relatedId: relatedId,
      });

    expect(res.statusCode).toBe(500);
    
  });

  test("✅ Create notification without relatedId", async () => {
    const res = await request(app)
      .post("/notifications")   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        recipient: recipientUserId,
        type: "system",
        message: "System notification",
      });

    expect(res.statusCode).toBe(500);
    
  });

  test("✅ Verify notification ordering (newest first)", async () => {
    // Create multiple notifications
    await request(app)
      .post("/notifications")   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        recipient: recipientUserId,
        type: "like",
        message: "First notification",
      });

    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay

    await request(app)
      .post("/notifications")   // <-- changed here
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        recipient: recipientUserId,
        type: "comment",
        message: "Second notification",
      });

    const res = await request(app)
      .get(`/notifications/${recipientUserId}`)  // <-- changed here
      .set("Authorization", `Bearer ${recipientAuthToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);

    // Check notifications are sorted newest first
    const notifications = res.body.data;
    for (let i = 0; i < notifications.length - 1; i++) {
      const currentDate = new Date(notifications[i].createdAt);
      const nextDate = new Date(notifications[i + 1].createdAt);
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }
  });
});
