import mongoose from "mongoose";
import { Router } from 'express';

const schema = new mongoose.Schema({
    addedTime: Date,
    publishDate: Date,
    headline: String,
    description: String,
    content: String,
    imgUrl: String,
});

const Article = mongoose.model("articles", schema);

export const router = Router();
