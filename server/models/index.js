import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";
import UserModel from "./user.model.js";
import EventModel from "./event.model.js";
import RSVPModel from "./rsvp.model.js";
import REQUIRED_ROLEModel from "./requiredroles.model.js";
import ATTENDANCEModel from "./attendancesheet.model.js";


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
db.RSVP = RSVPModel(sequelize, Sequelize.DataTypes);
db.ATTENDANCE = ATTENDANCEModel(sequelize, Sequelize.DataTypes);
db.RequiredRole = REQUIRED_ROLEModel(sequelize, Sequelize.DataTypes);

// Set up associations
if (db.User.associate) db.User.associate(db);
if (db.Event.associate) db.Event.associate(db);
if (db.RSVP.associate) db.RSVP.associate(db);
if (db.ATTENDANCE && db.ATTENDANCE.associate) db.ATTENDANCE.associate(db);
if (db.RequiredRole && db.RequiredRole.associate) db.RequiredRole.associate(db);


export default db;