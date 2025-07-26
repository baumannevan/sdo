export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable("RequiredRoles", {
    requiredRolesId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Events",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    role: {
      type: DataTypes.ENUM("AM", "IM", "Officer"),
      allowNull: true,
    },
    requiresRsvp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("RequiredRoles");
}
