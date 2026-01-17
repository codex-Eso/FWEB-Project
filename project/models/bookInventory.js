import mongoose from "mongoose";

const bookInventorySchema = new mongoose.Schema({
    id: String,
    studentId: String,
    booksIds: [String],
    status: [String],
    dueDate: [String],
    borrowed: Number,
    requested: Number,
    fictionCount: Object
})

export default mongoose.model("BookInventory", bookInventorySchema, "bookInventory")