import express from "express";
import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Session version (changes every time server restarts)
const SESSION_VERSION = Date.now();

const router = express.Router();
// Secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET;
// Register route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, version: SESSION_VERSION },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set JWT as a cookie for browser/test compatibility
    res.cookie('_openresponse_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];

  // If not found, try to get from cookie
  if (!token && req.headers.cookie) {
    const cookies = Object.fromEntries(req.headers.cookie.split(';').map(c => {
      const [k, v] = c.trim().split('=');
      return [k, v];
    }));
    token = cookies._openresponse_session;
  }

  if (!token) {
    console.log("Auth Middleware: No token found");
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    
    if (decoded.version !== SESSION_VERSION) {
      return res.status(401).json({ error: "Token invalid after server restart" });
    }

    req.user = decoded;
    next();
  });
}


// TODO: CREATE TESTS FOR THIS
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, { attributes: ["id", "email", "role", "firstName", "lastName"] });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export { authenticateToken };
export default router;
