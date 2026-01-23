import express from "express";
import AdminLogs from "../models/adminLogs.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { bookISBN, action, userId } = req.query
        let adminLogs;
        if (bookISBN !== undefined || action !== undefined || userId !== undefined) {
            adminLogs = await AdminLogs.findOne({ bookISBN: bookISBN, actionName: action, userId: userId });
            if (adminLogs == null || !adminLogs) {
                return res.status(404).json({ error: "Admin log not found!" })
            }
        } else {
            adminLogs = await AdminLogs.find();
        }
        return res.status(200).json(adminLogs);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to fetch admin logs!" });
    }
})

router.post("/", async (req, res) => {
    const { auditTime, bookISBN, bookName, actionName, readLog } = req.body
    if (!auditTime || !bookISBN || !bookName || !actionName || readLog == null) {
        return res.status(400).json({ error: 'Cannot proceed! Empty data given!' });
    }
    try {
        const adminlog = new AdminLogs({
            ...req.body
        })
        await adminlog.save();
        return res.status(200).json({ message: "Added" });
    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") return res.status(400).json({ error: 'Cannot proceed! Attribute(s) undefined!' })
        return res.status(500).json({ error: "Server Error! Failed to add admin log!" })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Unknown admin log id detected!" })
    }
    try {
        const adminLogs = await AdminLogs.findOne({ _id: id });
        if (adminLogs == null || !adminLogs) return res.status(404).json({ error: "Admin log cannot be found!" })
        await AdminLogs.findOneAndDelete({ _id: id })
        return res.status(200).json({ message: "Deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to delete admin log!" })
    }
})

router.patch("/:id", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Unknown admin log id detected!" })
    }
    const adminLogs = await AdminLogs.findOne({ _id: req.params.id });
    if (adminLogs == null || !adminLogs) return res.status(404).json({ error: "Admin log cannot be found!" })
    try {
        const logUpdate = req.body;
        if (!logUpdate || Object.keys(logUpdate).length === 0) {
            return res.status(400).json({ error: 'Cannot proceed! Empty data given!' })
        } else {
            const getLogUpdate = await AdminLogs.findByIdAndUpdate(
                req.params.id,
                { $set: logUpdate }
            )
            if (!getLogUpdate || getLogUpdate === null) return res.status(404).json({ error: "Admin log cannot be found!" })
            return res.status(200).json({ message: "Updated" });
        }
    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") return res.status(400).json({ error: 'Cannot proceed! Attribute(s) undefined!' })
        return res.status(500).json({ error: "Server Error! Failed to update admin log!" })
    }
})

export default router