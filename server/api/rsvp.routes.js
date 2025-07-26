import express from "express";
import db from "../models/index.js";
import { authenticateCookie, officerOnly } from "../utils/authMiddleware.js";

const router = express.Router();

// POST /events/:id/rsvp - RSVP to an event
router.post("/:id/rsvp", authenticateCookie, async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    const { response } = req.body;
    if (!["Yes", "No", "Maybe"].includes(response)) {
      return res.status(400).json({ error: "Invalid response" });
    }
    // Upsert RSVP for this user/event
    let rsvp = await db.RSVP.findOne({ where: { event_id: event.id, user_id: req.user.sub } });
    if (rsvp) {
      rsvp.response = response;
      await rsvp.save();
    } else {
      rsvp = await db.RSVP.create({ event_id: event.id, user_id: req.user.sub, response });
    }
    res.status(201).json(rsvp);
  } catch (err) {
    console.error('RSVP POST error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /events/:id/rsvps - Get list of RSVPs for event (officer only)
router.get("/:id/rsvps", authenticateCookie, officerOnly, async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    const rsvps = await db.RSVP.findAll({
      where: { event_id: event.id },
      include: [{ model: db.User, as: "User", attributes: ["id", "firstName", "lastName", "email"] }]
    });
    res.json(rsvps);
  } catch (err) {
    console.error('RSVP GET error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
