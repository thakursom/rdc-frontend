import { useState } from "react";
import { apiRequest } from "../../../src/services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ChangePasswordComponent() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Eye toggle states
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New password & Confirm password do not match!");
            return;
        }

        setLoading(true);
        const result = await apiRequest("/change-password", "POST", { oldPassword, newPassword }, true);
        setLoading(false);

        if (result.success) {
            toast.success(result?.data?.message || "Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            toast.error(result?.data?.message || "Failed to change password!");
        }
    };

    return (
        <section className="rdc-rightbar" id="right-sidebar">
            <div className="main-content-dashboard">

                <div className="mian-sec-heading d-flex justify-content-between align-items-center">
                    <h6>Change Password</h6>
                    <button
                        className="theme-btn green-cl white-cl"
                        onClick={() => navigate(-1)}
                    >
                        <i className="fa-solid fa-arrow-left me-1" /> Back
                    </button>
                </div>

                <div className="dashTabs">
                    <div className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
                        <div className="card-body">
                            <form onSubmit={handleChangePassword}>

                                {/* OLD PASSWORD */}
                                <div className="form-group rdcLogin-group mb-3 position-relative">
                                    <input
                                        type={showOld ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Old Password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                    />
                                    <div className="login-Icon">
                                        <i className="fa-solid fa-lock" />
                                    </div>

                                    <span
                                        className="password-eye"
                                        onClick={() => setShowOld(!showOld)}
                                        style={{ position: "absolute", right: "15px", top: "10px", cursor: "pointer" }}
                                    >
                                        <i className={`fa-solid ${showOld ? "fa-eye" : "fa-eye-slash"}`} />
                                    </span>
                                </div>

                                {/* NEW PASSWORD */}
                                <div className="form-group rdcLogin-group mb-3 position-relative">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        className="form-control"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <div className="login-Icon">
                                        <i className="fa-solid fa-key" />
                                    </div>

                                    <span
                                        className="password-eye"
                                        onClick={() => setShowNew(!showNew)}
                                        style={{ position: "absolute", right: "15px", top: "10px", cursor: "pointer" }}
                                    >
                                        <i className={`fa-solid ${showNew ? "fa-eye" : "fa-eye-slash"}`} />
                                    </span>
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="form-group rdcLogin-group mb-4 position-relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <div className="login-Icon">
                                        <i className="fa-solid fa-shield-halved" />
                                    </div>

                                    <span
                                        className="password-eye"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        style={{ position: "absolute", right: "15px", top: "10px", cursor: "pointer" }}
                                    >
                                        <i className={`fa-solid ${showConfirm ? "fa-eye" : "fa-eye-slash"}`} />
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="theme-btn green-cl white-cl w-100 py-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        "Changing..."
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-check me-2" />
                                            Change Password
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ChangePasswordComponent;
