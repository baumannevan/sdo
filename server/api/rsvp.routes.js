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
// GET /events/:id/rsvps - Officers get all RSVPs, Members get only their own
router.get("/:id/rsvps", authenticateCookie, async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Get the current user's RSVP for this event
    const currentUserRsvp = await db.RSVP.findOne({
      where: { event_id: event.id, user_id: req.user.id },
      include: [
        { model: db.User, as: "User", attributes: ["id", "firstName", "lastName", "email"] }
      ]
    });

    // Convert to plain object and default if missing
    const userRsvp = currentUserRsvp
      ? currentUserRsvp.get({ plain: true })
      : {
          rsvpID: null,
          event_id: event.id,
          user_id: req.user.id,
          response: "No Response",
          User: {
            id: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email
          }
        };

    if (req.user.role === "Officer") {
      // Get all users
      const users = await db.User.findAll({
        attributes: ["id", "firstName", "lastName", "email"]
      });

      // Get all RSVPs for this event
      const rsvps = await db.RSVP.findAll({
        where: { event_id: event.id },
        include: [
          { model: db.User, as: "User", attributes: ["id", "firstName", "lastName", "email"] }
        ]
      });

      // Map RSVPs by user_id
      const rsvpMap = new Map(rsvps.map(r => [r.user_id, r.get({ plain: true })]));

      // Merge user list with RSVP data
      const combined = users.map(user => {
        const rsvp = rsvpMap.get(user.id);
        if (rsvp) {
          return rsvp;
        } else {
          return {
            rsvpID: null,
            event_id: event.id,
            user_id: user.id,
            response: "No Response",
            User: user.get({ plain: true })
          };
        }
      });

      res.json({ allRsvps: combined, userRsvp });
    } else {
      // Non-officer: only return their own RSVP
      res.json({ allRsvps: [], userRsvp });
    }
  } catch (err) {
    console.error("RSVP GET error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
