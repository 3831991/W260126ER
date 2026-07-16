import mongoose from "mongoose";
import { Router } from 'express';

const schema = new mongoose.Schema({
    addedTime: { type: Date, default: Date.now },
    publishDate: Date,
    headline: String,
    description: String,
    content: String,
    imgUrl: String,
});

const Article = mongoose.model("articles", schema);

const router = Router();

router.get("/", async (req, res) => {
    const data = await Article.find();
    res.send(data);
});

router.post("/", async (req, res) => {
    const { publishDate, headline, description, content, imgUrl } = req.body;

    const obj = new Article({
        publishDate,
        headline,
        description,
        content,
        imgUrl,
    });

    const article = await obj.save();

    res.send(article);
});

export default router;