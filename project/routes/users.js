import express from "express";
import Users from "../models/users.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await Users.find();
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to fetch users!" });
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Bad user id detected!" })
    }
    try {
        const user = await Users.findOne({ _id: id });
        if (user === null) {
            return res.status(404).json({ error: "User is not found!" })
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to fetch users!" })
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Bad user id detected!" })
        }
        const userUpdate = req.body;
        if (!userUpdate || Object.keys(userUpdate).length === 0) {
            return res.status(400).json({ error: 'Cannot proceed! Empty data given!' })
        }
        const updatedUser = await Users.findByIdAndUpdate(
            req.params.id,
            { $set: userUpdate }
        )
        if (!updatedUser || updatedUser === null) return res.status(404).json({ error: "User is not found!" })
        return res.status(200).json({ message: "Updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error! Failed to update users!" })
    }
})

export default router