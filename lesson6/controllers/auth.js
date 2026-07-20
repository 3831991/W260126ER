import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { JWT_SECRET } from "../config.js";

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
});

const User = mongoose.model("users", schema);

const router = Router();

router.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const userFind = await User.findOne({ email });

    if (userFind) {
        return res.status(400).send({ message: 'User already exists' });
    }

    const user = new User({
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, 10),
    });

    const newUser = await user.save();
    
    res.send(newUser);
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const userFind = await User.findOne({ email });

    if (!userFind) {
        return res.status(401).send({ message: "email or password incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, userFind.password);

    if (!passwordMatch) {
        return res.status(401).send({ message: "email or password incorrect" });
    }

    const obj = {
        userId: userFind._id,
        fullName: `${userFind.firstName} ${userFind.lastName}`,
    }

    const token = jwt.sign(obj, JWT_SECRET, { expiresIn: '15m' });

    res.send(token);
});

export default router;