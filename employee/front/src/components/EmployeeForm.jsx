import { useState } from "react";
import "./EmployeeForm.css";

const toDateInputValue = date => {
    if (!date) {
        return "";
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
        return "";
    }

    return d.toISOString().slice(0, 10);
};

const buildInitialState = employee => ({
    firstName: employee?.firstName ?? "",
    lastName: employee?.lastName ?? "",
    passportId: employee?.passportId ?? "",
    phone: employee?.phone ?? "",
    email: employee?.email ?? "",
    birthDate: toDateInputValue(employee?.birthDate),
    city: employee?.address?.city ?? "",
    street: employee?.address?.street ?? "",
    house: employee?.address?.house ?? "",
    profileFile: null,
    existingFileName: employee?.profile?.fileName ?? "",
});

export default function EmployeeForm({ employee, onSubmit, onCancel, saving }) {
    const isEdit = Boolean(employee);
    const [form, setForm] = useState(() => buildInitialState(employee));

    const handleChange = e => {
        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = e => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setForm(prev => ({ ...prev, profileFile: file }));
    };

    const handleSubmit = e => {
        e.preventDefault();

        const formData = new FormData();

        formData.append(
            "data",
            JSON.stringify({
                firstName: form.firstName,
                lastName: form.lastName,
                passportId: form.passportId,
                phone: form.phone,
                email: form.email,
                birthDate: form.birthDate || null,
                address: {
                    city: form.city,
                    street: form.street,
                    house: form.house,
                },
            })
        );

        if (form.profileFile) {
            formData.append("profile", form.profileFile, form.profileFile.name);
        }

        onSubmit(formData);
    };

    return (
        <div className="employee-form-overlay" onClick={onCancel}>
            <div className="employee-form-modal" onClick={e => e.stopPropagation()}>
                <h2 className="employee-form-title">
                    {isEdit ? "עריכת עובד" : "הוספת עובד חדש"}
                </h2>
                <p className="employee-form-hint">
                    <span className="required-mark">*</span> שדה חובה
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="employee-form-grid">
                        <label className="employee-form-field">
                            <span>שם פרטי <span className="required-mark">*</span></span>
                            <input
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="employee-form-field">
                            <span>שם משפחה <span className="required-mark">*</span></span>
                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="employee-form-field">
                            <span>תעודת זהות <span className="required-mark">*</span></span>
                            <input
                                name="passportId"
                                value={form.passportId}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="employee-form-field">
                            <span>טלפון <span className="required-mark">*</span></span>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="employee-form-field">
                            <span>אימייל <span className="required-mark">*</span></span>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="employee-form-field">
                            <span>תאריך לידה <span className="required-mark">*</span></span>
                            <input
                                type="date"
                                name="birthDate"
                                value={form.birthDate}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="employee-form-field">
                            <span>עיר <span className="required-mark">*</span></span>
                            <input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="employee-form-field">
                            <span>רחוב <span className="required-mark">*</span></span>
                            <input
                                name="street"
                                value={form.street}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="employee-form-field">
                            <span>מספר בית <span className="required-mark">*</span></span>
                            <input
                                name="house"
                                value={form.house}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="employee-form-field employee-form-file">
                            <span>קובץ פרופיל</span>
                            <input
                                type="file"
                                onChange={handleFileChange}
                            />
                            {(form.profileFile?.name || form.existingFileName) && (
                                <small>{form.profileFile?.name || form.existingFileName}</small>
                            )}
                        </label>
                    </div>

                    <div className="employee-form-actions">
                        <button
                            type="button"
                            className="employee-btn employee-btn-secondary"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            ביטול
                        </button>
                        <button
                            type="submit"
                            className="employee-btn employee-btn-primary"
                            disabled={saving}
                        >
                            {saving ? "שומר..." : isEdit ? "שמירה" : "הוספה"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
