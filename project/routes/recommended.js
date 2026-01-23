import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import LibraryBooks from "../models/libraryBooks.js";
import Users from "../models/users.js";
import mongoose from "mongoose";
dotenv.config();
const router = express.Router();
//use ai to recommend 3 books that are under the user preference of fiction/non-fiction (all the books must be available)
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Bad user id detected!" })
    }
    const user = await Users.findOne({ _id: userId });
    if (user === null) {
        return res.status(404).json({ error: "User is not found!" })
    }
    try {
        let books;
        let prompt;
        if (user.fictionCount !== 0 || user.nonFictionCount !== 0) {
            const fictionPref =
                (user.fictionCount >= user.nonFictionCount) ? true : false;
            books = await LibraryBooks.find({
                availability: true,
                fiction: fictionPref,
            });
            const bookList = books
                .map((book) => {
                    return `Title: ${book.title}\nBook Id: ${book.id}\n`;
                })
                .join("\n");
            prompt = `
A student prefers ${fictionPref ? "Fiction" : "Non-Fiction"} books.
Based on this, recommend 3 books from the list below that best match their preferences.
Provide the entire object of the books.

Available books:
${bookList}
`;
        } else {
            books = await LibraryBooks.find({ availability: true });
            const bookList = books
                .map((book) => {
                    return `Title: ${book.title}\nBook Id: ${book.id}\n`;
                })
                .join("\n");
            prompt = `
A new student has joined the library and has not viewed any books yet.
From the list below, recommend 3 books that offer a diverse and engaging introduction to the library's collection.
Provide the entire object of the books.

Available books:
${bookList}
`;
        }
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are a helpful book recommendation engine." },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 800,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Groq error:", data);
            return res.status(500).json({ message: "Groq error: " + JSON.stringify(data) });
        }
        const aiResponse = data.choices?.[0]?.message?.content?.trim() || "No response from model.";
        let bookTitles = await LibraryBooks.find();
        bookTitles = bookTitles.filter(b => aiResponse.includes(b.title)).slice(0, 3);
        return res.json({ recommendations: aiResponse, titles: bookTitles });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error! Failed to fetch recommendations!" });
    }
});
export default router;