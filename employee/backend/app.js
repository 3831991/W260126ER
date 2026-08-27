import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import AuthRouter from './controllers/auth.js'
import EmployeesRouter from './controllers/employee.js';
import "dotenv/config";

await mongoose.connect(process.env.MONGO_URL);
console.log('mongodb connection');

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.use("/", AuthRouter);
app.use("/employees", EmployeesRouter);

app.get("/", (req, res) => {
    res.send({
        message: 'Hello world!',
    });
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        message: err.message || "Internal server error",
    });
});

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});
