import request from "supertest";
import app from "../app.js";
import db from "../models/index.js";
import jwtUtils from "../utils/jwtUtils.js";
import { generateUserSession } from "../utils/sessionUtils.js";

let officer, member, officerCookies, memberCookies, userId;

describe("User Routes", () => {
  beforeAll(async () => {
    // Create test users
    officer = await db.User.create({ firstName: "Test", lastName: "Officer", password: "password", role: "Officer", email: "officer@example.com" });
    member = await db.User.create({ firstName: "Test", lastName: "Member", password: "password", role: "Intermediate Member", email: "member@example.com" });

    // Generate JWT tokens
    const officerToken = jwtUtils.encode({ sub: officer.id, role: officer.role });
    const memberToken = jwtUtils.encode({ sub: member.id, role: member.role });

    // Generate sessions
    const officerSession = await generateUserSession(officer);
    const memberSession = await generateUserSession(member);

    // Prepare cookies
    officerCookies = [`_openresponse_session=${officerToken}`, `xsrf-token=${officerSession.csrfToken}`];
    memberCookies = [`_openresponse_session=${memberToken}`, `xsrf-token=${memberSession.csrfToken}`];

    userId = member.id;
  });

  afterAll(async () => {
    await db.User.destroy({ where: { email: ["officer@example.com", "member@example.com"] } });
    await db.sequelize.close();
  });

  test("Officer can list all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Cookie", officerCookies);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).not.toHaveProperty("password");
  });

  test("Member cannot list all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Cookie", memberCookies);
    expect(res.statusCode).toBe(403);
  });

  test("Officer can get user by ID", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Cookie", officerCookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body).not.toHaveProperty("password");
  });

  test("Member can get user by ID", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Cookie", memberCookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body).not.toHaveProperty("password");
  });

  test("Unauthenticated user cannot get user by ID", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(401);
  });

  test("Get user with invalid ID returns 404", async () => {
    const res = await request(app)
      .get(`/api/users/99999`)
      .set("Cookie", officerCookies);
    expect(res.statusCode).toBe(404);
  });
});
