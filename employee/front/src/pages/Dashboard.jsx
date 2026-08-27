import { useEffect } from "react";
import "./Dashboard.css";
import { API_URL } from "../api/auth";

export default function Dashboard() {

    const getDashboard = async () => {
        const res = await fetch(`${API_URL}/dashboard/cities`, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        });
        const data = await res.json();

        console.log(data);
        
    }

    useEffect(() => {
        getDashboard();
    }, []);

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">דשבורד</h1>

            {/* כאן נבנה את תוכן הדשבורד */}
            <div className="dashboard-content"></div>
        </div>
    );
}
