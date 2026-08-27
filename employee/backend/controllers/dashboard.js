import { Router } from "express";
import { Types } from "mongoose";
import { Employee } from "./employee.js";
import guard from '../services/guard.js';
import { getCurrentUser } from "../services/utilities.js";

const router = Router();

router.get("/cities", guard, async (req, res) => {
    const user = getCurrentUser(req);
    
    const cities = await Employee.aggregate([
        {
            $match: {
                // aggregate לא עושה casting לפי הסכמה, לכן ההמרה ל-ObjectId ידנית
                userCreatedId: new Types.ObjectId(user.userId),
            },
        },
        {
            $group: {
                _id: "$address.city",
                count: { $sum: 1 },
            }
        },
        {
            $sort: {
                count: -1,
            },
        },
    ]);
    
    res.send(cities);
});

export default router;