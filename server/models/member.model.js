// Sequelize model for Members table
export default (sequelize, DataTypes) => {
  const Member = sequelize.define("Member", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("Officer", "Intermediate Member", "Associate Member"),
      allowNull: false,
      defaultValue: "Associate Member",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Member;
};
