import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords do not match")
        .required("Confirm password required"),
    role: Yup.string().required("Role is required"),
});

function AddUserComponent() {
    const navigate = useNavigate();

    const onSubmit = async (values, { resetForm, setSubmitting }) => {
        const sendData = { ...values };

        sendData.userEmail = sendData.email;
        delete sendData.email;
        delete sendData.confirmPassword;

        const result = await apiRequest("/add-user", "POST", sendData, true);
        setSubmitting(false);

        if (result.success) {
            toast.success("User Added Successfully");
            resetForm();
        } else {
            toast.error(result.message || "Something went wrong");
        }
    };

    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">

                    {/* Page heading */}
                    <div className="mian-sec-heading d-flex justify-content-between align-items-center mian-sec-heading1">
                        <h6>Add User</h6>
                        <button
                            className="theme-btn green-cl white-cl"
                            onClick={() => navigate(-1)}
                        >
                            <i className="fa-solid fa-arrow-left me-1" /> Back
                        </button>
                    </div>

                    {/* White Card */}
                    <div className="form-card bank-details">
                        <Formik
                            initialValues={{
                                name: "",
                                email: "",
                                password: "",
                                confirmPassword: "",
                                role: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="row">

                                        {/* Name */}
                                        <div className="col-md-6 mb-3">
                                            <label>
                                                Name <span className="required">*</span>
                                            </label>
                                            <Field
                                                type="text"
                                                name="name"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                name="name"
                                                component="small"
                                                className="text-danger"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="col-md-6 mb-3">
                                            <label>
                                                Email Address <span className="required">*</span>
                                            </label>
                                            <Field
                                                type="email"
                                                name="email"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="small"
                                                className="text-danger"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div className="col-md-6 mb-3">
                                            <label>
                                                Password <span className="required">*</span>
                                            </label>
                                            <Field
                                                type="password"
                                                name="password"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                name="password"
                                                component="small"
                                                className="text-danger"
                                            />
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="col-md-6 mb-3">
                                            <label>
                                                Confirm Password{" "}
                                                <span className="required">*</span>
                                            </label>
                                            <Field
                                                type="password"
                                                name="confirmPassword"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                name="confirmPassword"
                                                component="small"
                                                className="text-danger"
                                            />
                                        </div>

                                        {/* Role */}
                                        <div className="col-md-6 mb-3">
                                            <label>
                                                Role <span className="required">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="role"
                                                className="form-control"
                                            >
                                                <option value="">Select</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Label">Label</option>
                                            </Field>
                                            <ErrorMessage
                                                name="role"
                                                component="small"
                                                className="text-danger"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="col-12 mt-2 addUser">
                                            <button
                                                className="save-btn"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? "Saving..." : "Save"}
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AddUserComponent;
