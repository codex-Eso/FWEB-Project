import express from "express";
import AdminLogs from "../models/adminLogs.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const adminLogs = await AdminLogs.find();
        return res.status(200).json(adminLogs);
    } catch (error) {
        console.error(error);
    }
})

router.post("/", async (req, res) => {
    try {
        const adminlog = new AdminLogs({
            ...req.body
        })
        await adminlog.save();
        return res.status(200).json({ message: "Added" });
    } catch (error) {
        console.error(error);
    }
})

router.delete("/:id", async (req, res) => {
    try {
        await AdminLogs.findOneAndDelete(req.params.id)
        return res.status(200).json({ message: "Deleted" });
    } catch (error) {
        console.error(error);
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const logUpdate = req.body;
        if (!logUpdate) {
            throw new Error('Cannot proceed! Empty data given!')
        } else {
            await AdminLogs.findByIdAndUpdate(
                req.params.id,
                { $set: logUpdate }
            )
            return res.status(200).json({ message: "Updated" });
        }
    } catch (error) {
        console.error(error);
    }
})

export default router