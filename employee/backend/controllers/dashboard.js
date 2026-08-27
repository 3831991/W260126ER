import { Router } from "express";
import { Types } from "mongoose";
import { Employee } from "./employee.js";
import guard from '../services/guard.js';
import { getCurrentUser } from "../services/utilities.js";

const router = Router();

// מספר עובדים בכל עיר
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

// בבסיס הנתונים יש רשומות שבהן תאריך הלידה נשמר כמחרוזת ולא כתאריך,
// ואופרטורים של תאריכים זורקים שגיאה על מחרוזת. onError/onNull מחזירים null במקום
const parseBirthDate = {
    $set: {
        birthDate: {
            $convert: {
                input: "$birthDate",
                to: "date",
                onError: null,
                onNull: null,
            },
        },
    },
};

// גבולות קבוצות הגיל - הגבול האחרון הוא תקרה ולא קבוצה בפני עצמה
const AGE_BOUNDARIES = [0, 20, 30, 40, 50, 60, 120];

// הופך גבול תחתון של קבוצה לתווית להצגה: 20 -> "20-29", 60 -> "60+"
const getAgeLabel = (boundary) => {
    const index = AGE_BOUNDARIES.indexOf(boundary);

    if (index === -1) {
        return "לא ידוע";
    }

    return index === AGE_BOUNDARIES.length - 2
        ? `${boundary}+`
        : `${boundary}-${AGE_BOUNDARIES[index + 1] - 1}`;
};

// עובדים לפי קבוצות גיל
router.get("/ages", guard, async (req, res) => {
    const user = getCurrentUser(req);

    const ages = await Employee.aggregate([
        {
            $match: {
                userCreatedId: new Types.ObjectId(user.userId),
            },
        },
        parseBirthDate,
        {
            $set: {
                age: {
                    $cond: [
                        { $eq: ["$birthDate", null] },
                        null,
                        {
                            $dateDiff: {
                                startDate: "$birthDate",
                                endDate: "$$NOW",
                                unit: "year",
                            },
                        },
                    ],
                },
            },
        },
        {
            // חלוקה לקבוצות גיל. עובד בלי תאריך לידה נופל ל-default
            $bucket: {
                groupBy: "$age",
                boundaries: AGE_BOUNDARIES,
                default: null,
                output: {
                    count: { $sum: 1 },
                },
            },
        },
    ]);

    // מחזירים באותו מבנה כמו /cities כדי שהגרפים בצד לקוח יהיו זהים
    res.send(ages.map(bucket => ({
        _id: getAgeLabel(bucket._id),
        count: bucket.count,
    })));
});

// מספר עובדים בכל עיר
const MONTHS = [
    "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
    "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

// ימי הולדת לפי חודש
router.get("/birth-dates", guard, async (req, res) => {
    const user = getCurrentUser(req);

    const months = await Employee.aggregate([
        {
            $match: {
                userCreatedId: new Types.ObjectId(user.userId),
            },
        },
        parseBirthDate,
        {
            // עובד בלי תאריך לידה תקין לא שייך לאף חודש
            $match: {
                birthDate: { $ne: null },
            },
        },
        {
            $group: {
                _id: { $month: "$birthDate" },
                count: { $sum: 1 },
            },
        },
    ]);

    const counts = new Map(months.map(month => [month._id, month.count]));

    // משלימים גם חודשים בלי ימי הולדת, כדי שהגרף יציג שנה שלמה לפי סדר החודשים
    res.send(MONTHS.map((name, index) => ({
        _id: name,
        count: counts.get(index + 1) ?? 0,
    })));
});

export default router;