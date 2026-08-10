import { Router } from 'express';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { formidable } from 'formidable';
import { model, Schema } from 'mongoose';
import { mimeToExt } from '../config.js';

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

// שם הקובץ הנוכחי
const __filename = fileURLToPath(import.meta.url);
// שם התיקייה הנוכחית
const __dirname = path.dirname(__filename);

// קבלת כל הקבצים והתיקיות
router.get("/all", async (req, res) => {
    const files = await File.find({ isDeleted: false });

    res.send({
        files
    });
});

// קבלת סל המחזור
router.get("/recycle-bin", async (req, res) => {
    const files = await File.find({ isDeleted: true });

    res.send({
        files
    });
});

// קבלת תוכן של תיקייה
router.get("/:folderId", async (req, res) => {
    const { folderId } = req.params;
    const parent = folderId === 'main' ? null : folderId;
    let folder;

    if (parent) {
        folder = await File.findOne({ _id: parent, isDeleted: false });
    }

    const files = await File.find({ parent, isDeleted: false });

    res.send({
        folder,
        files
    });
});

router.get('/file/:fileId/:fileName', async (req, res) => {
    const { fileId } = req.params;
    // מקבלים את הקובץ רק אם מזהה נמצא והקובץ לא נמחק
    const file = await File.findOne({ _id: fileId, isDeleted: false });

    if (!file) {
        return res.status(404).send({ message: "file not found" });
    }

    // ניתוב אבסולוטי לקובץ
    const url = path.resolve(`${__dirname}/../files/${fileId}`);

    res.setHeader("Content-Type", file.type);
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.fileName + '.' + mimeToExt[file.type])}"`);

    res.sendFile(url);
});

// Create folder
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

// Upload filed
router.post("/:folderId/upload", async (req, res) => {
    const { folderId } = req.params;
    const form = formidable();

    if (!fs.existsSync('./files')) {
        fs.mkdirSync('./files', { recursive: true });
    }

    form.parse(req, async (err, fields, fileList) => {
        for (const f of fileList.files) {
            const name = f.originalFilename.split('.');
            name.pop();

            const file = new File({
                fileName: name.join('.'),
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

router.patch("/:fileId/restore", async (req, res) => {
    const { fileId } = req.params;

    const file = await File.findById(fileId);

    if (!file) {
        return res.status(403).send({ message: "file not found" });
    }

    file.isDeleted = false;
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