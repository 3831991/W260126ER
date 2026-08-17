import formidable from "formidable";
import { EmployeeJoiSchema } from "./employee.joi.js"
import { JOI_HEBREW } from "../joi-hebrew.js";

export default (req, res, next) => {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).send({ error: err.message });
        }

        const item = JSON.parse(fields.data);

        const { error, value } = EmployeeJoiSchema.validate(item, {
            abortEarly: false,
            stripUnknown: true,
            messages: {
                he: JOI_HEBREW,
            },
            errors: {
                language: 'he'
            }
        });

        if (error) {
            return res.status(400).send({
                error: error.details.map(x => x.message),
            });
        }

        req.fields = fields;
        req.files = files;

        next();
    });
}