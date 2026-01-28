import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    file: Yup.mixed()
        .required("Please upload a file")
        .test(
            "fileType",
            "Only .xls or .xlsx files are allowed",
            (value) =>
                value &&
                (value.name?.toLowerCase().endsWith(".xls") ||
                    value.name?.toLowerCase().endsWith(".xlsx"))
        ),
});

function AddBulkPayoutComponent() {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { file: null },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            if (!file) {
                toast.error("Please upload a file");
                return;
            }

            const formData = new FormData();
            formData.append("file", file);

            try {
                const result = await apiRequest(
                    "/uploadBulkPayout",
                    "POST",
                    formData,
                    true
                );

                if (result.success) {
                    toast.success("Excel uploaded successfully");
                    resetForm();
                    setFile(null);
                    navigate("/superadmin/payouts");
                } else {
                    toast.error(result.message || "Upload failed");
                }
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong");
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleFileChange = (e) => {
        const uploaded = e.target.files[0];
        setFile(uploaded);
        formik.setFieldValue("file", uploaded);
        formik.setFieldTouched("file", true, false);
    };

    const fileInvalid = formik.touched.file && Boolean(formik.errors.file);

    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading  d-flex justify-content-between align-items-center mian-sec-heading">
                        <h6>Add Bulk Payouts</h6>
                        <button className="theme-btn green-cl white-cl" onClick={() => window.history.back()}>
                            <i className="fa-solid fa-arrow-left me-1" /> Back
                        </button>
                    </div>

                    <div className="converter-xml-fx">
                        <div className="converter-content">
                            <form className="convert-from" onSubmit={formik.handleSubmit}>
                                <p>Upload Payouts</p>

                                <div className="form-group">
                                    <input
                                        className={`form-control choose-file-fx ${fileInvalid ? "is-invalid" : ""}`}
                                        type="file"
                                        accept=".xls,.xlsx"
                                        onChange={handleFileChange}
                                    />
                                    {fileInvalid && (
                                        <div className="invalid-feedback" style={{ display: "block" }}>
                                            {formik.errors.file}
                                        </div>
                                    )}
                                </div>

                                {/* Upload Button */}
                                <button
                                    type="submit"
                                    className="theme-btn green-cl white-cl"
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? "Uploading..." : "Upload"}
                                </button>

                                {/* Download Sample Button */}
                                <button
                                    type="button"
                                    className="theme-btn bg-yellow white-cl"
                                    onClick={() =>
                                        window.location.href =
                                        "https://report.whmcsdaddy.com/Rdc-backend/uploads/payoutSample/Payout_Sample.xlsx"
                                    }
                                >
                                    Download Sample
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AddBulkPayoutComponent;
