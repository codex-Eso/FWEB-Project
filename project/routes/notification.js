import express from "express";
import Notification from '../models/notification.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const notification = await Notification.find();
        return res.status(200).json(notification);
    } catch (error) {
        console.error(error);
    }
})

router.post("/", async (req, res) => {
    try {
        const { studentId, message, messageTime, bookId } = req.body;
        if (!studentId || !message || !messageTime || !bookId) {
            throw new Error('Cannot proceed! Empty data given!');
        } else {
            const newNoti = new Notification({
                studentId,
                message,
                messageTime,
                bookId
            })
            await newNoti.save();
            return res.status(200).json({ message: "Added" });
        }
    } catch (error) {
        console.error(error);
    }
})

export default router