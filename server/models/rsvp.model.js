export default (sequelize, DataTypes) => {
  const RSVP = sequelize.define("RSVP", {
    rsvpID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    response: {
      type: DataTypes.ENUM("Yes", "No", "Maybe"),
      allowNull: false,
    },
  });

  // Associations (defined outside model definition)
  RSVP.associate = (models) => {
    RSVP.belongsTo(models.Event, {
      foreignKey: {
        name: "event_id",
        allowNull: true,
      },
      onDelete: "SET NULL",
    });

    RSVP.belongsTo(models.User, {
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
      as: "User",
      onDelete: "CASCADE",
    });
  };

  return RSVP;
};
