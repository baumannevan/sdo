import request from "supertest";
import app from "../app.js";
import db from "../models/index.js";

let officerToken, memberToken, eventId;

beforeAll(async () => {
  // Sync DB and create test users
  await db.sequelize.sync({ force: true });
  await db.User.create({ firstName: "test", lastName: "test", password: "password", role: "Officer", email: "test2example.com@"});
  await db.User.create({ firstName: "test", lastName: "member", password: "password", email: "test@example.com"});

  // Login to get tokens
  const officerRes = await request(app)
    .post("/api/auth/login")
    .send({ username: "officer", password: "password" });
  officerToken = officerRes.body.token;

  const memberRes = await request(app)
    .post("/api/auth/login")
    .send({ username: "member", password: "password" });
  memberToken = memberRes.body.token;
});

describe("Event Routes", () => {
  test("Officer can create event", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${officerToken}`)
      .send({ title: "Meeting", description: "Monthly meeting", date: "2025-07-20" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Meeting");
    eventId = res.body.id;
  });

  test("Member cannot create event", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ title: "Unauthorized Event", description: "Should fail", date: "2025-07-21" });
    expect(res.statusCode).toBe(403);
  });

  test("Unauthenticated user cannot create event", async () => {
    const res = await request(app)
      .post("/api/events")
      .send({ title: "No Auth", description: "Should fail", date: "2025-07-22" });
    expect(res.statusCode).toBe(401);
  });

  test("Authenticated user can list events", async () => {
    const res = await request(app)
      .get("/api/events")
      .set("Authorization", `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Authenticated user can view event details", async () => {
    const res = await request(app)
      .get(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(eventId);
  });

  test("Officer can update event", async () => {
    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${officerToken}`)
      .send({ title: "Updated Meeting" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Meeting");
  });

  test("Member cannot update event", async () => {
    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ title: "Should Not Update" });
    expect(res.statusCode).toBe(403);
  });

  test("Officer can delete event", async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${officerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Event deleted");
  });

  test("Member cannot delete event", async () => {
    // Create another event for deletion test
    const createRes = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${officerToken}`)
      .send({ title: "Delete Test", description: "To be deleted", date: "2025-07-23" });
    const delEventId = createRes.body.id;
    const res = await request(app)
      .delete(`/api/events/${delEventId}`)
      .set("Authorization", `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(403);
  });

  test("Get event with invalid ID returns 404", async () => {
    const res = await request(app)
      .get("/api/events/99999")
      .set("Authorization", `Bearer ${officerToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("Update event with invalid ID returns 404", async () => {
    const res = await request(app)
      .put("/api/events/99999")
      .set("Authorization", `Bearer ${officerToken}`)
      .send({ title: "No Event" });
    expect(res.statusCode).toBe(404);
  });

  test("Delete event with invalid ID returns 404", async () => {
    const res = await request(app)
      .delete("/api/events/99999")
      .set("Authorization", `Bearer ${officerToken}`);
    expect(res.statusCode).toBe(404);
  });
});
