import express from "express";
import LibraryData from '../models/libraryData.js'

const router = express.Router();

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

router.post("/", async (req, res) => {
    try {
        const { id, location, availability, identifier, copies, title, author, bookImage, publisher, imgLocation, level } = req.body;
        if (!title.trim() || !author.trim() || !publisher.trim() || !location.trim() || !bookImage || !identifier || copies === "" || availability === "" || level === "") {
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
                bookImage,
                publisher,
                imgLocation,
                level
            })
            await newLibraryBook.save();
            return res.status(200).json({ message: "Added" });
        }
    } catch (error) {
        console.error(error);
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const updatedBook = req.body;
        if (!updatedBook) {
            throw new Error('Cannot proceed! There are empty input values!')
        } else {
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