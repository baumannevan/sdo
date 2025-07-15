import express from "express";
import db from "../models/index.js";
import { authenticateToken } from "./auth.routes.js";

const router = express.Router();

// Helper: Officer-only middleware
function officerOnly(req, res, next) {
  if (req.user?.role !== "Officer") {
    return res.status(403).json({ error: "Officer access required." });
  }
  next();
}

// GET /events - get all events
router.get("/events", authenticateToken, async (req, res) => {
  try {
    const events = await db.Event.findAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /events - create new event (officer only)
router.post("/events", authenticateToken, officerOnly, async (req, res) => {
  try {
    const event = await db.Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /events/:id - get event details
router.get("/events/:id", authenticateToken, async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /events/:id - update event (officer only)
router.put("/events/:id", authenticateToken, officerOnly, async (req, res) => {
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
router.delete("/events/:id", authenticateToken, officerOnly, async (req, res) => {
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
