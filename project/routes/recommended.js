//ask Colin if the simple AI recommendation ok or not (hopefully bruhh)
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import LibraryData from "../models/libraryData.js";
import BookInventory from "../models/bookInventory.js";
dotenv.config();
const router = express.Router();
//use ai to recommend 3 books that are under the user preference of fiction/non-fiction (all the books must be available)
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const userData = await BookInventory.findOne({ studentId: userId });
        const fictionPref =
            (userData?.fictionCount?.fiction >= userData?.fictionCount?.nonFiction) ? true : false;
        let books;
        let prompt;
        if (userData.booksIds.length !== 0) {
            books = await LibraryData.find({
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
            books = await LibraryData.find({ availability: true });
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
        let bookTitles = await LibraryData.find();
        bookTitles = bookTitles.filter(b => aiResponse.includes(b.title));
        return res.json({ recommendations: aiResponse, titles: bookTitles });
    } catch (err) {
        console.error(err);
    }
});
export default router;