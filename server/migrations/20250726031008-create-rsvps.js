export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable("RSVPs", {
    rsvpID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Events",
        key: "id", // assumes Events.id (not event_id)
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    memberID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // assumes Members are stored in Users table
        key: "id",      // or "memberID" if you have a separate Members table
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    response: {
      type: DataTypes.ENUM("Yes", "No", "Maybe"),
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
  await queryInterface.dropTable("RSVPs");
}
