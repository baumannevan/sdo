import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";
import UserModel from "./user.model.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    port: dbConfig.PORT,
});
 
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// sync the user model
db.User = UserModel(sequelize, Sequelize.DataTypes);

export default db;