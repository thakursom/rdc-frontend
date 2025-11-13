import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../src/services/api";
import { toast } from "react-toastify";

function ForgotPasswordComponent() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    // const [message, setMessage] = useState("");
    // const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setMessage("");
        // setErrorMsg("");

        const result = await apiRequest("/forgot-password", "POST", { email });

        if (result.success) {
            toast.success(result.data.message || "Reset link has been sent to your email.");
            // setMessage(result.data.message || "Reset link has been sent to your email.");
        } else {
            toast.error(result.data.message || "Something went wrong!");
            // setErrorMsg(result.data.message || "Something went wrong!");
        }
    };

    return (
        <div className="loginPageMainbox">
            <div className="loginMain">
                {/* LEFT SECTION SAME AS LOGIN */}
                <div className="left-sec">
                    <div className="rdc-flDesign">
                        <img
                            src="../assets/Img/RDC-MEDIA-Logo-1.jpg"
                            alt="Not Found"
                        />
                    </div>
                </div>

                {/*RIGHT FORM SECTION */}
                <div className="right-sec">
                    <form className="loginForm" onSubmit={handleSubmit}>
                        <h6 className="mb-4">Forgot Password</h6>

                        <div className="form-group rdcLogin-group">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <div className="login-Icon">
                                <i className="fa-solid fa-envelope"></i>
                            </div>
                        </div>

                        <div className="form-group rdcLogin-group">
                            <button
                                type="submit"
                                className="theme-btn green-cl white-cl py-3 w-100"
                            >
                                <i className="fa-solid fa-paper-plane me-2" /> Send Reset Link
                            </button>
                        </div>

                        {/*SUCCESS OR ERROR MESSAGE */}
                        {/* {message && (
                            <p className="text-success mt-2 text-center">{message}</p>
                        )}
                        {errorMsg && (
                            <p className="text-danger mt-2 text-center">{errorMsg}</p>
                        )} */}

                        {/*Back To Login */}
                        <div className="text-center mt-3">
                            <button
                                type="button"
                                className="border-less white-cl"
                                onClick={() => navigate("/")}
                            >
                                Back to Login
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordComponent;
