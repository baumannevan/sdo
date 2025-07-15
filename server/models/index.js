import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";
import UserModel from "./user.model.js";
import EventModel from "./event.model.js"

// TODO: Figure out what this file is doing and if it is duplicated in app.js
// seeems need this file to exist but it is duplicated in app.js

const sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,
  {
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    pool: dbConfig.development.pool,
    port: dbConfig.development.port,
  }
);
 
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// sync the user model
db.User = UserModel(sequelize, Sequelize.DataTypes);
db.Event = EventModel(sequelize, Sequelize.DataTypes);

export default db;