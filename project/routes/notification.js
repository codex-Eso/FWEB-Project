import express from "express";
import Notification from '../models/notification.js';
import Users from "../models/users.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/:studentId", async (req, res) => {
    const { studentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({ error: "Bad user id detected!" })
    }
    try {
        const user = await Users.findOne({ _id: studentId });
        if (user === null) {
            return res.status(404).json({ error: "User cannot be found!" })
        }
        const notification = await Notification.find({ studentId: studentId }).sort({ createdAt: 1 });
        return res.status(200).json(notification);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to fetch user notifications!" })
    }
})

router.post("/", async (req, res) => {
    try {
        const { studentId, message, bookId } = req.body;
        if (!studentId || !message || !bookId) {
            return res.status(400).json({ error: 'Cannot proceed! Empty data given!' });
        }
        const newNoti = new Notification({
            studentId,
            message,
            bookId
        })
        await newNoti.save();
        return res.status(201).json({ message: "Added" });
    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") return res.status(400).json({ error: 'Cannot proceed! Attribute(s) undefined!' })
        return res.status(500).json({ error: "Server Error! Failed to add user notification!" })
    }
})

export default router