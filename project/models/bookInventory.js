import mongoose from "mongoose";

const bookInventorySchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    bookId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Viewed', 'Collecting', 'Cancelled', 'Borrowed', 'Requested', 'Overdue', 'Returned']
    },
    dueDate: String,
    position: {
        type: Number,
        required: true
    }
})

export default mongoose.model("BookInventory", bookInventorySchema, "bookInventory")