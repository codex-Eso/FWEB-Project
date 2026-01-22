import mongoose from "mongoose";

const AdminBookSchema = new mongoose.Schema({
    id: {
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

export default mongoose.model("AdminBooks", AdminBookSchema, "adminBooks")