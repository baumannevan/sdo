// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Main Express app setup
import express from "express";
import cors from "cors";
import dbConfig from "./config/db.config.js";
import Sequelize from "sequelize";
import UserModel from "./models/user.model.js";
import EventModel from "./models/event.model.js";
import RSVPModel from "./models/rsvp.model.js";
import REQUIRED_ROLEModel from "./models/requiredroles.model.js";
import ATTENDANCEModel from "./models/attendancesheet.model.js";
import authRoutes from "./api/auth.routes.js";
import eventRoutes from "./api/events.routes.js";
import userRoutes from "./api/users.routes.js";
import rsvpRoutes from "./api/rsvp.routes.js";




// Use environment variable to select config
const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

const { database, username, password, ...sequelizeOptions } = config;
const sequelize = new Sequelize(database, username, password, sequelizeOptions);

console.log(`Using database: ${config.database} (env: ${env})`);

// Initialize models
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = UserModel(sequelize, Sequelize.DataTypes);
db.RSVP = RSVPModel(sequelize, Sequelize.DataTypes);
db.ATTENDANCE = ATTENDANCEModel(sequelize, Sequelize.DataTypes);
db.RequiredRole = REQUIRED_ROLEModel(sequelize, Sequelize.DataTypes);
db.Event = EventModel(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
})



const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/events", rsvpRoutes);
app.use("/api/users", userRoutes);




// Test route
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
});

export default app;
