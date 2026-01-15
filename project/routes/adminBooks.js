import express from "express";
import AdminBooks from "../models/adminBooks.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const adminBooks = await AdminBooks.find();
        return res.status(200).json(adminBooks);
    } catch (error) {
        console.error(error);
    }
})

router.patch("/", async (req, res) => {
    try {
        const newAdminBooks = req.body;
        if (!newAdminBooks) {
            throw new Error('Cannot proceed! Empty data given!')
        } else {
            await AdminBooks.findOneAndUpdate(
                { id: "AB1" },
                { $set: newAdminBooks }
            )
            return res.status(200).json({ message: "Updated" });
        }
    } catch (error) {
        console.error(error);
    }
})

export default router