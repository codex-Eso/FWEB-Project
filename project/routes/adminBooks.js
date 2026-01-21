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

router.post("/", async (req, res) => {
    try {
        const { adminBookId } = req.body;
        const adminbook = new AdminBooks({
            id: "AB1",
            adminBookId
        })
        await adminbook.save();
        return res.status(200).json({ message: "Added" });
    } catch (error) {
        console.error(error);
    }
})

export default router