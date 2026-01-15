import mongoose from "mongoose";

const notiSchema = new mongoose.Schema({
    studentId: String,
    message: String,
    messageTime: String,
    bookId: String
})

export default mongoose.model("Notification", notiSchema, "notification")