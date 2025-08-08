import express from "express";
import db from "../models/index.js";
import jwtUtils from "../utils/jwtUtils.js"; // For decoding JWT from cookies
import { authenticateCookie, officerOnly } from "../utils/authMiddleware.js";


const router = express.Router();

// TODO: add an enpoint as an officer to update the role of other members

// GET /users/:id/dues - Get dues info for user 
// Officers can get any user's dues info; members can only get their own
router.get("/:id/dues", authenticateCookie, async (req, res) => {
  try {
    const requestingUser = await db.User.findByPk(req.user.sub);
    const targetUser = await db.User.findByPk(req.params.id, {
      attributes: ["id", "firstName", "lastName", "email", "dues"]
    });
    if (!targetUser) return res.status(404).json({ error: "User not found" });
    // Officer can get anyone's info, member only their own
    if (requestingUser.role !== "Officer" && requestingUser.id !== targetUser.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json({
      id: targetUser.id,
      firstName: targetUser.firstName,
      lastName: targetUser.lastName,
      email: targetUser.email,
      dues: targetUser.dues
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /users/:id/dues - Update dues info (officer only)
router.put("/:id/dues", authenticateCookie, officerOnly, async (req, res) => {
  try {
    const { dues } = req.body;
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (typeof dues !== "undefined") user.dues = dues;
    await user.save();
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dues: user.dues
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PUT /users/:id/role - Update role info (officer only)
router.put("/:id/role", authenticateCookie, officerOnly, async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role input (optional but recommended)
    const validRoles = ["Officer", "Intermediate Member", "Associate Member"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    // Find the user by ID
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update the user's role
    user.role = role;
    await user.save();

    res.status(200).json({ message: "Role updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /users - Get list of all users
router.get("/", authenticateCookie, async (req, res) => {
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

