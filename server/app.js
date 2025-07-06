// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Main Express app setup
import express from "express";
import cors from "cors";
import dbConfig from "./config/db.config.js";
import Sequelize from "sequelize";
import UserModel from "./models/user.model.js";
import authRoutes from "./api/auth.routes.js";

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    port: dbConfig.PORT,
});

// Initialize models
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = UserModel(sequelize, Sequelize.DataTypes);

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync database
// This will drop and recreate tables to match the current Sequelize models
// WARNING: { force: true } will delete all data in the tables!
// This is just for the purposes of development, when database is no longer changing
// this is we removed and seeders / maybe migrations will be used.
db.sequelize.sync({ force: true }).then(() => {
    console.log("Synced db with force: true (tables dropped and recreated).");
});

// Register API routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
});

export default app;
