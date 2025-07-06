import express from "express";
import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
// Secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET;


// Register route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password || !role) {
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
      role,
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
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

export { authenticateToken };
export default router;
