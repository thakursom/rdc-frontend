import { useNavigate } from "react-router-dom";
import { apiRequest, setToken } from "../../../src/services/api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

function LoginComponent() {
    const navigate = useNavigate();

    // Validation rules
    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string().required("Password is required"),
        remember: Yup.boolean()
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            remember: false
        },
        validationSchema,
        onSubmit: async (values) => {
            const result = await apiRequest("/login", "POST", {
                email: values.email,
                password: values.password,
            });

            if (result.success) {
                const userData = result.data;

                // Save token
                setToken(userData.token);
                localStorage.setItem("token", userData.token);
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
                toast.error(result?.data?.message || "Invalid Username or Password!");
            }
        }
    });

    return (
        <div className="loginPageMainbox">
            <div className="loginMain">
                <div className="left-sec">
                    <div className="rdc-flDesign">
                        <img src="../assets/Img/RDC-MEDIA-Logo-1.jpg" alt="Not Found" />
                    </div>
                </div>

                <div className="right-sec">
                    <form className="loginForm" onSubmit={formik.handleSubmit}>
                        <h6 className="mb-4">User Login</h6>

                        {/* Email */}
                        <div className="form-group rdcLogin-group">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div className="login-Icon">
                                <i className="fa-solid fa-user" />
                            </div>

                            {formik.touched.email && formik.errors.email && (
                                <small className="text-danger">{formik.errors.email}</small>
                            )}
                        </div>

                        {/* Password */}
                        <div className="form-group rdcLogin-group">
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div className="login-Icon">
                                <i className="fa-solid fa-lock" />
                            </div>

                            {formik.touched.password && formik.errors.password && (
                                <small className="text-danger">{formik.errors.password}</small>
                            )}
                        </div>

                        {/* Remember + Reset */}
                        <div className="rdc-checkbox pass-reset mb-3">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    id="check1"
                                    name="remember"
                                    className="form-check-input"
                                    checked={formik.values.remember}
                                    onChange={formik.handleChange}
                                />
                                <label className="form-check-label white-cl" htmlFor="check1">
                                    Remember
                                </label>
                            </div>

                            <button
                                type="button"
                                className="border-less white-cl"
                                onClick={() => navigate("/forgot-password")}
                            >
                                Reset Password
                            </button>
                        </div>

                        {/* Submit */}
                        <div className="form-group rdcLogin-group">
                            <button type="submit" className="theme-btn green-cl white-cl py-3 w-100">
                                <i className="fa-solid fa-right-to-bracket me-2" /> Login
                            </button>
                        </div>

                        {/* Signup */}
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
