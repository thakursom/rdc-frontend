import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, setToken } from "../../../src/services/api";
import { toast } from "react-toastify";

function LoginComponent() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const result = await apiRequest("/login", "POST", { email, password });

        if (result.success) {
            const userData = result?.data;

            localStorage.setItem("token", userData.token);
            setToken(userData.token);
            localStorage.setItem("user", JSON.stringify(userData.user));

            toast.success("Login successful!");
            const role = userData.user.role;

            if (role === "Super Admin") navigate("/superadmin");
            else if (role === "Admin") navigate("/admin");
            else if (role === "Manager") navigate("/manager");
            else if (role === "Label") navigate("/label");
            else if (role === "Sub Label") navigate("/sub-label");
            else navigate("/label");
        } else {
            toast.error(result.data.message || "Invalid Username or Password!");
        }
    };

    return (
        <div className="loginPageMainbox">
            <div className="loginMain">
                <div className="left-sec">
                    <div className="rdc-flDesign">
                        <img src="../assets/Img/RDC-MEDIA-Logo-1.jpg" alt="Not Found" />
                    </div>
                </div>

                <div className="right-sec">
                    <form className="loginForm" onSubmit={handleLogin}>
                        <h6 className="mb-4">User Login</h6>

                        <div className="form-group rdcLogin-group">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <div className="login-Icon">
                                <i className="fa-solid fa-user" />
                            </div>
                        </div>

                        <div className="form-group rdcLogin-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="login-Icon">
                                <i className="fa-solid fa-lock" />
                            </div>
                        </div>

                        <div className="rdc-checkbox pass-reset mb-3">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="check1" />
                                <label className="form-check-label white-cl" htmlFor="check1">Remember</label>
                            </div>
                            <button
                                type="button"
                                className="border-less white-cl"
                                onClick={() => navigate("/forgot-password")}
                            >
                                Reset Password
                            </button>
                        </div>

                        <div className="form-group rdcLogin-group">
                            <button type="submit" className="theme-btn green-cl white-cl py-3 w-100">
                                <i className="fa-solid fa-right-to-bracket me-2" /> Login
                            </button>
                        </div>

                        <div className="rdc-signup">
                            <span className="white-cl">Don't have an account?</span>
                            <button className="border-less white-cl">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;
