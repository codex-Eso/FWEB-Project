import mongoose from "mongoose";

const AdminBookSchema = new mongoose.Schema({
    id: String,
    bookIds: [String]
})

export default mongoose.model("AdminBooks", AdminBookSchema, "adminBooks")