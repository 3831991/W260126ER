import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import EmployeeForm from "./EmployeeForm";
import "./Employees.css";

const API_URL = "http://localhost:4000";
const TOKEN = localStorage.getItem("token");

function authHeaders() {
    return {
        Authorization: localStorage.getItem("token"),
    };
}

const formatDate = date => {
    if (!date) {
        return "";
    }

    return new Date(date).toLocaleDateString("he-IL");
};

const isImageProfile = profile =>
    Boolean(profile?.fileName) && (!profile.type || profile.type.startsWith("image/"));

function EmployeeAvatar({ employee }) {
    const [imgError, setImgError] = useState(false);
    const showImage = !imgError && isImageProfile(employee.profile);

    if (showImage) {
        return (
            <img
                className="employee-avatar employee-avatar-img"
                src={`${API_URL}/employees/${employee._id}/profile/${employee.profile.fileName}?token=${TOKEN}`}
                alt={`${employee.firstName} ${employee.lastName}`}
                onError={() => setImgError(true)}
            />
        );
    }

    return (
        <div className="employee-avatar">
            {employee.firstName?.[0]}
            {employee.lastName?.[0]}
        </div>
    );
}

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [saving, setSaving] = useState(false);

    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const getEmployees = async () => {
        setLoading(true);

        const res = await fetch(`${API_URL}/employees`, {
            headers: authHeaders(),
        });

        if (res.ok) {
            setEmployees(await res.json());
        }

        setLoading(false);
    };

    useEffect(() => {
        getEmployees();
    }, []);

    const handleAddClick = () => {
        setEditingEmployee(null);
        setIsFormOpen(true);
    };

    const handleEditClick = employee => {
        setEditingEmployee(employee);
        setIsFormOpen(true);
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setEditingEmployee(null);
    };

    const handleFormSubmit = async formData => {
        setSaving(true);

        const url = editingEmployee
            ? `${API_URL}/employees/${editingEmployee._id}`
            : `${API_URL}/employees`;

        const res = await fetch(url, {
            method: editingEmployee ? "PUT" : "POST",
            headers: authHeaders(),
            body: formData,
        });

        setSaving(false);

        if (res.ok) {
            setIsFormOpen(false);
            setEditingEmployee(null);
            getEmployees();
        }
    };

    const handleDeleteClick = async employee => {
        const confirmed = window.confirm(
            `למחוק את ${employee.firstName} ${employee.lastName}?`
        );

        if (!confirmed) {
            return;
        }

        const res = await fetch(`${API_URL}/employees/${employee._id}`, {
            method: "DELETE",
            headers: authHeaders(),
        });

        if (res.ok) {
            getEmployees();
        }
    };

    return (
        <div className="employees-page">
            <div className="employees-header">
                <h1 className="employees-title">ניהול עובדים</h1>
                <button className="employee-btn employee-btn-primary" onClick={handleAddClick}>
                    + הוספת עובד
                </button>
                <div className="employees-user">
                    <span>שלום {user?.firstName || 'אורח'}</span>
                    <button className="employee-btn employee-btn-secondary" onClick={handleLogout}>
                        התנתקות
                    </button>
                </div>
            </div>

            {loading && <p className="employees-status">טוען עובדים...</p>}
            {!loading && employees.length === 0 && (
                <p className="employees-status">אין עובדים להצגה</p>
            )}

            <div className="employees-grid">
                {employees.map(emp => (
                    <div className="employee-card" key={emp._id}>
                        <div className="employee-card-actions">
                            <button
                                type="button"
                                className="employee-icon-btn employee-icon-btn-edit"
                                title="עריכה"
                                onClick={() => handleEditClick(emp)}
                            >
                                ✏️
                            </button>
                            <button
                                type="button"
                                className="employee-icon-btn employee-icon-btn-delete"
                                title="מחיקה"
                                onClick={() => handleDeleteClick(emp)}
                            >
                                🗑️
                            </button>
                        </div>

                        <EmployeeAvatar employee={emp} />

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

            {isFormOpen && (
                <EmployeeForm
                    employee={editingEmployee}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    saving={saving}
                />
            )}
        </div>
    );
}
