import express from "express";
import multer from "multer";
import { storage } from "../cloudinary.js";
import LibraryBooks from '../models/libraryBooks.js'
import AdminBooks from "../models/adminBooks.js";
import mongoose from "mongoose";

const router = express.Router();
const upload = multer({ storage });

router.get("/", async (req, res) => {
    try {
        const { isbn } = req.query;
        let library;
        if (isbn !== undefined) {
            library = await LibraryBooks.findOne({ identifier: isbn });
            if (library == null || !library) {
                return res.status(404).json({ error: "Book not found!" })
            }
        } else {
            library = await LibraryBooks.find();
        }
        return res.status(200).json(library);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to fetch book(s)!" })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const library = await LibraryBooks.findOne({ id: req.params.id });
        if (library == null || !library) {
            return res.status(404).json({ error: "Book cannot be found!" })
        }
        return res.status(200).json(library);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to fetch book!" })
    }
})

router.post("/", upload.fields([
    { name: "bookImage", maxCount: 1 },
    { name: "imgLocation", maxCount: 1 }
]), async (req, res) => {
    try {
        const { id, location, availability, identifier, copies, title, author, publisher, level, fiction } = req.body;
        const bookImageUrl = req.files.bookImage?.[0].path;
        const imgLocationUrl = req.files.imgLocation?.[0].path;
        if (!title.trim() || !author.trim() || !publisher.trim() || !location.trim() || !bookImageUrl || !identifier || copies === "" || availability === "" || level === "" || fiction === "") {
            return res.status(400).json({ error: 'Cannot proceed! Empty data given!' });
        } else {
            const newLibraryBook = new LibraryBooks({
                id,
                location,
                availability,
                identifier,
                copies,
                title,
                author,
                bookImage: bookImageUrl,
                publisher,
                imgLocation: imgLocationUrl,
                level,
                fiction
            })
            await newLibraryBook.save();
            return res.status(201).json({ message: "Added" });
        }
    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") return res.status(400).json({ error: 'Cannot proceed! Attribute(s) undefined!' })
        return res.status(500).json({ error: "Server Error! Failed to add book!" })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Unknown book object id detected!" })
    }
    try {
        const library = await LibraryBooks.findOne({ _id: id });
        if (library == null || !library) {
            return res.status(404).json({ error: "Book cannot be found!" })
        }
        await LibraryBooks.findOneAndDelete({ _id: id });
        const book = await AdminBooks.findOneAndDelete({ bookId: library.id });
        return res.status(200).json({ message: "Deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to delete book!" })
    }
})

router.patch("/:id", upload.fields([
    { name: "bookImage", maxCount: 1 },
    { name: "imgLocation", maxCount: 1 }
]), async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Unknown book object id detected!" })
    }
    try {
        const updatedBook = { ...req.body };
        if (!updatedBook || Object.keys(updatedBook).length === 0) {
            return res.status(400).json({ error: 'Cannot proceed! Empty data given!' })
        } else {
            if (req.files.bookImage) {
                updatedBook.bookImage = req.files.bookImage[0].path;
            }
            if (req.files.imgLocation) {
                updatedBook.imgLocation = req.files.imgLocation[0].path;
            }
            const getUpdateBook = await LibraryBooks.findOneAndUpdate(
                { _id: req.params.id },
                { $set: updatedBook }
            )
            if (!getUpdateBook || getUpdateBook === null) return res.status(404).json({ error: "Book cannot be found!" })
            return res.status(200).json({ message: "Updated" });
        }
    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") return res.status(400).json({ error: 'Cannot proceed! Attribute(s) undefined!' })
        return res.status(500).json({ error: "Server Error! Failed to update book!" })
    }
})

export default router