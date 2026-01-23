import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        required: true
    },
    identifier: {
        type: Number,
        required: true
    },
    copies: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    bookImage: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    imgLocation: {
        type: String,
    },
    level: {
        type: Number,
        required: true,
        enum: [0, 6, 7, 8]
    },
    fiction: {
        type: Boolean,
        required: true
    }
})

export default mongoose.model("LibraryBooks", librarySchema, "libraryBooks")