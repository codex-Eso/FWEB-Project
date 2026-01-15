import mongoose from "mongoose";

const notiSchema = new mongoose.Schema({
    auditTime: String,
    bookISBN: Number,
    bookName: String,
    actionName: String,
    readLog: Boolean
}, { strict: false })

export default mongoose.model("AdminLogs", notiSchema, "adminLogs")