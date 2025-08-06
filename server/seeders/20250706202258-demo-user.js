import bcrypt from 'bcryptjs';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('Users', [{
    firstName: 'test',
    lastName: 'user',
    email: 'test@example.com',
    role: "Officer",
    password: await bcrypt.hash('password', 10),
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Users', { email: 'test@example.com' }, {});
}
