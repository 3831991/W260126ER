import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Router } from 'express';

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

});

export default router;