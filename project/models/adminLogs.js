import mongoose from "mongoose";

const notiSchema = new mongoose.Schema({
    auditTime: {
        type: String,
        required: true
    },
    bookISBN: {
        type: Number,
        required: true
    },
    bookName: {
        type: String,
        required: true
    },
    actionName: {
        type: String,
        required: true,
        enum: ["add", "accepted", "cancelled", "requested", "delete", "edit", "overdue", "returned"]
    },
    readLog: {
        type: Boolean,
        required: true
    }
}, { strict: false })

export default mongoose.model("AdminLogs", notiSchema, "adminLogs")