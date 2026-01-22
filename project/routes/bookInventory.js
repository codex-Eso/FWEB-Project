import express from "express";
import BookInventory from "../models/bookInventory.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { studentId, viewStatus } = req.query;
        let getBooks;
        if (viewStatus != undefined) {
            getBooks = await BookInventory.aggregate([
                { $match: { studentId: studentId } },
                { $sort: { position: -1 } },
                { $limit: 3 }
            ]);
        } else {
            getBooks = await BookInventory.aggregate([
                { $match: { studentId: studentId } },
                { $sort: { position: -1 } }
            ]);
        }
        return res.status(200).json(getBooks);
    } catch (error) {
        console.error(error);
    }
})

router.get('/:studentId', async (req, res) => {
    try {
        const bookInventory = await BookInventory.find({ studentId: req.params.studentId });
        let bookPosition = [];
        bookInventory.map(b => bookPosition.push(b.position))
        return res.status(200).json(Math.max(...bookPosition));
    } catch (error) {
        console.error(error);
    }
})

router.get("/:studentId/:bookId", async (req, res) => {
    try {
        const bookInventory = await BookInventory.findOne({ studentId: req.params.studentId, bookId: req.params.bookId });
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
                { _id: req.params.id },
                { $set: updateInventory }
            )
            return res.status(200).json({ message: "Updated" });
        }
    } catch (error) {
        console.error(error);
    }
})

router.post("/", async (req, res) => {
    try {
        const bookInventory = await BookInventory.findOne({ studentId: req.body.studentId, bookId: req.body.bookId });
        if (bookInventory === null) {
            const { studentId, bookId, status, dueDate, position } = req.body;
            if (studentId === null || bookId === null || status === null || dueDate === null || position === null) {
                throw new Error('Cannot proceed! There are empty input values!');
            } else {
                const newUserBook = new BookInventory({
                    studentId,
                    bookId,
                    status,
                    dueDate,
                    position
                })
                await newUserBook.save();
                return res.status(200).json({ message: "Added" });
            }
        } else {
            return res.json(null);
        }
    } catch (error) {
        console.error(error);
    }
})

export default router