import express from "express";
import cors from "cors";
import users from "./routes/users.js";
import libraryData from "./routes/libraryData.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import adminBooks from "./routes/adminBooks.js";
import bookInventory from "./routes/bookInventory.js";
import notification from './routes/notification.js';
dotenv.config();
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
mongoose.connection.once("open", () => {
    console.log("Connected to DB:", mongoose.connection.name);
});
const app = express();
// Enables CORS so your front-end can access your backend API without browser blocking it.
app.use(cors());
// Allows Express to parse JSON data from incoming requests
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use('/notification', notification)
app.use('/bookInventory', bookInventory)
app.use('/adminBooks', adminBooks)
app.use('/libraryData', libraryData);
app.use("/users", users);
app.get("/", async (req, res) => {
    res.send("<h1>Welcome to my API! The server is running successfully.</h1>");
});
// Set port
const PORT = process.env.PORT || 5050;
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});