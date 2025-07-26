import request from "supertest";
import app from "../app.js";
import db from "../models/index.js";
import jwtUtils from "../utils/jwtUtils.js";
import { generateUserSession } from "../utils/sessionUtils.js";

let officer, member, officerCookies, memberCookies, eventId;

describe("Event RSVP Endpoints", () => {
  beforeAll(async () => {
    officer = await db.User.create({ firstName: "Test", lastName: "Officer", password: "password", role: "Officer", email: "officer2@example.com" });
    member = await db.User.create({ firstName: "Test", lastName: "Member", password: "password", role: "Intermediate Member", email: "member2@example.com" });
    const event = await db.Event.create({ name: "Test Event", description: "desc", date: "2025-07-25", location: "Test Hall" });
    eventId = event.id;
    const officerToken = jwtUtils.encode({ sub: officer.id, role: officer.role });
    const memberToken = jwtUtils.encode({ sub: member.id, role: member.role });
    const officerSession = await generateUserSession(officer);
    const memberSession = await generateUserSession(member);
    officerCookies = [`_openresponse_session=${officerToken}`, `xsrf-token=${officerSession.csrfToken}`];
    memberCookies = [`_openresponse_session=${memberToken}`, `xsrf-token=${memberSession.csrfToken}`];
  });

  afterAll(async () => {
    await db.User.destroy({ where: { email: ["officer2@example.com", "member2@example.com"] } });
    await db.Event.destroy({ where: { id: eventId } });
    await db.RSVP.destroy({ where: { event_id: eventId } });
    await db.sequelize.close();
  });

  test("Member can RSVP to an event", async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/rsvp`)
      .set("Cookie", memberCookies)
      .send({ response: "Yes" });
    expect(res.statusCode).toBe(201);
    expect(res.body.response).toBe("Yes");
    expect(res.body.event_id).toBe(eventId);
    expect(res.body.user_id).toBe(member.id);
  });

  test("Member can update their RSVP", async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/rsvp`)
      .set("Cookie", memberCookies)
      .send({ response: "No" });
    expect(res.statusCode).toBe(201);
    expect(res.body.response).toBe("No");
  });

  test("Officer can RSVP to an event", async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/rsvp`)
      .set("Cookie", officerCookies)
      .send({ response: "Maybe" });
    expect(res.statusCode).toBe(201);
    expect(res.body.response).toBe("Maybe");
    expect(res.body.user_id).toBe(officer.id);
  });

  test("Invalid RSVP response returns 400", async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/rsvp`)
      .set("Cookie", memberCookies)
      .send({ response: "Invalid" });
    expect(res.statusCode).toBe(400);
  });

  test("Officer can get list of RSVPs for event", async () => {
    const res = await request(app)
      .get(`/api/events/${eventId}/rsvps`)
      .set("Cookie", officerCookies);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("response");
    expect(res.body[0]).toHaveProperty("User");
  });

  test("Member cannot get list of RSVPs for event", async () => {
    const res = await request(app)
      .get(`/api/events/${eventId}/rsvps`)
      .set("Cookie", memberCookies);
    expect(res.statusCode).toBe(403);
  });
});
