import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AsyncSelect from "react-select/async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../../services/api";

function ContractFormComponent() {
    const [fileName, setFileName] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");
    const [selectedLabelName, setSelectedLabelName] = useState("");
    const [initialValues, setInitialValues] = useState({
        label: "",
        contractName: "",
        startDate: "",
        endDate: "",
        labelPercentage: "",
        pdf: null,
    });
    const [existingPdf, setExistingPdf] = useState("");

    const navigate = useNavigate();
    const { id } = useParams();

    // ✅ Simplified Validation Schema
    const validationSchema = Yup.object({
        label: Yup.string().required("Label is required"),
        contractName: Yup.string()
            .required("Contract Name is required")
            .min(3, "Contract Name must be at least 3 characters"),
        startDate: Yup.date()
            .required("Start Date is required")
            .min(new Date(), "Start Date cannot be in the past"),
        endDate: Yup.date()
            .required("End Date is required")
            .min(Yup.ref("startDate"), "End Date must be after Start Date"),
        labelPercentage: Yup.number()
            .typeError("Label Percentage must be a number")
            .min(0, "Label Percentage cannot be negative")
            .max(100, "Label Percentage cannot exceed 100%"),
    });

    // ✅ Fetch existing contract when editing
    useEffect(() => {
        if (id) {
            const fetchContract = async () => {
                try {
                    const res = await apiRequest(`/getContractById?id=${id}`, "GET", null, true);
                    if (res.success) {
                        const detail = res.data?.data;

                        // ✅ Set initial values for Formik
                        setInitialValues({
                            label: detail.user_id || "",
                            contractName: detail.contractName || "",
                            startDate: detail.startDate
                                ? new Date(detail.startDate).toISOString().split("T")[0]
                                : "",
                            endDate: detail.endDate
                                ? new Date(detail.endDate).toISOString().split("T")[0]
                                : "",
                            labelPercentage: detail.labelPercentage || "",
                            pdf: null, // Keep as null for edits
                        });

                        // ✅ Store existing PDF filename
                        setExistingPdf(detail.pdf || "");

                        // ✅ Prefill dropdown label properly
                        if (detail.user_id && detail.userName) {
                            setSelectedLabel(detail.user_id);
                            setSelectedLabelName(detail.userName);
                        }

                        // ✅ Prefill file name
                        setFileName(detail.pdf || "");
                    }
                } catch (error) {
                    console.error("Fetch Contract Error:", error);
                }
            };
            fetchContract();
        }
    }, [id]);

    // ✅ Fetch dropdown labels dynamically
    const loadOptions = async (inputValue) => {
        try {
            const res = await apiRequest(`/fetchAllLabel?search=${inputValue}`, "GET", null, true);
            if (res.success) {
                return res.data?.labels.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
            }
            return [];
        } catch (err) {
            console.error("Dropdown Fetch Error", err);
            return [];
        }
    };

    const getTodayDate = () => new Date().toISOString().split("T")[0];

    // ✅ Handle save/update with manual PDF validation
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // ✅ Manual PDF validation
            if (!id && !values.pdf) {
                toast.error("PDF file is required for new contracts");
                return;
            }

            if (id && !values.pdf && !existingPdf) {
                toast.error("PDF file is required");
                return;
            }

            // ✅ File type validation
            if (values.pdf && values.pdf.type !== "application/pdf") {
                toast.error("Only PDF files are allowed");
                return;
            }

            const payload = new FormData();
            payload.append("label", selectedLabel || values.label);
            payload.append("contractName", values.contractName);
            payload.append("startDate", values.startDate);
            payload.append("endDate", values.endDate);
            payload.append("labelPercentage", values.labelPercentage);

            // ✅ Only append PDF if it's a new file
            if (values.pdf) {
                payload.append("pdf", values.pdf);
            }

            let res;
            if (id) {
                res = await apiRequest(`/editContract/${id}`, "PUT", payload, true);
            } else {
                res = await apiRequest("/addContract", "POST", payload, true);
            }

            if (res.success) {
                toast.success(id ? "Contract Updated Successfully!" : "Contract Uploaded Successfully!");
                navigate("/superadmin/contract");
            } else {
                toast.error(res.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to submit contract");
        } finally {
            setSubmitting(false);
        }
    };

    // ✅ Required field label component
    const RequiredLabel = ({ children }) => (
        <label className="form-label fw-semibold">
            {children} <span className="text-danger">*</span>
        </label>
    );

    // ✅ Optional field label component
    const OptionalLabel = ({ children }) => (
        <label className="form-label fw-semibold">
            {children}
        </label>
    );

    return (
        <section className="rdc-rightbar" id="right-sidebar">
            <div className="main-content-dashboard">
                <div className="mian-sec-heading d-flex justify-content-between align-items-center mian-sec-heading1"> 
                    <h6>{id ? "Edit" : "Upload"} Contract</h6>
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
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {({ setFieldValue, values, isSubmitting, errors, touched }) => (
                                    <Form className="setting-form">
                                        <div className="row">
                                            {/* Label Selection */}
                                            <div className="col-md-6 mb-3">
                                                <RequiredLabel>Select Label</RequiredLabel>
                                                <AsyncSelect
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={loadOptions}
                                                    placeholder="Search Label"
                                                    isClearable
                                                    value={
                                                        selectedLabel
                                                            ? { value: selectedLabel, label: selectedLabelName }
                                                            : null
                                                    }
                                                    onChange={(selected) => {
                                                        if (selected) {
                                                            setSelectedLabel(selected.value);
                                                            setSelectedLabelName(selected.label);
                                                            setFieldValue("label", selected.value);
                                                        } else {
                                                            setSelectedLabel("");
                                                            setSelectedLabelName("");
                                                            setFieldValue("label", "");
                                                        }
                                                    }}
                                                    className={touched.label && errors.label ? "is-invalid" : ""}
                                                />
                                                <ErrorMessage
                                                    name="label"
                                                    component="div"
                                                    className="text-danger small mt-1"
                                                />
                                            </div>

                                            {/* Contract Name */}
                                            <div className="col-md-6 mb-3">
                                                <RequiredLabel>Contract Name</RequiredLabel>
                                                <Field
                                                    type="text"
                                                    name="contractName"
                                                    className={`form-control ${touched.contractName && errors.contractName ? "is-invalid" : ""}`}
                                                    placeholder="Enter Contract Name"
                                                />
                                                <ErrorMessage
                                                    name="contractName"
                                                    component="div"
                                                    className="text-danger small mt-1"
                                                />
                                            </div>

                                            {/* Start Date */}
                                            <div className="col-md-6 mb-3">
                                                <RequiredLabel>Start Date</RequiredLabel>
                                                <Field
                                                    type="date"
                                                    name="startDate"
                                                    className={`form-control ${touched.startDate && errors.startDate ? "is-invalid" : ""}`}
                                                    min={getTodayDate()}
                                                />
                                                <ErrorMessage
                                                    name="startDate"
                                                    component="div"
                                                    className="text-danger small mt-1"
                                                />
                                            </div>

                                            {/* End Date */}
                                            <div className="col-md-6 mb-3">
                                                <RequiredLabel>End Date</RequiredLabel>
                                                <Field
                                                    type="date"
                                                    name="endDate"
                                                    className={`form-control ${touched.endDate && errors.endDate ? "is-invalid" : ""}`}
                                                    min={values.startDate || getTodayDate()}
                                                />
                                                <ErrorMessage
                                                    name="endDate"
                                                    component="div"
                                                    className="text-danger small mt-1"
                                                />
                                            </div>

                                            {/* Label Percentage */}
                                            <div className="col-md-6 mb-3">
                                                <OptionalLabel>Label Percentage (%)</OptionalLabel>
                                                <Field
                                                    type="number"
                                                    name="labelPercentage"
                                                    className={`form-control ${touched.labelPercentage && errors.labelPercentage ? "is-invalid" : ""}`}
                                                    placeholder="0"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                />
                                                <ErrorMessage
                                                    name="labelPercentage"
                                                    component="div"
                                                    className="text-danger small mt-1"
                                                />
                                            </div>

                                            {/* PDF Upload */}
                                            <div className="col-md-6 mb-3">
                                                {!id ? (
                                                    <RequiredLabel>Upload Contract PDF</RequiredLabel>
                                                ) : (
                                                    <OptionalLabel>Upload Contract PDF</OptionalLabel>
                                                )}

                                                {/* Show current PDF when editing */}
                                                {id && existingPdf && (
                                                    <div className="mb-2 p-2 bg-light rounded d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <i className="fa-regular fa-file-pdf text-danger me-2"></i>
                                                            <span className="small">{existingPdf}</span>
                                                        </div>
                                                        <span className="badge bg-success">Current File</span>
                                                    </div>
                                                )}

                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        setFieldValue("pdf", file);
                                                        setFileName(file?.name || "");
                                                    }}
                                                />

                                                {/* Show new file name when selected */}
                                                {values.pdf && (
                                                    <div className="mt-2 p-2 bg-light rounded d-flex align-items-center">
                                                        <i className="fa-regular fa-file-pdf text-danger me-2"></i>
                                                        <span className="small">{values.pdf.name}</span>
                                                    </div>
                                                )}

                                                {id && (
                                                    <div className="form-text">
                                                        Leave empty to keep current file
                                                    </div>
                                                )}
                                            </div>

                                            {/* Submit Button */}
                                            <div className="col-md-12 text-end mt-3">
                                                <button
                                                    type="submit"
                                                    className="theme-btn green-cl white-cl"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" />
                                                            {id ? "Updating..." : "Uploading..."}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-regular fa-paper-plane me-2"></i>
                                                            {id ? "Update Contract" : "Upload Contract"}
                                                        </>
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
    );
}

export default ContractFormComponent;