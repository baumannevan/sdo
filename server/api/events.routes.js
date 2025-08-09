import express from "express";
import db from "../models/index.js";
import { authenticateCookie, officerOnly } from "../utils/authMiddleware.js";

const router = express.Router();

// GET /events - get all events
router.get("/", authenticateCookie, async (req, res) => {
  try {
    const events = await db.Event.findAll({
      include: [
        {
          model: db.RequiredRole,
          as: "requiredRoles",
          attributes: ["role"], // only return the role, not IDs
        },
      ],
    });

    // Flatten the roles into a simple array if you want to keep the structure similar
    const result = events.map(event => {
      const plainEvent = event.get({ plain: true });
      plainEvent.requiredRoles = plainEvent.requiredRoles.map(r => r.role);
      return plainEvent;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /events/:id - get event details
router.get("/:id", authenticateCookie, async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id, {
      include: [
        {
          model: db.RequiredRole,
          as: "requiredRoles",
          attributes: ["role"],
        },
      ],
    });

    if (!event) return res.status(404).json({ error: "Event not found" });

    const plainEvent = event.get({ plain: true });
    plainEvent.requiredRoles = plainEvent.requiredRoles.map(r => r.role);

    res.json(plainEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST /events - create new event (officer only)
router.post("/", authenticateCookie, officerOnly, async (req, res) => {
  const { requiredRole, ...eventData } = req.body;

  try {
    // Create event first
    const event = await db.Event.create(eventData);

    // Create RequiredRole entries if provided
    if (Array.isArray(requiredRole) && requiredRole.length > 0) {
      const roleEntries = requiredRole.map((role) => ({
        eventId: event.id,
        role,
      }));

      await db.RequiredRole.bulkCreate(roleEntries);
    }

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /events/:id - update event (officer only)
router.put("/:id", authenticateCookie, officerOnly, async (req, res) => {
  const { requiredRole, ...eventData } = req.body;

  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Update event data
    await event.update(eventData);

    if (Array.isArray(requiredRole)) {
      // Clear old roles for this event
      await db.RequiredRole.destroy({ where: { eventId: event.id } });

      // Add new ones
      if (requiredRole.length > 0) {
        const roleEntries = requiredRole.map((role) => ({
          eventId: event.id,
          role,
        }));

        await db.RequiredRole.bulkCreate(roleEntries);
      }
    }

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

