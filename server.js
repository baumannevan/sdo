import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
 
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
 
// Test route
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
});
 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});