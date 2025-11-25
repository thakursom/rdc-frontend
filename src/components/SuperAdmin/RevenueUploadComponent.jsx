import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiRequest } from "../../../src/services/api";
import CustomPagination from "../Pagination/CustomPagination";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

// Validation schema - Updated for Excel files
const validationSchema = Yup.object({
    platform: Yup.string().required("Platform is required"),
    periodFrom: Yup.string()
        .required("Start Date required")
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    periodTo: Yup.string()
        .required("End Date required")
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    file: Yup.mixed()
        .required("Please upload a file")
        .test("fileType", "Only Excel files allowed", (value) =>
            value && (
                value.name?.toLowerCase().endsWith(".xls") ||
                value.name?.toLowerCase().endsWith(".xlsx") ||
                value.name?.toLowerCase().endsWith(".csv")
            )
        ),
});

function RevenueUploadComponent() {
    const [loading, setLoading] = useState(false);
    const [revenueList, setRevenueList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const formik = useFormik({
        initialValues: {
            platform: "",
            periodFrom: "",
            periodTo: "",
            file: null,
        },

        validationSchema,

        onSubmit: async (values) => {
            setLoading(true);

            const formData = new FormData();
            formData.append("file", values.file);
            formData.append("platform", values.platform);
            formData.append("periodFrom", values.periodFrom);
            formData.append("periodTo", values.periodTo);

            try {
                const result = await apiRequest(
                    "/upload-revenue",
                    "POST",
                    formData,
                    true,
                    true
                );

                if (result.success) {
                    toast.success("Revenue uploaded successfully!");
                    formik.resetForm();
                    // Refresh the list after successful upload
                    fetchRevenueUploads();
                } else {
                    toast.error(result.message || "Upload failed!");
                }
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("An error occurred during upload!");
            } finally {
                setLoading(false);
            }
        },
    });

    const fetchRevenueUploads = async () => {
        try {
            const response = await apiRequest(
                `/fetchAllRevenueUploads?page=${page}`,
                "GET",
                null,
                true
            );

            if (response.success) {
                setRevenueList(response?.data?.data || []);
                setTotalPages(response?.data?.pagination?.totalPages || response?.data?.totalPages || 1);
            } else {
                toast.error(response.message || "Failed to fetch revenue uploads");
                setRevenueList([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching uploads");
            setRevenueList([]);
            setTotalPages(1);
        }
    };

    useEffect(() => {
        fetchRevenueUploads();
    }, [page]);


    const handleDownload = (filePath, fileName) => {
        const link = document.createElement("a");
        link.href = filePath;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };


    // Handle pagination click
    const handlePageChange = (selectedObj) => {
        setPage(selectedObj.selected + 1);
    };

    const handleProcessUploadClick = () => {
        formik.validateForm().then(errors => {
            if (Object.keys(errors).length === 0) {
                formik.handleSubmit();
            } else {
                formik.setTouched({
                    platform: true,
                    periodFrom: true,
                    periodTo: true,
                    file: true,
                });
                toast.error("Please fill all the required fields before proceeding!");
            }
        });
    };

    const handleValidateOnly = () => {
        formik.validateForm().then(errors => {
            formik.setTouched({
                platform: true,
                periodFrom: true,
                periodTo: true,
                file: true,
            });

            if (Object.keys(errors).length === 0) {
                toast.success("All fields are valid!");
            } else {
                toast.error("Please fix validation errors!");
            }
        });
    };

    // Handle file drop functionality
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const uploaded = files[0];
            formik.setFieldValue("file", uploaded);
            formik.setFieldTouched("file", true, false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <>
            {/* Show Loader when uploading */}
            {loading && <Loader />}

            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>Revenue Upload</h6>
                    </div>

                    <div className="dashTabs mainDashboarTabs">
                        <div className="row">
                            <div className="col-md-12 stem-col">
                                <div className="dash-charts stem-child">
                                    <div className="chart-content-head">
                                        <h5>Upload Royalty/Usage Report</h5>
                                    </div>

                                    {/* FORM START */}
                                    <form className="revenue-upload">
                                        <div className="row g-3">

                                            {/* Platform */}
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label className="form-label">Platform</label>
                                                    <select
                                                        className={`form-select ${formik.touched.platform && formik.errors.platform ? 'is-invalid' : ''}`}
                                                        name="platform"
                                                        value={formik.values.platform}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    >
                                                        <option value="">Select Platform</option>
                                                        <option value="AppleItunes">Apple Itunes</option>
                                                        <option value="Spotify">Spotify</option>
                                                        <option value="Gaana">Gaana</option>
                                                        <option value="JioSaavan">Jio Saavan</option>
                                                        <option value="Facebook">Facebook</option>
                                                        <option value="Amazon">Amazon</option>
                                                        <option value="TikTok">Tik Tok</option>
                                                    </select>

                                                    {formik.touched.platform && formik.errors.platform && (
                                                        <div className="text-danger small">
                                                            {formik.errors.platform}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Period From */}
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label className="form-label">Period From</label>
                                                    <input
                                                        className={`form-control ${formik.touched.periodFrom && formik.errors.periodFrom ? 'is-invalid' : ''}`}
                                                        type="date"
                                                        name="periodFrom"
                                                        value={formik.values.periodFrom}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />

                                                    {formik.touched.periodFrom && formik.errors.periodFrom && (
                                                        <div className="text-danger small">
                                                            {formik.errors.periodFrom}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Period To */}
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label className="form-label">Period To</label>
                                                    <input
                                                        className={`form-control ${formik.touched.periodTo && formik.errors.periodTo ? 'is-invalid' : ''}`}
                                                        type="date"
                                                        name="periodTo"
                                                        value={formik.values.periodTo}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />

                                                    {formik.touched.periodTo && formik.errors.periodTo && (
                                                        <div className="text-danger small">
                                                            {formik.errors.periodTo}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </form>

                                    {/* FILE UPLOAD */}
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <div
                                                className="drag-drop-csv"
                                                onDrop={handleDrop}
                                                onDragOver={handleDragOver}
                                                style={{
                                                    border: formik.touched.file && formik.errors.file ? '2px dashed #dc3545' : '2px dashed #ddd',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <div className="csv-icon">
                                                    <i className="fa-solid fa-cloud-arrow-up" />
                                                </div>

                                                <p>Drag & drop Excel file here</p>
                                                <span>or</span>

                                                <div className="form-group">
                                                    <input
                                                        className={`form-control ${formik.touched.file && formik.errors.file ? 'is-invalid' : ''}`}
                                                        type="file"
                                                        name="file"
                                                        accept=".xls,.xlsx,.csv"
                                                        onChange={(e) => {
                                                            const uploaded = e.target.files[0];
                                                            formik.setFieldValue("file", uploaded);
                                                            formik.setFieldTouched("file", true, false);

                                                            // Show file name feedback
                                                            if (uploaded) {
                                                                toast.info(`Selected file: ${uploaded.name}`);
                                                            }
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    />

                                                    {formik.touched.file && formik.errors.file && (
                                                        <div className="text-danger small">
                                                            {formik.errors.file}
                                                        </div>
                                                    )}

                                                    {/* Show selected file name */}
                                                    {formik.values.file && (
                                                        <div className="text-success small mt-2">
                                                            <i className="fa-solid fa-check me-1" />
                                                            Selected: {formik.values.file.name}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="csv-btn">
                                                    <button type="button" className="border-less">Need a template?</button>
                                                    <button type="button" className="border-less border-green color-green table-button">
                                                        Download Template
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Proceed Section */}
                                        <div className="outer-content">
                                            <p>Secure action requires a transaction PIN.</p>

                                            <div className="outer-btn">
                                                <button
                                                    type="button"
                                                    className="theme-btn purple-cl white-cl"
                                                    onClick={handleValidateOnly}
                                                    disabled={loading}
                                                >
                                                    <i className="fa-solid fa-circle-check me-1" />
                                                    Validate Only
                                                </button>

                                                <button
                                                    type="button"
                                                    className="theme-btn green-cl white-cl"
                                                    onClick={handleProcessUploadClick}
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <i className="fa-solid fa-spinner fa-spin me-1" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-upload me-1" />
                                                            Process Upload
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Revenue Uploads Table */}
                        <div className="table-sec mt-5">
                            <table className="rdc-table">
                                <thead>
                                    <tr>
                                        <th>Platform</th>
                                        <th>FileName</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Download</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {revenueList.length > 0 ? (
                                        revenueList.map((item, i) => (
                                            <tr key={i}>
                                                <td>{item.platform}</td>
                                                <td>{item.fileName}</td>
                                                <td>{item.periodFrom}</td>
                                                <td>{item.periodTo}</td>
                                                <td>
                                                    <button
                                                        className="border-less border-purple color-purple table-button me-1"
                                                        onClick={() => handleDownload(item.filePath, item.fileName)}
                                                    >
                                                        Download <i className="fa-solid fa-download" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: "center" }}>
                                                No Revenue Uploads Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end" }}>
                                <CustomPagination
                                    pageCount={totalPages}
                                    onPageChange={handlePageChange}
                                    currentPage={page}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default RevenueUploadComponent;