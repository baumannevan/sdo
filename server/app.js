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

// Initialize Sequelize
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

// Sync database
db.sequelize.sync().then(() => {
    console.log("Synced db.");
});

// Register API routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
});

export default app;
