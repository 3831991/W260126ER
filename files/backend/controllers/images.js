import { Router } from 'express';
import fs from 'fs';
import { formidable } from 'formidable';

const router = Router();

router.get("/", (req, res) => {
    fs.readdir('./images', (err, files) => {
        res.send(files);
    });
});

router.post("/upload", (req, res) => {
    const form = formidable();

    form.parse(req, (err, fields, files) => {
        const file = files.image[0];

        const allowTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
        ];

        if (!allowTypes.includes(file.mimetype)) {
            return res.status(403).send({ message: "מה הקטע?????" });
        }

        if (file.size > 1000000 * 2) { // 2MB
            return res.status(403).send({ message: "לא הגזמנו???" });
        }

        fs.copyFile(file.filepath, `./images/${file.originalFilename}`, err => {
            if (err) {
                console.log(err);
            }

            res.end();
        });
    });
});

router.delete("/:imageName", (req, res) => {
    fs.unlink(`./images/${req.params.imageName}`, err => {
        res.end();
    });
});

export default router;