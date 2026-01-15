import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: String,
    location: String,
    availability: Boolean,
    identifier: Number,
    copies: Number,
    title: String,
    author: String,
    bookImage: String,
    publisher: String,
    imgLocation: String,
    level: Number
})

export default mongoose.model("LibraryData", userSchema, "libraryData")