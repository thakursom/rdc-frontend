import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    selectedUser: Yup.string().required("SubLabel selection is required"),
    amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive")
        .typeError("Amount must be a number"),
    description: Yup.string().optional(),
});

function AddPayoutComponent() {
    const [selectedUserLabel, setSelectedUserLabel] = useState("");
    const [bankDetail, setBankDetail] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            selectedUser: "",
            amount: "",
            description: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);

            if (!bankDetail.paymentMethod) {
                toast.error("Bank details are missing for this user. Please add them first.");
                setLoading(false);
                return;
            }

            const payload = {
                user_id: values.selectedUser,
                paymentMethod: bankDetail.paymentMethod,
                amount: values.amount,
                description: values.description,
                paymentDetails: bankDetail,
            };

            try {
                const res = await apiRequest("/createPayout", "POST", payload, true);

                if (res.success) {
                    toast.success("Payout saved successfully");
                    formik.resetForm();
                    setBankDetail({});
                    setSelectedUserLabel("");
                    navigate("/label/payouts");
                } else {
                    toast.error(res.message || "Failed to save payout");
                }
            } catch (err) {
                toast.error("Error while saving payout");
                console.error("Submit Error", err);
            } finally {
                setLoading(false);
            }
        },
    });

    const loadOptions = async (inputValue) => {
        try {
            const res = await apiRequest(`/fetchAllSubLabel?search=${inputValue}`, "GET", null, true);

            if (res.success) {
                return res.data?.labels.map((item) => ({
                    value: item.id,
                    label: `${item.name}`,
                    amount: item.amount
                }));
            }
            return [];
        } catch (err) {
            console.log("Dropdown Error", err);
            return [];
        }
    };

    useEffect(() => {
        if (!formik.values.selectedUser) return;

        const fetchData = async () => {
            try {
                const res = await apiRequest(
                    `/getBankDetailForPayout?userId=${formik.values.selectedUser}`,
                    "GET",
                    null,
                    true
                );

                const detail = res.data?.data;

                if (!res.success || !detail || Object.keys(detail).length === 0) {
                    toast.error("Bank details are missing for this user. Please add them first.");
                    formik.setFieldValue("selectedUser", "");
                    formik.setFieldValue("amount", "");
                    formik.setFieldValue("description", "");
                    setSelectedUserLabel("");
                    setBankDetail({});
                    return;
                }

                setBankDetail(detail);

            } catch (err) {
                toast.error("Error while fetching bank details");
                setBankDetail({});
                formik.setFieldValue("selectedUser", "");
                setSelectedUserLabel("");
            }
        };

        fetchData();
    }, [formik.values.selectedUser]);

    const handleUserChange = (sel) => {
        if (sel) {
            formik.setFieldValue("selectedUser", sel.value);
            setSelectedUserLabel(sel.label);
        } else {
            formik.setFieldValue("selectedUser", "");
            formik.setFieldValue("amount", "");
            formik.setFieldValue("description", "");
            setSelectedUserLabel("");
            setBankDetail({});
        }
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: "38px",
            height: "38px",
            paddingLeft: "6px",
            paddingRight: "6px",

            borderColor: formik.touched.selectedUser && formik.errors.selectedUser
                ? "#dc3545"
                : state.isFocused ? "#86b7fe" : "#dee2e6",

            boxShadow: formik.touched.selectedUser && formik.errors.selectedUser
                ? "0 0 0 0.25rem rgba(220,53,69,.25)"
                : state.isFocused ? "0 0 0 0.25rem rgba(13,110,253,.25)" : "none",

            "&:hover": {
                borderColor: formik.touched.selectedUser && formik.errors.selectedUser
                    ? "#dc3545"
                    : state.isFocused ? "#86b7fe" : "#dee2e6",
            }
        }),

        valueContainer: (base) => ({
            ...base,
            height: "38px",
            padding: "0 8px",
            display: "flex",
            alignItems: "center"
        }),

        indicatorsContainer: (base) => ({
            ...base,
            height: "38px"
        })
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        formik.validateForm().then(errors => {
            if (Object.keys(errors).length === 0) {
                formik.handleSubmit();
            } else {
                formik.setTouched({
                    selectedUser: true,
                    amount: true,
                    description: true,
                });
                toast.error("Please fix validation errors before submitting!");
            }
        });
    };

    return (
        <section className="rdc-rightbar" id="right-sidebar">
            <div className="main-content-dashboard">
                <div className="mian-sec-heading d-flex justify-content-between align-items-center mian-sec-heading">
                    <h6>Add Payout</h6>
                    <button className="theme-btn green-cl white-cl" onClick={() => window.history.back()}>
                        <i className="fa-solid fa-arrow-left me-1" /> Back
                    </button>
                </div>

                <div className="row g-4">
                    <div className="col-md-12 stem-col">
                        <div className="dash-charts stem-child p-4">

                            <form onSubmit={handleSubmit} className="setting-form">
                                <div className="row">

                                    {/* User */}
                                    <div className="col-md-6 mb-3">
                                        <label className="fw-semibold">Select Label/User *</label>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={loadOptions}
                                            value={formik.values.selectedUser ?
                                                { value: formik.values.selectedUser, label: selectedUserLabel } : null
                                            }
                                            isClearable
                                            onChange={handleUserChange}
                                            onBlur={() => formik.setFieldTouched("selectedUser", true)}
                                            placeholder="Search Sub Label"
                                            styles={customStyles}
                                            className={formik.touched.selectedUser && formik.errors.selectedUser ? 'is-invalid' : ''}
                                        />
                                        {formik.touched.selectedUser && formik.errors.selectedUser && (
                                            <div className="text-danger small mt-1">
                                                {formik.errors.selectedUser}
                                            </div>
                                        )}
                                    </div>

                                    {/* Payment Method */}
                                    <div className="col-md-6 mb-3">
                                        <label className="fw-semibold">Payment Method *</label>
                                        <select
                                            className="form-control"
                                            value={bankDetail.paymentMethod || ""}
                                            disabled
                                        >
                                            <option value="">-- Select --</option>
                                            <option value="bank">Bank</option>
                                            <option value="paypal">PayPal</option>
                                            <option value="upi">UPI</option>
                                        </select>
                                        {!bankDetail.paymentMethod && formik.values.selectedUser && (
                                            <div className="text-danger small mt-1">
                                                Payment method not available for this user
                                            </div>
                                        )}
                                    </div>

                                    {bankDetail.paymentMethod && (
                                        <>
                                            {/* BANK FIELDS */}
                                            {bankDetail.paymentMethod === "bank" && (
                                                <>
                                                    <div className="col-md-6 mb-3">
                                                        <label>Bank Name</label>
                                                        <input className="form-control" value={bankDetail.bankName || ""} disabled />
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label>Account Holder Name</label>
                                                        <input className="form-control" value={bankDetail.accountHolderName || ""} disabled />
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label>Account Number</label>
                                                        <input className="form-control" value={bankDetail.accountNumber || ""} disabled />
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label>IFSC / Routing</label>
                                                        <input className="form-control" value={bankDetail.ifscRouting || ""} disabled />
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label>SWIFT Code</label>
                                                        <input className="form-control" value={bankDetail.swiftCode || ""} disabled />
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label>Branch</label>
                                                        <input className="form-control" value={bankDetail.branch || ""} disabled />
                                                    </div>
                                                </>
                                            )}

                                            {/* PAYPAL FIELD */}
                                            {bankDetail.paymentMethod === "paypal" && (
                                                <div className="col-md-6 mb-3">
                                                    <label>PayPal Email</label>
                                                    <input className="form-control" value={bankDetail.paypalEmail || ""} disabled />
                                                </div>
                                            )}

                                            {/* UPI FIELD */}
                                            {bankDetail.paymentMethod === "upi" && (
                                                <div className="col-md-6 mb-3">
                                                    <label>UPI ID</label>
                                                    <input className="form-control" value={bankDetail.upiId || ""} disabled />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Amount */}
                                    <div className="col-md-6 mb-3">
                                        <label>Amount *</label>
                                        <input
                                            type="number"
                                            className={`form-control ${formik.touched.amount && formik.errors.amount ? 'is-invalid' : ''
                                                }`}
                                            name="amount"
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter payout amount"
                                            disabled={!formik.values.selectedUser}
                                        />
                                        {formik.touched.amount && formik.errors.amount && (
                                            <div className="text-danger small mt-1">
                                                {formik.errors.amount}
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="col-md-6 mb-3">
                                        <label>Comment</label>
                                        <textarea
                                            className={`form-control ${formik.touched.description && formik.errors.description
                                                ? 'is-invalid'
                                                : ''
                                                }`}
                                            name="description"
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Comment"
                                            rows={4}
                                            disabled={!formik.values.selectedUser}
                                        />
                                        {formik.touched.description && formik.errors.description && (
                                            <div className="text-danger small mt-1">
                                                {formik.errors.description}
                                            </div>
                                        )}
                                    </div>


                                    <div className="col-md-12 text-end mt-3">
                                        <button
                                            className="theme-btn green-cl white-cl"
                                            type="submit"
                                            disabled={loading || !bankDetail.paymentMethod}
                                        >
                                            {loading ? (
                                                <>
                                                    <i className="fa-solid fa-spinner fa-spin me-1" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Save Payout"
                                            )}
                                        </button>
                                    </div>

                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AddPayoutComponent;