// Sequelize model for AttendanceSheets table
export default (sequelize, DataTypes) => {
  const AttendanceSheet = sequelize.define("AttendanceSheet", {
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
      allowNull: false,
    },
  });
  return AttendanceSheet;
};
