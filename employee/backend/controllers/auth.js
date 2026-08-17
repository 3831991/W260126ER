import { model, Schema } from "mongoose";
import { Router } from 'express';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config.js";
import guard from '../services/guard.js';

const schema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    password: String,
});

const User = model("users", schema);

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const userFind = await User.findOne({ email });

    if (!userFind) {
        return res.status(403).send({ message: "email or password incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, userFind.password);

    if (!passwordMatch) {
        return res.status(403).send({ message: "email or password incorrect" });
    }

    const obj = {
        userId: userFind._id,
        fullName: `${userFind.firstName} ${userFind.lastName}`,
    };

    const token = jwt.sign(obj, JWT_SECRET, { expiresIn: '20m' });

    res.send(token);
});

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

router.get("/renew-token", guard, async (req, res) => {
    const data = jwt.decode(req.headers.authorization);

    const obj = {
        userId: data.userId,
        fullName: data.fullName,
    }

    const token = jwt.sign(obj, JWT_SECRET, { expiresIn: '20m' });

    res.send(token); 
});

export default router;