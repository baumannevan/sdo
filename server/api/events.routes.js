import express from "express";
import db from "../models/index.js";
import jwtUtils from "../utils/jwtUtils.js"; // For decoding JWT from cookies

const router = express.Router();

// Cookie-based authentication middleware
function authenticateCookie(req, res, next) {
  // Extract JWT from cookie named _openresponse_session
  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(cookieHeader.split(';').map(c => {
    const [k, v] = c.trim().split('=');
    return [k, v];
  }));
  const token = cookies._openresponse_session;
  if (!token) return res.status(401).json({ error: "Authentication required (cookie missing)" });
  try {
    req.user = jwtUtils.decode(token); // Attach user info to req
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid authentication cookie" });
  }
}

// Helper: Officer-only middleware
function officerOnly(req, res, next) {
  if (req.user?.role !== "Officer") {
    return res.status(403).json({ error: "Officer access required." });
  }
  next();
}

// GET /events - get all events
router.get("/", authenticateCookie, async (req, res) => {
  try {
    const events = await db.Event.findAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /events - create new event (officer only)
router.post("/", authenticateCookie, officerOnly, async (req, res) => {
  try {
    const event = await db.Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /events/:id - get event details
router.get("/:id", authenticateCookie, async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /events/:id - update event (officer only)
router.put("/:id", authenticateCookie, officerOnly, async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    await event.update(req.body);
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /events/:id - delete event (officer only)
router.delete("/:id", authenticateCookie, officerOnly, async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    await event.destroy();
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
