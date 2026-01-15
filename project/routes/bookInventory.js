import express from "express";
import BookInventory from "../models/bookInventory.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const bookInventory = await BookInventory.find();
        return res.status(200).json(bookInventory);
    } catch (error) {
        console.error(error);
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const updateInventory = req.body;
        if (!updateInventory) {
            throw new Error('Cannot proceed! Empty data given!')
        } else {
            await BookInventory.findOneAndUpdate(
                { id: req.params.id },
                { $set: updateInventory }
            )
            return res.status(200).json({ message: "Updated" });
        }
    } catch (error) {
        console.error(error);
    }
})

export default router