import React, { useState } from "react";
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

function LabelUploadComponent() {
    const [file, setFile] = useState(null);

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
                    "/uploadLabelAsUser",
                    "POST",
                    formData,
                    true
                );

                if (result.success) {
                    toast.success("Excel uploaded successfully");
                    resetForm();
                    setFile(null);
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
                    <div className="mian-sec-heading">
                        <h6>Label Upload</h6>
                    </div>

                    <div className="converter-xml-fx">
                        <div className="converter-content">
                            <form className="convert-from" onSubmit={formik.handleSubmit}>
                                <p>Upload Label Master XLS</p>

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
                                        "https://report.whmcsdaddy.com/Rdc-backend/uploads/labelSample/Label_Sample.xlsx"
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

export default LabelUploadComponent;
