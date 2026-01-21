import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
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
    level: Number,
    fiction: Boolean
})

export default mongoose.model("LibraryBooks", librarySchema, "libraryBooks")