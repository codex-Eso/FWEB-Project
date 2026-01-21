import mongoose from "mongoose";

//this schema will not be edited cause we assume all the users are already added into the database once they have a student account
//which is why nvr put required

const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    username: String,
    password: String,
    borrowed: Number,
    requested: Number,
    nonFictionCount: Number,
    fictionCount: Number,
    closedStacks: Number,
    level6: Number,
    level7: Number,
    level8: Number
}, { strict: false })

export default mongoose.model("Users", userSchema, "users")