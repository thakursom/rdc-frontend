import React, { useState } from "react";
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

function ConversionComponent() {
    const [file, setFile] = useState(null);
    const [xmlPreview, setXmlPreview] = useState("");
    const [showDownloadBtn, setShowDownloadBtn] = useState(false);

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
                const response = await fetch(
                    import.meta.env.VITE_API_URL + "/convert-xlsx-xml",
                    {
                        method: "POST",
                        headers: {
                            authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: formData,
                    }
                );

                const result = await response.json();

                if (!result.success) {
                    toast.error("Conversion failed");
                    return;
                }

                setXmlPreview(result.xml);
                setShowDownloadBtn(true);

                toast.success("File Converted Successfully!");
                resetForm();
                setFile(null);

            } catch (err) {
                console.error(err);
                toast.error("Something went wrong");
            } finally {
                setSubmitting(false);
            }
        },
    });

    const onFileChange = (e) => {
        const uploaded = e.target.files[0];
        setFile(uploaded);
        formik.setFieldValue("file", uploaded);
        formik.setFieldTouched("file", true, false);
    };

    const downloadXml = () => {
        const blob = new Blob([xmlPreview], { type: "application/xml" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.xml";
        a.click();
    };

    const fileInvalid = formik.touched.file && Boolean(formik.errors.file);

    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>XSLS XML Conversion</h6>
                    </div>

                    <div className="converter-xml-fx">
                        <div className="converter-content">

                            {/* Upload Form */}
                            <form className="convert-from" onSubmit={formik.handleSubmit}>
                                <p>Upload XLS / XLSX</p>

                                <div className="form-group">
                                    <input
                                        className={`form-control ${fileInvalid ? "is-invalid" : ""}`}
                                        type="file"
                                        accept=".xls,.xlsx"
                                        onChange={onFileChange}
                                    />
                                    {fileInvalid && (
                                        <div className="invalid-feedback" style={{ display: "block" }}>
                                            {formik.errors.file}
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="theme-btn green-cl white-cl"
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? "Converting..." : "Convert"}
                                </button>
                            </form>

                            {/* XML Preview */}
                            {xmlPreview && (
                                <div style={{ marginTop: "25px" }}>
                                    <h6>Converted XML Preview</h6>

                                    <pre
                                        style={{
                                            background: "#f7f7f7",
                                            padding: "15px",
                                            borderRadius: "10px",
                                            maxHeight: "350px",
                                            overflow: "auto",
                                            whiteSpace: "pre-wrap"
                                        }}
                                    >
                                        {xmlPreview}
                                    </pre>

                                    {/* Show Download Button */}
                                    {showDownloadBtn && (
                                        <button
                                            onClick={downloadXml}
                                            className="theme-btn green-cl white-cl"
                                            style={{ marginTop: "10px" }}
                                        >
                                            Download XML
                                        </button>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ConversionComponent;
