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
import authRoutes from "./api/auth.routes.js";
import eventRoutes from "./api/events.routes.js";


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
db.Event = EventModel(sequelize, Sequelize.DataTypes);


const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);


// Test route
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
});

export default app;
