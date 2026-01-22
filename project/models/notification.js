import mongoose from "mongoose";

const notiSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    bookId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model("Notification", notiSchema, "notification")