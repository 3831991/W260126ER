import { Router } from 'express';
import fs from 'fs';
import { formidable } from 'formidable';
import { model, Schema } from 'mongoose';
import { type } from 'os';

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