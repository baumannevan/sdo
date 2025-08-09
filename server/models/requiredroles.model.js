// Sequelize model for RequiredRoles table
export default (sequelize, DataTypes) => {
  const RequiredRole = sequelize.define("RequiredRole", {
    requiredRolesId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("Officer", "Intermediate Member", "Associate Member"),
      allowNull: true,
    },
  });

RequiredRole.associate = (models) => {
  RequiredRole.belongsTo(models.Event, {
    foreignKey: {
      name: "eventId",
      allowNull: false,
    },
    as: "event",
    onDelete: "CASCADE",
  });
};


  return RequiredRole;
};
