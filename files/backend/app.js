import express from 'express';
import cors from 'cors';
import ImagesRouter from './controllers/images.js';

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.use('/files', express.static('images'));
app.use('/images', ImagesRouter)

app.get('/', (req, res) => {
    res.send({
        message: "Hello world!",
    });
});

app.listen(3333, () => {
    console.log("listening on port 3333");
});