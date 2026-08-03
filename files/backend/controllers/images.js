import { Router } from 'express';
import fs from 'fs';

const router = Router();

router.get("/", (req, res) => {
    fs.readdir('./images', (err, files) => {
        res.send(files);
    })
});

export default router;