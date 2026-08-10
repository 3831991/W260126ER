import { useEffect, useState } from "react";
import "./Employees.css";

const API_URL = "http://localhost:4000";

const formatDate = date => {
    if (!date) {
        return "";
    }

    return new Date(date).toLocaleDateString("he-IL");
};

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const getEmployees = async () => {
        setLoading(true);

        const res = await fetch(`${API_URL}/employees`);

        if (res.ok) {
            setEmployees(await res.json());
        }

        setLoading(false);
    };

    useEffect(() => {
        getEmployees();
    }, []);

    return (
        <div className="employees-page">
            <h1 className="employees-title">ניהול עובדים</h1>

            {loading && <p className="employees-status">טוען עובדים...</p>}
            {!loading && employees.length === 0 && (
                <p className="employees-status">אין עובדים להצגה</p>
            )}

            <div className="employees-grid">
                {employees.map(emp => (
                    <div className="employee-card" key={emp._id}>
                        <div className="employee-avatar">
                            {emp.firstName?.[0]}
                            {emp.lastName?.[0]}
                        </div>

                        <h2 className="employee-name">
                            {emp.firstName} {emp.lastName}
                        </h2>

                        <div className="employee-details">
                            {emp.passportId && (
                                <div className="employee-row">
                                    <span className="employee-label">ת.ז:</span>
                                    <span>{emp.passportId}</span>
                                </div>
                            )}
                            {emp.phone && (
                                <div className="employee-row">
                                    <span className="employee-label">טלפון:</span>
                                    <span>{emp.phone}</span>
                                </div>
                            )}
                            {emp.email && (
                                <div className="employee-row">
                                    <span className="employee-label">אימייל:</span>
                                    <span>{emp.email}</span>
                                </div>
                            )}
                            {emp.birthDate && (
                                <div className="employee-row">
                                    <span className="employee-label">תאריך לידה:</span>
                                    <span>{formatDate(emp.birthDate)}</span>
                                </div>
                            )}
                            {emp.address && (emp.address.city || emp.address.street || emp.address.house) && (
                                <div className="employee-row">
                                    <span className="employee-label">כתובת:</span>
                                    <span>
                                        {[emp.address.street, emp.address.house, emp.address.city]
                                            .filter(Boolean)
                                            .join(" ")}
                                    </span>
                                </div>
                            )}
                            {emp.profile?.fileName && (
                                <div className="employee-row">
                                    <span className="employee-label">קובץ:</span>
                                    <span>{emp.profile.fileName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
