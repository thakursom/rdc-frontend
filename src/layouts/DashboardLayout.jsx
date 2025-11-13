import Navbar from "../components/Navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function DashboardLayout() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    useEffect(() => {
        const sidebar = document.getElementById("right-sidebar");

        if (sidebarOpen) {
            sidebar.classList.add("rightbarWidth");
        } else {
            sidebar.classList.remove("rightbarWidth");
        }
    }, [sidebarOpen]);

    return (
        <>
            <header className={`header ${sidebarOpen ? "headerWidth" : ""}`}>
                <div className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <span className="bar" />
                    <span className="bar" />
                    <span className="bar" />
                </div>

                <ul className="header-nav-menu">
                    <li className="nav-item">
                        <button className="theme-btn green-cl white-cl">
                            Login + Master Demo Mode
                        </button>
                    </li>

                    <li className="nav-item dropdown">
                        <button className="rdc-transpairent nav-link" id="bellDrop" data-bs-toggle="dropdown">
                            <i className="fa-solid fa-bell" />
                            <span className="badge bg-danger notifiction-icon">11</span>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="bellDrop">
                            <li><a className="dropdown-item">Action</a></li>
                        </ul>
                    </li>

                    <li className="nav-item dropdown">
                        <button className="rdc-transpairent p-1 " id="LoginSignUp" data-bs-toggle="dropdown">
                            <i className="fa-solid fa-power-off" />
                        </button>

                        <ul className="dropdown-menu" aria-labelledby="LoginSignUp">
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate("/change-password")}
                                >
                                    Change Password
                                </button>
                            </li>

                            <li>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </header>

            {/* ✅ PASS PROPS HERE */}
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <Outlet />
        </>
    );
}

export default DashboardLayout;
