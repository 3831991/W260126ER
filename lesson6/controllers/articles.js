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

router.put("/:id", async (req, res) => {
    const { publishDate, headline, description, content, imgUrl } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
        return res.status(400).send({ message: "Article not found" });
    }

    article.publishDate = publishDate;
    article.headline    = headline;
    article.description = description;
    article.content     = content;
    article.imgUrl      = imgUrl;

    await article.save();
    res.end();
});

router.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.end();
});

export default router;