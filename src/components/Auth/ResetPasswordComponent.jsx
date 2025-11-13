import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../../src/services/api";
import { toast } from "react-toastify";

function ResetPasswordComponent() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    // const [message, setMessage] = useState("");
    // const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setMessage("");
        // setErrorMsg("");

        // Using your existing JSON service
        const response = await apiRequest(
            `/reset-password/${token}`,
            "POST",
            { newPassword: password }   // sent as JSON
        );

        if (response.success) {
            // setMessage("Password updated successfully!");
            toast.success("Password updated successfully!");
            setTimeout(() => navigate("/"), 1500);
        } else {
            // setErrorMsg(response.data.message || "Something went wrong!");
            toast.error(response.data.message || "Something went wrong!");
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
                    <form className="loginForm" onSubmit={handleSubmit}>
                        <h6 className="mb-4">Reset Password</h6>

                        <div className="form-group rdcLogin-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="login-Icon">
                                <i className="fa-solid fa-lock"></i>
                            </div>
                        </div>

                        <div className="form-group rdcLogin-group">
                            <button
                                type="submit"
                                className="theme-btn green-cl white-cl py-3 w-100"
                            >
                                <i className="fa-solid fa-key me-2" />
                                Update Password
                            </button>
                        </div>

                        {/* {message && <p className="text-success mt-2 text-center">{message}</p>}
                        {errorMsg && <p className="text-danger mt-2 text-center">{errorMsg}</p>} */}

                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordComponent;
