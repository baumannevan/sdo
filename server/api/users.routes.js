import express from "express";
import db from "../models/index.js";
import jwtUtils from "../utils/jwtUtils.js"; // For decoding JWT from cookies
import { authenticateCookie, officerOnly } from "../utils/authMiddleware.js";


const router = express.Router();


// GET /users - Get list of all users (officer only)
router.get("/", authenticateCookie, officerOnly, async (req, res) => {
  try {
    const users = await db.User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /users/:id - Get user by ID (any authenticated user)
router.get("/:id", authenticateCookie, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id, { attributes: { exclude: ["password"] } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

