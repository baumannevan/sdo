import express from "express";
import db from "../models/index.js";
import { authenticateCookie, officerOnly } from "../utils/authMiddleware.js";

const router = express.Router();

// POST /attendance
// Create attendance record for user and event (officer only)
router.post("/", authenticateCookie, officerOnly, async (req, res) => {
  const { eventId, userId, attended } = req.body;

  try {
    // Check event and user existence (optional)
    const event = await db.Event.findByPk(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const user = await db.User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent duplicate attendance record
    const existing = await db.AttendanceSheet.findOne({ where: { eventId, userId } });
    if (existing) {
      return res.status(400).json({ error: "Attendance record already exists" });
    }

    const attendance = await db.AttendanceSheet.create({
      eventId,
      userId,
      attended: attended === true,
    });

    res.status(201).json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /attendance
// Update attendance by eventId and userId (officer only)
router.put("/", authenticateCookie, officerOnly, async (req, res) => {
  const { eventId, userId, attended } = req.body;

  try {
    const attendance = await db.AttendanceSheet.findOne({ where: { eventId, userId } });
    if (!attendance) return res.status(404).json({ error: "Attendance record not found" });

    attendance.attended = attended === true;
    await attendance.save();

    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /attendance/:eventId
// Get attendance records for event
// Officers get all attendance, others get only their own attendance for that event
router.get("/:eventId", authenticateCookie, async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  console.log("/n/n/n/n here!!!!")

  try {
    if (userRole === "Officer") {
      // Officer: get all attendance for the event
      const allAttendance = await db.AttendanceSheet.findAll({
        where: { eventId },
        include: [{ model: db.User, as: "User", attributes: ["id", "firstName", "lastName", "email", "role"] }],
      });
      return res.json(allAttendance);
    } else {
      // Non-officer: get only their own attendance record
      const attendance = await db.AttendanceSheet.findOne({
        where: { eventId, userId },
      });

      if (!attendance) return res.status(404).json({ error: "Attendance record not found" });

      return res.json(attendance);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
