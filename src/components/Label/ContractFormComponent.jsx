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
        description: "",
        startDate: "",
        endDate: "",
        labelPercentage: "",
        pdf: null,
    });
    const [existingPdf, setExistingPdf] = useState("");

    const navigate = useNavigate();
    const { id } = useParams();

    const validationSchema = Yup.object({
        label: Yup.string().required("Label is required"),
        contractName: Yup.string()
            .required("Contract Name is required")
            .min(3, "Contract Name must be at least 3 characters"),
        startDate: Yup.date().required("Start Date is required"),
        endDate: Yup.date().required("End Date is required"),
        labelPercentage: Yup.number()
            .typeError("Label Percentage must be a number")
            .min(0, "Cannot be negative")
            .max(100, "Cannot exceed 100%"),
        description: Yup.string().max(500, "Max 500 characters allowed"),
    });

    useEffect(() => {
        if (id) {
            const fetchContract = async () => {
                try {
                    const res = await apiRequest(`/getContractById?id=${id}`, "GET", null, true);
                    if (res.success) {
                        const detail = res.data?.data;

                        setInitialValues({
                            label: detail.user_id || "",
                            contractName: detail.contractName || "",
                            description: detail.description || "",
                            startDate: detail.startDate
                                ? new Date(detail.startDate).toISOString().split("T")[0]
                                : "",
                            endDate: detail.endDate
                                ? new Date(detail.endDate).toISOString().split("T")[0]
                                : "",
                            labelPercentage: detail.labelPercentage || "",
                            pdf: null,
                        });

                        setExistingPdf(detail.pdf || "");

                        if (detail.user_id && detail.userName) {
                            setSelectedLabel(detail.user_id);
                            setSelectedLabelName(detail.userName);
                        }

                        setFileName(detail.pdf || "");
                    }
                } catch (error) {
                    console.error("Fetch Contract Error:", error);
                }
            };
            fetchContract();
        }
    }, [id]);

    const loadOptions = async (inputValue) => {
        try {
            const res = await apiRequest(`/fetchAllSubLabel?search=${inputValue}`, "GET", null, true);
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

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            if (!id && !values.pdf) {
                toast.error("PDF file is required for new contracts");
                return;
            }

            const payload = new FormData();
            payload.append("label", selectedLabel || values.label);
            payload.append("contractName", values.contractName);
            payload.append("description", values.description);
            payload.append("startDate", values.startDate);
            payload.append("endDate", values.endDate);
            payload.append("labelPercentage", values.labelPercentage);

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
                navigate("/label/label-summary");
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

    return (
        <>
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

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {({ setFieldValue, values, isSubmitting, errors, touched }) => (
                                    <Form>
                                        <div className="row g-4">
                                            {/* Label Selection */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Select Label <span className="text-danger">*</span>
                                                </label>
                                                <AsyncSelect
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={loadOptions}
                                                    placeholder="Search and select label"
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
                                                    styles={{
                                                        control: (base) => ({
                                                            ...base,
                                                            borderColor: touched.label && errors.label ? '#dc3545' : base.borderColor,
                                                        }),
                                                    }}
                                                />
                                                <ErrorMessage name="label" component="div" className="text-danger small mt-1" />
                                            </div>

                                            {/* Contract Name */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Contract Name <span className="text-danger">*</span>
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="contractName"
                                                    className={`form-control ${touched.contractName && errors.contractName ? "is-invalid" : ""}`}
                                                    placeholder="Enter contract name"
                                                />
                                                <ErrorMessage name="contractName" component="div" className="text-danger small mt-1" />
                                            </div>

                                            {/* Description */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Description</label>
                                                <Field
                                                    as="textarea"
                                                    name="description"
                                                    rows="4"
                                                    className={`form-control ${touched.description && errors.description ? "is-invalid" : ""}`}
                                                    placeholder="Enter contract description (optional)"
                                                />
                                                <ErrorMessage name="description" component="div" className="text-danger small mt-1" />
                                            </div>

                                            {/* Start Date */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Start Date <span className="text-danger">*</span>
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="startDate"
                                                    className={`form-control ${touched.startDate && errors.startDate ? "is-invalid" : ""}`}
                                                />
                                                <ErrorMessage name="startDate" component="div" className="text-danger small mt-1" />
                                            </div>

                                            {/* End Date */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    End Date <span className="text-danger">*</span>
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="endDate"
                                                    className={`form-control ${touched.endDate && errors.endDate ? "is-invalid" : ""}`}
                                                />
                                                <ErrorMessage name="endDate" component="div" className="text-danger small mt-1" />
                                            </div>

                                            {/* Label Percentage */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Label Percentage (%)</label>
                                                <Field
                                                    type="number"
                                                    name="labelPercentage"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    placeholder="e.g. 30"
                                                    className={`form-control ${touched.labelPercentage && errors.labelPercentage ? "is-invalid" : ""}`}
                                                />
                                                <ErrorMessage name="labelPercentage" component="div" className="text-danger small mt-1" />
                                            </div>

                                            {/* PDF Upload */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Upload Contract PDF {!id && <span className="text-danger">*</span>}
                                                </label>

                                                {/* Show existing PDF in edit mode */}
                                                {id && existingPdf && (
                                                    <div className="alert alert-info small py-2 px-3 mb-3 d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <i className="fa-regular fa-file-pdf text-danger me-2"></i>
                                                            <strong>Current:</strong> {existingPdf.split("/").pop()}
                                                        </div>
                                                        <span className="badge bg-success">Active</span>
                                                    </div>
                                                )}

                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setFieldValue("pdf", file);
                                                            setFileName(file.name);
                                                        }
                                                    }}
                                                />

                                                {/* Show newly selected file */}
                                                {values.pdf && (
                                                    <div className="alert alert-success small py-2 px-3 mt-3">
                                                        <i className="fa-regular fa-file-pdf text-danger me-2"></i>
                                                        <strong>New file selected:</strong> {values.pdf.name}
                                                    </div>
                                                )}

                                                {id && (
                                                    <div className="form-text mt-2">
                                                        Leave empty to keep the current PDF
                                                    </div>
                                                )}
                                            </div>
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
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ContractFormComponent;