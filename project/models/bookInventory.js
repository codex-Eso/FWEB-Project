import mongoose from "mongoose";

const bookInventorySchema = new mongoose.Schema({
    studentId: String,
    bookId: String,
    status: String,
    dueDate: String,
    position: Number
})

export default mongoose.model("BookInventory", bookInventorySchema, "bookInventory")