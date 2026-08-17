import { Router } from "express";
import formidable from "formidable";
import { model, Schema } from "mongoose";
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import guard from '../services/guard.js';
import validate from './employee.validation.js';

// שם הקובץ הנוכחי
const __filename = fileURLToPath(import.meta.url);
// שם התיקייה הנוכחית
const __dirname = path.dirname(__filename);


const AddressSchema = new Schema({
    city: String,
    street: String,
    house: String,
});

const ProfileSchema = new Schema({
    fileName: String,
    size: Number,
    type: String,
});

const EmployeeSchema = new Schema({
    firstName: String,
    lastName: String,
    passportId: String,
    phone: String,
    email: String,
    birthDate: Date,
    address: AddressSchema,
    profile: ProfileSchema,
    userCreatedId: {
        type: Schema.Types.ObjectId,
        index: true,
    },
});

const Employee = model("employees", EmployeeSchema);

const router = Router();

router.get("/", guard, async (req, res) => {
    const data = await Employee.find();

    res.send(data);
});

router.get('/:employeeId/profile/:fileName', guard, async (req, res) => {
    const { employeeId } = req.params;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
        return res.status(404).send({ message: "Employee not found" });
    }

    // ניתוב אבסולוטי לקובץ
    const url = path.resolve(`${__dirname}/../profiles/${employee._id}`);

    if (!fs.existsSync(url)) {
        return res.status(404).send({ message: "File not found" });
    }

    res.setHeader("Content-Type", employee.profile.type);
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(employee.profile.fileName)}"`);

    res.sendFile(url);
});

router.post("/", guard, validate, async (req, res) => {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
        const item = JSON.parse(fields.data);
        const file = files.profile[0];

        const employee = new Employee({
            firstName: item.firstName,
            lastName: item.lastName,
            passportId: item.passportId,
            phone: item.phone,
            email: item.email,
            birthDate: item.birthDate,
            address: {
                city: item.address.city,
                street: item.address.street,
                house: item.address.house,
            },
            profile: {
                fileName: file.originalFilename,
                size: file.size,
                type: file.mimetype,
            },
            // userCreatedId
        });

        const newEmployee = await employee.save();

        if (!fs.existsSync('./profiles')) {
            fs.mkdirSync('./profiles', { recursive: true });
        }

        fs.copyFile(file.filepath, `./profiles/${newEmployee._id}`, err => {
            if (err) {
                console.log(err);
            }

            res.send(newEmployee);
        });
    });
});

router.put("/:id", guard, validate, async (req, res) => {
    const { id } = req.params;
    const form = formidable();

    const employee = await Employee.findById(id);

    if (!employee) {
        return res.status(404).send({ message: "Employee not found" });
    }

    form.parse(req, async (err, fields, files) => {
        const item = JSON.parse(fields.data);
        
        employee.firstName  = item.firstName;
        employee.lastName   = item.lastName;
        employee.passportId = item.passportId;
        employee.phone      = item.phone;
        employee.email      = item.email;
        employee.birthDate  = item.birthDate;
        employee.address.city   = item.address.city;
        employee.address.street = item.address.street;
        employee.address.house  = item.address.house;

        if (files.profile) {
            const file = files.profile[0];

            employee.profile.fileName   = file.originalFilename;
            employee.profile.size       = file.size;
            employee.profile.type       = file.mimetype;

            if (!fs.existsSync('./profiles')) {
                fs.mkdirSync('./profiles', { recursive: true });
            }

            fs.copyFile(file.filepath, `./profiles/${employee._id}`, err => {
                if (err) {
                    console.log(err);
                }

                res.end();
            });
        }

        await employee.save();
        res.end();
    });
});

router.delete("/:id", guard, async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.end();
});

export default router;