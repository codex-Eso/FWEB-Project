import express from "express";
import AdminBooks from "../models/adminBooks.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const adminBooks = await AdminBooks.find().sort({ updatedAt: -1 }).limit(3);
        return res.status(200).json(adminBooks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to fetch admin books!" });
    }
})

router.get("/:bookId", async (req, res) => {
    try {
        const { bookId } = req.params;
        const adminBook = await AdminBooks.findOne({ bookId: bookId });
        if (adminBook === null || !adminBook) return res.status(404).json({ error: "Admin book cannot be found!" });
        return res.status(200).json({ message: "Book Exists!" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to fetch admin book!" });
    }
})

router.patch("/:bookId", async (req, res) => {
    try {
        const { bookId } = req.params;
        const updateBookTime = await AdminBooks.findOneAndUpdate(
            { bookId: bookId },
            { $set: { updatedAt: new Date() } }
        )
        if (!updateBookTime || updateBookTime == null) return res.status(404).json({ error: "Book cannot be found!" })
        return res.status(200).json({ message: "Updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to update admin book!" });
    }
})

router.post("/", async (req, res) => {
    try {
        const { bookId } = req.body;
        if (!bookId) {
            return res.status(400).json({ error: 'Cannot proceed! Empty data given!' });
        }
        const adminbook = new AdminBooks({
            id: "AB1",
            bookId: bookId
        })
        await adminbook.save();
        return res.status(201).json({ message: "Added" });
    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") return res.status(400), json({ error: 'Cannot proceed! Attribute(s) undefined!' })
        return res.status(500).json({ error: "Server Error! Failed to add user notification!" })
    }
})

export default router