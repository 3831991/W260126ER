import { Router } from "express";
import { model, Schema } from "mongoose";

const AddressSchema = new Schema({
    city: String,
    street: String,
    house: String,
});

const ProfileSchema = new Schema({
    name: String,
    size: Number,
    type: String,
    fileName: String,
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

router.get("/", async (req, res) => {
    const data = await Employee.find();

    res.send(data);
});

export default router;