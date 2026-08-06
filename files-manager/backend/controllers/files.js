import { Router } from 'express';
import fs from 'fs';
import { formidable } from 'formidable';
import { model, Schema } from 'mongoose';

const schema = new Schema({
    createdTime: { type: Date, default: Date.now },
    fileName: String,
    isFolder: Boolean,
    size: Number,
    type: String,
    parent: Schema.Types.ObjectId,
    isDeleted: { type: Boolean, default: false },
});

const File = model("files", schema);

const router = Router();

router.get("/:folderId", async (req, res) => {
    const { folderId } = req.params;
    const parent = folderId === 'main' ? null : folderId;

    const files = await File.find({ parent, isDeleted: false });
    res.send(files);
});

router.post("/folder/:folderId", async (req, res) => {
    const { folderId } = req.params;
    const { folderName } = req.query;

    const folder = new File({
        fileName: folderName,
        isFolder: true,
        parent: folderId === 'main' ? null : folderId,
    });

    const newFolder = await folder.save();
    res.send(newFolder);
});

router.post("/:folderId/upload", async (req, res) => {
    const { folderId } = req.params;
    const form = formidable();

    if (!fs.existsSync('./files')) {
        fs.mkdirSync('./files', { recursive: true });
    }

    form.parse(req, async (err, fields, fileList) => {
        for (const f of fileList.files) {
            const file = new File({
                fileName: f.originalFilename,
                isFolder: false,
                size: f.size,
                type: f.mimetype,
                parent: folderId === 'main' ? null : folderId,
            });

            const fileSaved = await file.save();

            fs.copyFile(f.filepath, `./files/${fileSaved._id}`, err => {
                if (err) {
                    console.log(err);
                }
            });
        }

        res.end();
    });
});

router.patch("/:fileId/rename", async (req, res) => {
    const { fileId } = req.params;
    const { folderName } = req.query;

    const file = await File.findById(fileId);

    if (!file) {
        return res.status(403).send({ message: "file not found" });
    }

    file.fileName = folderName;
    file.save();

    res.end();
});

router.delete("/:fileId", async (req, res) => {
    const { fileId } = req.params;

    const file = await File.findById(fileId);

    if (!file) {
        return res.status(403).send({ message: "file not found" });
    }

    file.isDeleted = true;
    file.save();

    res.end();
});

export default router;