// Authentication Logic Unit Tests
// These tests use Jest to directly test the authentication logic (password hashing, JWT creation/verification)

//   npm test
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

describe("Auth Logic", () => {
  const password = "testpassword";
  let hashedPassword;
  const userPayload = { id: 1, email: "testuser@example.com", role: "Officer" };
  let token;

  it("should hash and verify a password", async () => {
    hashedPassword = await bcrypt.hash(password, 10);
    expect(hashedPassword).not.toBe(password);
    const isMatch = await bcrypt.compare(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it("should create a JWT token and verify it", () => {
    token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "1d" });
    expect(token).toBeDefined();
    const decoded = jwt.verify(token, JWT_SECRET);
    expect(decoded.email).toBe(userPayload.email);
    expect(decoded.role).toBe(userPayload.role);
    expect(decoded.id).toBe(userPayload.id);
  });

  it("should fail to verify an invalid JWT token", () => {
    expect(() => jwt.verify(token + "invalid", JWT_SECRET)).toThrow();
  });

  it("should not hash the same password to the same value twice (salted)", async () => {
    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(password, 10);
    expect(hash1).not.toBe(hash2); // Salting should make hashes different
  });

  it("should not verify a password with a hash from a different password", async () => {
    const wrongPassword = "wrongpassword";
    const isMatch = await bcrypt.compare(wrongPassword, hashedPassword);
    expect(isMatch).toBe(false);
  });

  it("should create a JWT token that expires", async () => {
    // Create a token that expires in 1 second
    const shortLivedToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: 1 });
    expect(shortLivedToken).toBeDefined();
    // Wait 2 seconds and verify it is expired
    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(() => jwt.verify(shortLivedToken, JWT_SECRET)).toThrow();
  });

  it("should not verify a JWT token with the wrong secret", () => {
    const wrongSecret = "not_the_right_secret";
    expect(() => jwt.verify(token, wrongSecret)).toThrow();
  });
});
