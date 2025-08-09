import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    // 1) Create test user
    const passwordHash = await bcrypt.hash("password", 10);
    const testEmail = "test@example.com";

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "test",
          lastName: "user",
          email: testEmail,
          role: "Officer",
          password: passwordHash,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { transaction }
    );

    // Get the newly created user's id
    const [userRows] = await queryInterface.sequelize.query(
      "SELECT id FROM `Users` WHERE email = ? LIMIT 1;",
      {
        replacements: [testEmail],
        type: Sequelize.QueryTypes.SELECT,
        transaction,
      }
    );
    // Note: depending on the version, query(...) with QueryTypes.SELECT may return an array of rows directly.
    // If the above returns an object rather than [rows], handle both cases:
    let userId;
    if (userRows && userRows.id !== undefined) {
      userId = userRows.id;
    } else {
      // fallback if query returned array
      const rows = await queryInterface.sequelize.query(
        "SELECT id FROM `Users` WHERE email = ? LIMIT 1;",
        { replacements: [testEmail], type: Sequelize.QueryTypes.SELECT, transaction }
      );
      userId = rows[0].id;
    }

    // 2) Insert events (no duplicate ids assumed on a clean DB)
    const eventsToInsert = [
      {
        name: "Annual General Meeting",
        date: "2025-09-15",
        location: "Main Hall",
        description: "The yearly gathering of all members to discuss club affairs.",
        rsvp_required: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Monthly Social",
        date: "2025-09-30",
        location: "Community Center",
        description: "Casual get-together with snacks and games.",
        rsvp_required: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Leadership Training",
        date: "2025-10-05",
        location: "Conference Room 2",
        description: "Training session for Officers and Intermediate Members.",
        rsvp_required: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Events", eventsToInsert, { transaction });

    // Fetch event ids we just inserted (map by name -> id)
    const insertedEvents = await queryInterface.sequelize.query(
      "SELECT id, name FROM `Events` WHERE name IN (:names);",
      {
        replacements: { names: eventsToInsert.map((e) => e.name) },
        type: Sequelize.QueryTypes.SELECT,
        transaction,
      }
    );

    const eventNameToId = {};
    insertedEvents.forEach((r) => {
      eventNameToId[r.name] = r.id;
    });

    // 3) Insert required roles for events (use event ids looked up)
    const requiredRoleRecords = [
      { eventName: "Annual General Meeting", role: "Officer" },
      { eventName: "Annual General Meeting", role: "Associate Member" },

      { eventName: "Leadership Training", role: "Officer" },
      { eventName: "Leadership Training", role: "Intermediate Member" },
    ].map((rr) => ({
      eventId: eventNameToId[rr.eventName],
      role: rr.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("RequiredRoles", requiredRoleRecords, { transaction });

    // 4) Create AttendanceSheets for the test user for events that require "Officer"
    // Find which eventIds require Officer (we can filter the requiredRoleRecords)
    const officerEventIds = requiredRoleRecords
      .filter((r) => r.role === "Officer")
      .map((r) => r.eventId)
      .filter(Boolean);

    if (officerEventIds.length > 0) {
      const attendanceRecords = officerEventIds.map((eventId) => ({
        eventId,
        userId,
        attended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert("AttendanceSheets", attendanceRecords, { transaction });
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    console.error("Seeding failed:", err);
    throw err;
  }
}

export async function down(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    const eventNames = [
      "Annual General Meeting",
      "Monthly Social",
      "Leadership Training",
    ];

    // delete attendance for events with those names
    await queryInterface.sequelize.query(
      `DELETE a FROM AttendanceSheets a
       JOIN Events e ON a.eventId = e.id
       WHERE e.name IN (:names);`,
      {
        replacements: { names: eventNames },
        type: Sequelize.QueryTypes.RAW,
        transaction,
      }
    );

    // delete required roles for those events
    await queryInterface.sequelize.query(
      `DELETE rr FROM RequiredRoles rr
       JOIN Events e ON rr.eventId = e.id
       WHERE e.name IN (:names);`,
      { replacements: { names: eventNames }, type: Sequelize.QueryTypes.RAW, transaction }
    );

    // delete events
    await queryInterface.bulkDelete("Events", { name: eventNames }, { transaction });

    // delete user by email
    await queryInterface.bulkDelete("Users", { email: "test@example.com" }, { transaction });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    console.error("Undo seeder failed:", err);
    throw err;
  }
}
