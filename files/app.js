import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.get('/', (req, res) => {
    res.send({
        message: "Hello world!",
    });
});

app.listen(3333, () => {
    console.log("listening on port 3333");
});