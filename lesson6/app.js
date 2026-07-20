import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import AuthRouter from './controllers/auth.js'
import ArticlesRouter from './controllers/articles.js'

await mongoose.connect('mongodb://127.0.0.1:27017/full-stack-W260126ER');
console.log('mongodb connection');

const app = express();

app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.use("/", AuthRouter);
app.use("/articles", ArticlesRouter);

app.get("/", (req, res) => {
    res.send({
        message: 'Hello world!',
    });
});

app.listen(3000, () => {
    console.log("listening on port 3000");
});
