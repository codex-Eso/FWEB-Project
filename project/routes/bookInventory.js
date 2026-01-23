import express from "express";
import BookInventory from "../models/bookInventory.js";
import Users from "../models/users.js";
import LibraryBooks from '../models/libraryBooks.js';
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { studentId, viewStatus } = req.query;
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: "Bad user id detected!" })
        }
        let getBooks;
        if (viewStatus == "Viewed") {
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
        if (getBooks == null || !getBooks || getBooks.length == 0) {
            return res.status(404).json({ error: "Books not found!" })
        }
        return res.status(200).json(getBooks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to fetch user books!" })
    }
})

router.get('/:studentId', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.studentId)) {
        return res.status(400).json({ error: "Bad user id detected!" })
    }
    const user = await Users.findOne({ _id: req.params.studentId });
    if (user === null) {
        return res.status(404).json({ error: "User is not found!" })
    }
    try {
        const bookInventory = await BookInventory.find({ studentId: req.params.studentId });
        let bookPosition = [];
        bookInventory.map(b => bookPosition.push(b.position))
        return res.status(200).json(Math.max(...bookPosition));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to fetch user book position!" })
    }
})

router.get("/:studentId/:bookId", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.studentId)) {
        return res.status(400).json({ error: "Bad user id detected!" })
    }
    const user = await Users.findOne({ _id: req.params.studentId });
    if (user === null) {
        return res.status(404).json({ error: "User is not found!" })
    }
    const libraryBook = await LibraryBooks.findOne({ id: req.params.bookId })
    if (libraryBook === null || !libraryBook) {
        return res.status(404).json({ error: "Unknown book id detected!" })
    }
    try {
        const bookInventory = await BookInventory.findOne({ studentId: req.params.studentId, bookId: req.params.bookId });
        return res.status(200).json(bookInventory);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to fetch user books!" })
    }
})

router.delete("/:bookId", async (req, res) => {
    const libraryBook = await LibraryBooks.findOne({ id: req.params.bookId })
    if (libraryBook === null || !libraryBook) {
        return res.status(404).json({ error: "Unknown book id detected!" })
    }
    try {
        const bookInventory = await BookInventory.find({ bookId: req.params.bookId });
        await Promise.all(
            bookInventory.map(async (userBook) => {
                var update = { $inc: {} }
                if (userBook.status == "Borrowed") {
                    update.$inc.borrowed = -1;
                } else if (userBook.status == "Requested") {
                    update.$inc.requested = -1;
                }
                await Users.findOneAndUpdate(
                    { _id: userBook.studentId },
                    update
                )
            })
        )
        const bookDeletion = await BookInventory.deleteMany({ bookId: req.params.bookId });
        if (!bookDeletion || bookDeletion == null) {
            return res.status(404).json({ error: "Deletion failed!" })
        }
        return res.status(200).json({ message: "Deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to fetch user books!" })
    }
})

router.patch("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Unknown user book object id detected!" })
        }
        const updateInventory = req.body;
        if (!updateInventory || Object.keys(updateInventory).length === 0) {
            return res.status(400).json({ error: 'Cannot proceed! Empty data given!' })
        } else {
            const updatedInventory = await BookInventory.findOneAndUpdate(
                { _id: req.params.id },
                { $set: updateInventory }
            )
            if (!updatedInventory || updatedInventory === null) return res.status(404).json({ error: "User book cannot be found!" })
            return res.status(200).json({ message: "Updated" });
        }
    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") return res.status(400).json({ error: 'Cannot proceed! Attribute(s) undefined!' })
        return res.status(500).json({ error: "Server Error! Failed to update user book!" })
    }
})

router.post("/", async (req, res) => {
    try {
        const { studentId, bookId, status, dueDate, position } = req.body;
        if (!studentId || !bookId || !status || dueDate == null || !position) {
            return res.status(400).json({ error: 'Cannot proceed! Empty data given!' });
        } else {
            const newUserBook = new BookInventory({
                studentId,
                bookId,
                status,
                dueDate,
                position
            })
            await newUserBook.save();
            return res.status(201).json({ message: "Added" });
        }
    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") return res.status(400).json({ error: 'Cannot proceed! Attribute(s) undefined!' })
        return res.status(500).json({ error: "Server Error! Failed to add user book!" })
    }
})

export default router