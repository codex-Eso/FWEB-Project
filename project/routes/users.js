import express from "express";
import Users from "../models/users.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await Users.find();
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const user = await Users.findOne({ id: req.params.id });
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
})

export default router