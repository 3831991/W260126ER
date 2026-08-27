import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Navbar.css";

const links = [
    { to: "/", label: "דשבורד", end: true },
    { to: "/employees", label: "עובדים" },
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="navbar">
            <div className="navbar-brand">👤 ניהול עובדים</div>

            <nav className="navbar-links">
                {links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            isActive ? "navbar-link navbar-link-active" : "navbar-link"
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="navbar-user">
                <span>שלום {user?.fullName || "אורח"}</span>
                <button type="button" className="navbar-logout" onClick={handleLogout}>
                    התנתקות
                </button>
            </div>
        </header>
    );
}
