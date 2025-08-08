import express from "express";
import db from "../models/index.js";
import { authenticateCookie, officerOnly } from "../utils/authMiddleware.js";

const router = express.Router();

// POST /events/:id/rsvp - RSVP to an event
router.post("/:id/rsvp", authenticateCookie, async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    const { response } = req.body;

    const userId = req.user.id;

    // Upsert RSVP for this user and event
    let rsvp = await db.RSVP.findOne({
      where: {
        event_id: event.id,
        user_id: userId,
      },
    });

    if (rsvp) {
      rsvp.response = response;
      await rsvp.save();
    } else {
      rsvp = await db.RSVP.create({
        event_id: event.id,
        user_id: userId,
        response,
      });
    }

    res.status(201).json(rsvp);
  } catch (err) {
    console.error("RSVP POST error:", err);
    res.status(500).json({ error: err.message });
  }
});


// GET /events/:id/rsvps - Officers get all RSVPs, Members get only their own
router.get("/:id/rsvps", authenticateCookie, async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (req.user.role === "Officer") {
  // Get all users
  const users = await db.User.findAll({
    attributes: ["id", "firstName", "lastName", "email"],
  });

  // Get all RSVPs for this event including User association
  const rsvps = await db.RSVP.findAll({
    where: { event_id: event.id },
    include: [{ model: db.User, as: "User", attributes: ["id", "firstName", "lastName", "email"] }],
  });

  // Map RSVPs by user_id for quick lookup
  const rsvpMap = new Map(rsvps.map(r => [r.user_id, r.get({ plain: true })]));

  // Combine all users with their RSVP or default 'No Response'
  const combined = users.map(user => {
    const rsvp = rsvpMap.get(user.id);
    if (rsvp) {
      return rsvp; // already includes User fields
    } else {
      return {
        rsvpID: null,
        event_id: event.id,
        user_id: user.id,
        response: "No Response",
        User: user.get({ plain: true }), // ensure plain object
      };
    }
  });

  res.json(combined);
} else {
      // Member: get only their own RSVP for the event
      const rsvps = await db.RSVP.findAll({
        where: { event_id: event.id, user_id: req.user.id },
        include: [{ model: db.User, as: "User", attributes: ["id", "firstName", "lastName", "email"] }]
      });
      res.json(rsvps);
    }
  } catch (err) {
    console.error("RSVP GET error:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
