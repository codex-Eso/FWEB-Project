import mongoose from "mongoose";

const AdminBookSchema = new mongoose.Schema({
    id: String,
    bookId: String
})

export default mongoose.model("AdminBooks", AdminBookSchema, "adminBooks")