// Sequelize model for AttendanceSheets table
export default (sequelize, DataTypes) => {
  const AttendanceSheet = sequelize.define(
    "AttendanceSheet",
    {
      attendanceId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      attended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      tableName: "AttendanceSheets",
      timestamps: true,
    }
  );

  AttendanceSheet.associate = (models) => {
    AttendanceSheet.belongsTo(models.Event, {
      foreignKey: {
        name: "eventId",
        allowNull: true,
      },
      as: "Event",
      onDelete: "SET NULL",
    });

    AttendanceSheet.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      as: "User",
      onDelete: "CASCADE",
    });
  };

  return AttendanceSheet;
};
