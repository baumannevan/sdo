'use strict';

/** @type {import('sequelize-cli').Migration} */

  export async function up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Events", [{
      name: "event",
      date: "2025-07-31",
      location: "Vally Library",
      description: "a test event populated by a seeder file",
      rsvp_required: false,
    }], {});
  }

export async function down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Events', {}, {});

}
