import express from "express";
import multer from "multer";
import { storage } from "../cloudinary.js";
import LibraryData from '../models/libraryData.js'

const router = express.Router();
const upload = multer({ storage });

router.get("/", async (req, res) => {
    try {
        const library = await LibraryData.find();
        return res.status(200).json(library);
    } catch (error) {
        console.error(error);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const library = await LibraryData.findOne({ id: req.params.id });
        return res.status(200).json(library);
    } catch (error) {
        console.error(error);
    }
})

router.delete("/:id", async (req, res) => {
    try {
        await LibraryData.findOneAndDelete({ id: req.params.id });
        return res.status(200).json({ message: "Deleted" });
    } catch (error) {
        console.error(error);
    }
})

router.post("/", upload.fields([
    { name: "bookImage", maxCount: 1 },
    { name: "imgLocation", maxCount: 1 }
]), async (req, res) => {
    try {
        const { id, location, availability, identifier, copies, title, author, publisher, level } = req.body;
        const bookImageUrl = req.files.bookImage?.[0].path;
        const imgLocationUrl = req.files.imgLocation?.[0].path;
        if (!title.trim() || !author.trim() || !publisher.trim() || !location.trim() || !bookImageUrl || !identifier || copies === "" || availability === "" || level === "") {
            throw new Error('Cannot proceed! There are empty input values!');
        } else {
            const newLibraryBook = new LibraryData({
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
                level
            })
            await newLibraryBook.save();
            return res.status(200).json({ message: "Added" });
        }
    } catch (error) {
        console.error(error);
    }
})

router.patch("/:id", upload.fields([
    { name: "bookImage", maxCount: 1 },
    { name: "imgLocation", maxCount: 1 }
]), async (req, res) => {
    try {
        const updatedBook = { ...req.body };
        if (!updatedBook) {
            throw new Error('Cannot proceed! There are empty input values!')
        } else {
            if (req.files.bookImage) {
                updatedBook.bookImage = req.files.bookImage[0].path;
            }
            if (req.files.imgLocation) {
                updatedBook.imgLocation = req.files.imgLocation[0].path;
            }
            await LibraryData.findOneAndUpdate(
                { id: req.params.id },
                { $set: updatedBook }
            )
            return res.status(200).json({ message: "Updated" });
        }
    } catch (error) {
        console.error(error);
    }
})

export default router