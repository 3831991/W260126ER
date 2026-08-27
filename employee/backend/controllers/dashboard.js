import { Router } from "express";
import { Employee } from "./employee.js";
import guard from '../services/guard.js';
import { getCurrentUser } from "../services/utilities.js";

const router = Router();

router.get("/cities", guard, async (req, res) => {
    const user = getCurrentUser(req);
    
    const cities = await Employee.aggregate([
        {
            $match: {
                userCreatedId: user.userId,
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