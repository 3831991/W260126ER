import { Router } from 'express';
import fs from 'fs';

const router = Router();

router.get("/", (req, res) => {
    fs.readdir('./images', (err, files) => {
        res.send(files);
    });
});

router.delete("/:imageName", (req, res) => {
    fs.unlink(`./images/${req.params.imageName}`, err => {
        res.end();
    });
});

export default router;