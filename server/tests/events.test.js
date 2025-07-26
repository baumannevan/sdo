import request from "supertest";
import app from "../app.js";
import db from "../models/index.js";
import jwtUtils from "../utils/jwtUtils.js"; // Utility for JWT encoding/decoding
import { generateUserSession } from "../utils/sessionUtils.js"; // Utility for session generation

let officer, member, officerCookies, memberCookies, eventId;

beforeAll(async () => {
  // Create test users with correct fields for API
  officer = await db.User.create({ firstName: "test", lastName: "officer", password: "password", role: "Officer", email: "test2example.com@" });
  member = await db.User.create({ firstName: "test", lastName: "member", password: "password", role: "Intermediate Member", email: "test@example.com" });

  // Generate JWT tokens for users
  const officerToken = jwtUtils.encode({ sub: officer.id, role: officer.role });
  const memberToken = jwtUtils.encode({ sub: member.id, role: member.role });

  // Generate session objects for users
  const officerSession = await generateUserSession(officer);
  const memberSession = await generateUserSession(member);

  // Prepare cookies for requests
  officerCookies = [`_openresponse_session=${officerToken}`, `xsrf-token=${officerSession.csrfToken}`];
  memberCookies = [`_openresponse_session=${memberToken}`, `xsrf-token=${memberSession.csrfToken}`];
});

afterAll(async () => {
  // Clean up created users and events
  await db.User.destroy({ where: { email: ["test2example.com@", "test@example.com"] } });
  await db.Event.destroy({ where: {} }); // Remove all events created during tests
  await db.sequelize.close(); // Close DB connection
});

describe("Event Routes", () => {
  test("Officer can create event", async () => {
    // Attach cookies for officer authentication
    const res = await request(app)
      .post("/api/events")
      .set("Cookie", officerCookies)
      .send({ name: "Meeting", description: "Monthly meeting", date: "2025-07-20", location: "Main Hall" });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Meeting");
    eventId = res.body.id;
  });

  test("Member cannot create event", async () => {
    // Attach cookies for member authentication
    const res = await request(app)
      .post("/api/events")
      .set("Cookie", memberCookies)
      .send({ name: "Unauthorized Event", description: "Should fail", date: "2025-07-21", location: "Main Hall" });
    expect(res.statusCode).toBe(403);
  });

  test("Unauthenticated user cannot create event", async () => {
    const res = await request(app)
      .post("/api/events")
      .send({ name: "No Auth", description: "Should fail", date: "2025-07-22", location: "Main Hall" });
    expect(res.statusCode).toBe(401);
  });

  test("Authenticated user can list events", async () => {
    // Attach cookies for member authentication
    const res = await request(app)
      .get("/api/events")
      .set("Cookie", memberCookies);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Authenticated user can view event details", async () => {
    // Attach cookies for member authentication
    const res = await request(app)
      .get(`/api/events/${eventId}`)
      .set("Cookie", memberCookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(eventId);
  });

  test("Officer can update event", async () => {
    // Attach cookies for officer authentication
    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .set("Cookie", officerCookies)
      .send({ name: "Updated Meeting" });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Meeting");
  });

  test("Member cannot update event", async () => {
    // Attach cookies for member authentication
    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .set("Cookie", memberCookies)
      .send({ name: "Should Not Update" });
    expect(res.statusCode).toBe(403);
  });

  test("Officer can delete event", async () => {
    // Attach cookies for officer authentication
    const res = await request(app)
      .delete(`/api/events/${eventId}`)
      .set("Cookie", officerCookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Event deleted");
  });

  test("Member cannot delete event", async () => {
    // Create another event for deletion test
    const createRes = await request(app)
      .post("/api/events")
      .set("Cookie", officerCookies)
      .send({ name: "Delete Test", description: "To be deleted", date: "2025-07-23", location: "Main Hall" });
    const delEventId = createRes.body.id;
    const res = await request(app)
      .delete(`/api/events/${delEventId}`)
      .set("Cookie", memberCookies);
    expect(res.statusCode).toBe(403);
  });

  test("Get event with invalid ID returns 404", async () => {
    // Attach cookies for officer authentication
    const res = await request(app)
      .get("/api/events/99999")
      .set("Cookie", officerCookies);
    expect(res.statusCode).toBe(404);
  });

  test("Update event with invalid ID returns 404", async () => {
    // Attach cookies for officer authentication
    const res = await request(app)
      .put("/api/events/99999")
      .set("Cookie", officerCookies)
      .send({ name: "No Event" });
    expect(res.statusCode).toBe(404);
  });

  test("Delete event with invalid ID returns 404", async () => {
    // Attach cookies for officer authentication
    const res = await request(app)
      .delete("/api/events/99999")
      .set("Cookie", officerCookies);
    expect(res.statusCode).toBe(404);
  });
});
