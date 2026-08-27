import { useEffect, useRef } from "react";
import "./Dashboard.css";
import { API_URL } from "../api/auth";
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';

Chart.register([
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    LineController,
    LineElement,
    PointElement,
    Legend,
    Tooltip,
]);

export default function Dashboard() {

    const citiesRef = useRef(null);
    const agesRef = useRef(null);
    const birthDatesRef = useRef(null);
    const chartsRef = useRef([]);

    // כל נקודות הקצה של הדשבורד מחזירות מבנה זהה: [{ _id, count }]
    const fetchStats = async (name) => {
        const res = await fetch(`${API_URL}/dashboard/${name}`, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        });
        return res.json();
    };

    const drawChart = (canvas, data, { label, color, type = 'bar' }) => {
        // אם הקומפוננטה כבר ירדה מהמסך אין על מה לצייר
        if (!canvas) {
            return;
        }

        const chart = new Chart(canvas, {
            type,
            data: {
                labels: data.map(item => item._id ?? 'לא ידוע'),
                datasets: [{
                    label,
                    data: data.map(item => item.count),
                    backgroundColor: color,
                    borderColor: color,
                    borderRadius: 4,
                    tension: 0.3,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                        },
                    },
                },
            },
        });

        chartsRef.current.push(chart);
    };

    const getDashboard = async () => {
        const [cities, ages, birthDates] = await Promise.all([
            fetchStats('cities'),
            fetchStats('ages'),
            fetchStats('birth-dates'),
        ]);

        drawChart(citiesRef.current, cities, { label: 'מספר עובדים', color: '#2563eb' });
        drawChart(agesRef.current, ages, { label: 'מספר עובדים', color: '#059669' });
        drawChart(birthDatesRef.current, birthDates, {
            label: 'ימי הולדת',
            color: '#d97706',
            type: 'line',
        });
    }

    useEffect(() => {
        getDashboard();

        // chart.js לא מאפשר שני גרפים על אותו canvas, לכן חובה לשחרר ביציאה
        return () => {
            chartsRef.current.forEach(chart => chart.destroy());
            chartsRef.current = [];
        };
    }, []);

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">דשבורד</h1>

            <div className="dashboard-content">
                <div className="chart-card">
                    <h2 className="chart-title">עובדים לפי עיר</h2>
                    <div className="chart-box">
                        <canvas ref={citiesRef}></canvas>
                    </div>
                </div>

                <div className="chart-card">
                    <h2 className="chart-title">עובדים לפי קבוצות גיל</h2>
                    <div className="chart-box">
                        <canvas ref={agesRef}></canvas>
                    </div>
                </div>

                <div className="chart-card chart-card-wide">
                    <h2 className="chart-title">ימי הולדת לפי חודש</h2>
                    <div className="chart-box">
                        <canvas ref={birthDatesRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}
