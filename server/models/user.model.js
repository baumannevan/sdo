// Sequelize User model example
import { ENUM } from "sequelize";
import dbConfig from "../config/db.config.js";

export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
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
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["Officer", "Intermediate Member", "Associate Member"], // change to initiate member
      allowNull: false,
      defaultValue: "Associate Member", // TODO: ensure that the lowest is actually AM
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dues: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });


  User.associate = (models) => {
    User.hasMany(models.AttendanceSheet, {
      foreignKey: "userId",
      as: "AttendanceSheets",
    });
  };

  return User;
};
