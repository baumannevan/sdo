import express from "express";
import db from "../models/index.js";
import { authenticateCookie, officerOnly } from "../utils/authMiddleware.js";

const router = express.Router();

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

