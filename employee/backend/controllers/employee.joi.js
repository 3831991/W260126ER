import Joi from "joi";
const israeliPhoneRegex = /^(?:(?:\+|972)?[\s-]?)(?:0?([23489]|5[0-8]|7[1-9]))[\s-]?(\d{3})[\s-]?(\d{4})$/;

export const EmployeeJoiSchema = Joi.object({
    firstName: Joi.string().min(2).max(20).required(),
    lastName: Joi.string().min(2).max(20).required(),
    passportId: Joi.string().length(9).required(),
    phone: Joi.string().pattern(israeliPhoneRegex).required(),
    email: Joi.string().email({ tlds: { allow: true } }).required(),
    birthDate: Joi.date().iso().required(),
    address: Joi.object({
        city: Joi.string().required(),
        street: Joi.string().required(),
        house: Joi.string().required(),
    }).required(),
});