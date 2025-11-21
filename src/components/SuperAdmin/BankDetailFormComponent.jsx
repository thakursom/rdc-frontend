import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AsyncSelect from "react-select/async";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function BankDetailFormComponent() {
    const [paymentMethod, setPaymentMethod] = useState("bank");
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedUserLabel, setSelectedUserLabel] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    const [initialValues, setInitialValues] = useState({
        user_id: "",
        paymentMethod: "bank",
        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        ifscRouting: "",
        swiftCode: "",
        branch: "",
        paypalEmail: "",
        upiId: ""
    });

    // Simplified Validation Schema - Remove conditional validation for now
    const validationSchema = Yup.object({
        user_id: Yup.string().required("User is required"),
        paymentMethod: Yup.string().required("Payment method is required"),
        // Always validate all fields but make them conditionally required in the form
    });

    // Manual validation function
    const validateForm = (values) => {
        const errors = {};

        // User is always required
        if (!values.user_id) {
            errors.user_id = "User is required";
        }

        // Payment method is always required
        if (!values.paymentMethod) {
            errors.paymentMethod = "Payment method is required";
        }

        // Conditional validation based on payment method
        if (values.paymentMethod === "bank") {
            if (!values.bankName) errors.bankName = "Bank name is required";
            if (!values.accountHolderName) errors.accountHolderName = "Account holder name is required";
            if (!values.accountNumber) errors.accountNumber = "Account number is required";
            if (!values.ifscRouting) errors.ifscRouting = "IFSC/Routing number is required";
        }

        if (values.paymentMethod === "paypal") {
            if (!values.paypalEmail) {
                errors.paypalEmail = "PayPal email is required";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.paypalEmail)) {
                errors.paypalEmail = "Invalid email address";
            }
        }

        if (values.paymentMethod === "upi") {
            if (!values.upiId) errors.upiId = "UPI ID is required";
        }

        return errors;
    };

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const res = await apiRequest(`/getBankDetailById?id=${id}`, "GET", null, true);
                console.log(res);

                if (res.success) {
                    const detail = res.data?.data;
                    setSelectedUser(detail.user_id);
                    setSelectedUserLabel(detail.userName || "User");
                    setPaymentMethod(detail.paymentMethod);

                    setInitialValues({
                        user_id: detail.user_id || "",
                        paymentMethod: detail.paymentMethod || "bank",
                        bankName: detail.bankName || "",
                        accountHolderName: detail.accountHolderName || "",
                        accountNumber: detail.accountNumber || "",
                        ifscRouting: detail.ifscRouting || "",
                        swiftCode: detail.swiftCode || "",
                        branch: detail.branch || "",
                        paypalEmail: detail.paypalEmail || "",
                        upiId: detail.upiId || ""
                    });
                }
            };
            fetchData();
        }
    }, [id]);

    // Async User search
    const loadOptions = async (inputValue) => {
        try {
            const res = await apiRequest(`/fetchAllLabel?search=${inputValue}`, "GET", null, true);
            if (res.success) {
                return res.data?.labels.map((item) => ({
                    value: item.id,
                    label: `${item.name}`
                }));
            }
            return [];
        } catch (err) {
            console.log("Dropdown Fetch Error", err);
            return [];
        }
    };

    // Save or Update
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const payload = {
                user_id: selectedUser || values.user_id,
                paymentMethod: values.paymentMethod,
                bankName: values.bankName,
                accountHolderName: values.accountHolderName,
                accountNumber: values.accountNumber,
                ifscRouting: values.ifscRouting,
                swiftCode: values.swiftCode,
                branch: values.branch,
                paypalEmail: values.paypalEmail,
                upiId: values.upiId
            };

            let res;
            if (id) {
                res = await apiRequest(`/editBankDetails/${id}`, "PUT", payload, true);
            } else {
                res = await apiRequest("/addBankDetails", "POST", payload, true);
            }

            if (res.success) {
                toast.success(id ? "Updated Successfully!" : "Saved Successfully!");
                navigate("/superadmin/bank-details");
            } else {
                toast.error(res.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to save bank details");
        } finally {
            setSubmitting(false);
        }
    };

    // Required field label component
    const RequiredLabel = ({ children }) => (
        <label className="form-label fw-semibold">
            {children} <span className="text-danger">*</span>
        </label>
    );

    // Optional field label component
    const OptionalLabel = ({ children }) => (
        <label className="form-label fw-semibold">
            {children}
        </label>
    );

    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading d-flex justify-content-between align-items-center mian-sec-heading1">
                        <h6>{id ? "Edit" : "Add"} Bank Details</h6>
                        <button
                            className="theme-btn green-cl white-cl"
                            onClick={() => navigate(-1)}
                        >
                            <i className="fa-solid fa-arrow-left me-1" /> Back
                        </button>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-12 stem-col">
                            <div className="dash-charts stem-child">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    validate={validateForm} // Add custom validation
                                    onSubmit={handleSubmit}
                                    enableReinitialize
                                >
                                    {({ setFieldValue, values, isSubmitting, errors, touched }) => (
                                        <Form className="setting-form">
                                            <div className="row">

                                                {/* User Dropdown */}
                                                <div className="col-md-6 mb-3">
                                                    <RequiredLabel>Select Label / User</RequiredLabel>
                                                    <AsyncSelect
                                                        cacheOptions
                                                        defaultOptions
                                                        loadOptions={loadOptions}
                                                        placeholder="Search Label/User"
                                                        isClearable
                                                        value={
                                                            selectedUser
                                                                ? { value: selectedUser, label: selectedUserLabel || "User" }
                                                                : null
                                                        }
                                                        onChange={(selected) => {
                                                            if (selected) {
                                                                setSelectedUser(selected.value);
                                                                setSelectedUserLabel(selected.label);
                                                                setFieldValue("user_id", selected.value);
                                                            } else {
                                                                setSelectedUser("");
                                                                setSelectedUserLabel("");
                                                                setFieldValue("user_id", "");
                                                            }
                                                        }}
                                                        className={touched.user_id && errors.user_id ? "is-invalid" : ""}
                                                    />
                                                    {errors.user_id && touched.user_id && (
                                                        <div className="text-danger small mt-1">{errors.user_id}</div>
                                                    )}
                                                </div>

                                                {/* Payment Method */}
                                                <div className="col-md-6 mb-3">
                                                    <RequiredLabel>Payment Method</RequiredLabel>
                                                    <Field
                                                        as="select"
                                                        name="paymentMethod"
                                                        className={`form-control ${touched.paymentMethod && errors.paymentMethod ? "is-invalid" : ""}`}
                                                        onChange={(e) => {
                                                            setFieldValue("paymentMethod", e.target.value);
                                                            setPaymentMethod(e.target.value);
                                                        }}
                                                    >
                                                        <option value="">-- Select Method --</option>
                                                        <option value="bank">Bank</option>
                                                        <option value="paypal">PayPal</option>
                                                        <option value="upi">UPI</option>
                                                    </Field>
                                                    {errors.paymentMethod && touched.paymentMethod && (
                                                        <div className="text-danger small mt-1">{errors.paymentMethod}</div>
                                                    )}
                                                </div>

                                                {/* Dynamic Fields */}
                                                {paymentMethod === "paypal" && (
                                                    <div className="col-md-6 mb-3">
                                                        <RequiredLabel>PayPal Email</RequiredLabel>
                                                        <Field
                                                            type="email"
                                                            name="paypalEmail"
                                                            className={`form-control ${touched.paypalEmail && errors.paypalEmail ? "is-invalid" : ""}`}
                                                            placeholder="Enter PayPal email"
                                                        />
                                                        {errors.paypalEmail && touched.paypalEmail && (
                                                            <div className="text-danger small mt-1">{errors.paypalEmail}</div>
                                                        )}
                                                    </div>
                                                )}

                                                {paymentMethod === "upi" && (
                                                    <div className="col-md-6 mb-3">
                                                        <RequiredLabel>UPI ID</RequiredLabel>
                                                        <Field
                                                            type="text"
                                                            name="upiId"
                                                            className={`form-control ${touched.upiId && errors.upiId ? "is-invalid" : ""}`}
                                                            placeholder="Enter UPI ID"
                                                        />
                                                        {errors.upiId && touched.upiId && (
                                                            <div className="text-danger small mt-1">{errors.upiId}</div>
                                                        )}
                                                    </div>
                                                )}

                                                {paymentMethod === "bank" && (
                                                    <>
                                                        <div className="col-md-6 mb-3">
                                                            <RequiredLabel>Bank Name</RequiredLabel>
                                                            <Field
                                                                type="text"
                                                                name="bankName"
                                                                className={`form-control ${touched.bankName && errors.bankName ? "is-invalid" : ""}`}
                                                                placeholder="Enter bank name"
                                                            />
                                                            {errors.bankName && touched.bankName && (
                                                                <div className="text-danger small mt-1">{errors.bankName}</div>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <RequiredLabel>Account Holder Name</RequiredLabel>
                                                            <Field
                                                                type="text"
                                                                name="accountHolderName"
                                                                className={`form-control ${touched.accountHolderName && errors.accountHolderName ? "is-invalid" : ""}`}
                                                                placeholder="Enter account holder name"
                                                            />
                                                            {errors.accountHolderName && touched.accountHolderName && (
                                                                <div className="text-danger small mt-1">{errors.accountHolderName}</div>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <RequiredLabel>Account Number</RequiredLabel>
                                                            <Field
                                                                type="text"
                                                                name="accountNumber"
                                                                className={`form-control ${touched.accountNumber && errors.accountNumber ? "is-invalid" : ""}`}
                                                                placeholder="Enter account number"
                                                            />
                                                            {errors.accountNumber && touched.accountNumber && (
                                                                <div className="text-danger small mt-1">{errors.accountNumber}</div>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <RequiredLabel>IFSC / Routing Number</RequiredLabel>
                                                            <Field
                                                                type="text"
                                                                name="ifscRouting"
                                                                className={`form-control ${touched.ifscRouting && errors.ifscRouting ? "is-invalid" : ""}`}
                                                                placeholder="Enter IFSC or routing number"
                                                            />
                                                            {errors.ifscRouting && touched.ifscRouting && (
                                                                <div className="text-danger small mt-1">{errors.ifscRouting}</div>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <OptionalLabel>SWIFT Code</OptionalLabel>
                                                            <Field
                                                                type="text"
                                                                name="swiftCode"
                                                                className="form-control"
                                                                placeholder="Enter SWIFT code"
                                                            />
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <OptionalLabel>Branch</OptionalLabel>
                                                            <Field
                                                                type="text"
                                                                name="branch"
                                                                className="form-control"
                                                                placeholder="Enter branch name"
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                                <div className="col-md-12 mt-2 text-end">
                                                    <button
                                                        className="theme-btn green-cl white-cl"
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" />
                                                                {id ? "Updating..." : "Saving..."}
                                                            </>
                                                        ) : (
                                                            id ? "Update" : "Save"
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default BankDetailFormComponent;