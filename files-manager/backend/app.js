import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import FilesRouter from './controllers/files.js';

await mongoose.connect('mongodb://127.0.0.1:27017/full-stack-W260126ER');
console.log('mongodb connection');

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.use(async (req, res, next) => {
    setTimeout(next, 400);
});

app.use("/files", FilesRouter);

app.listen(5000, () => {
    console.log("listening on port 5000");
});

app.get('/', (req, res) => {
    res.send({
        message: "Hello world!",
    });
});
