import { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiRequest } from "../../../src/services/api";
import CustomPagination from "../Pagination/CustomPagination";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

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
    const [perPage, setPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(1);
    const [acceptingId, setAcceptingId] = useState(null);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [itemToAccept, setItemToAccept] = useState(null);

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

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
                    "/uploadRevenue",
                    "POST",
                    formData,
                    true
                );

                if (result.success) {
                    toast.success("Revenue uploaded successfully!");
                    formik.resetForm();
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }

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
                `/fetchAllRevenueUploads?page=${page}&limit=${perPage}`,
                "GET",
                null,
                true
            );

            if (response.success) {
                setRevenueList(response?.data?.data || []);
                setPageCount(response?.data?.pagination?.totalPages || response?.data?.totalPages || 1);
            } else {
                toast.error(response.message || "Failed to fetch revenue uploads");
                setRevenueList([]);
                setPageCount(1);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching uploads");
            setRevenueList([]);
            setPageCount(1);
        }
    };

    useEffect(() => {
        fetchRevenueUploads();
    }, [page, perPage]);

    const handleAcceptClick = (item) => {
        setItemToAccept(item);
        setShowAcceptModal(true);
    };

    const handleCloseAcceptModal = () => {
        setShowAcceptModal(false);
        setItemToAccept(null);
        setAcceptingId(null);
    };

    const handleConfirmAccept = async () => {
        if (!itemToAccept) return;

        setAcceptingId(itemToAccept._id);
        try {
            const result = await apiRequest(
                `/uploadTblRevenue?uploadId=${itemToAccept._id}`,
                "POST",
                null,
                true
            );
            if (result.success) {
                toast.success("Accepted Successfully");
                fetchRevenueUploads();
                handleCloseAcceptModal();
            } else {
                toast.error(result.message || "Accept failed!");
            }
        } catch (error) {
            console.log("Error:", error);
            toast.error("Error accepting upload");
        } finally {
            setAcceptingId(null);
        }
    };

    // Handle pagination click
    const handlePageChange = (selectedObj) => {
        setPage(selectedObj.selected + 1);
    };

    const handlePerPageChange = (value) => {
        setPerPage(value);
        setPage(1); // reset to first page
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
                                                        ref={fileInputRef}
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

                        {/* Show Loader when uploading */}
                        {loading && <Loader />}

                        {/* Revenue Uploads Table */}
                        <div className="table-sec mt-5">
                            <table className="rdc-table">
                                <thead>
                                    <tr>
                                        <th>Platform</th>
                                        <th>FileName</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Action</th>
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
                                                    {/* Show View button only if NOT accepted */}
                                                    {!item.isAccepted && (
                                                        <button
                                                            className="border-less border-purple color-purple table-button me-1"
                                                            onClick={() => navigate(`/superadmin/revenues/${item._id}`)}
                                                        >
                                                            View <i className="fa-solid fa-chevron-right" />
                                                        </button>
                                                    )}

                                                    {/* Show Accept button only if NOT accepted */}
                                                    {!item.isAccepted ? (
                                                        <button
                                                            className="border-less border-green color-green table-button me-1"
                                                            onClick={() => handleAcceptClick(item)}
                                                            disabled={acceptingId === item._id}
                                                        >
                                                            {acceptingId === item._id ? (
                                                                <>
                                                                    <i className="fa-solid fa-spinner fa-spin me-1" />
                                                                    Accepting...
                                                                </>
                                                            ) : (
                                                                "Accept"
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <span className="text-success">
                                                            <i className="fa-solid fa-check-circle me-1" />
                                                            Accepted
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center" }}>
                                                No Revenue Uploads Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end" }}>
                            <CustomPagination
                                pageCount={pageCount}
                                currentPage={page}
                                onPageChange={handlePageChange}
                                perPage={perPage}
                                onPerPageChange={handlePerPageChange}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Accept Confirmation Modal */}
            {showAcceptModal && (
                <div className="modal-backdrop show">
                    <div className="modal d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Acceptance</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseAcceptModal}
                                        disabled={acceptingId}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>
                                        Are you sure you want to accept the revenue upload for{" "}
                                        <strong>{itemToAccept?.platform}</strong>?
                                    </p>
                                    <div className="upload-details">
                                        <p className="text-muted small mb-1">
                                            <strong>File:</strong> {itemToAccept?.fileName}
                                        </p>
                                        <p className="text-muted small mb-1">
                                            <strong>Period:</strong> {itemToAccept?.periodFrom} to {itemToAccept?.periodTo}
                                        </p>
                                    </div>
                                    <p className="text-warning small mt-2">
                                        <i className="fa-solid fa-exclamation-triangle me-1" />
                                        This action cannot be undone.
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseAcceptModal}
                                        disabled={acceptingId}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn green-cl white-cl"
                                        onClick={handleConfirmAccept}
                                        disabled={acceptingId}
                                    >
                                        {acceptingId ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Accepting...
                                            </>
                                        ) : (
                                            "Accept"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default RevenueUploadComponent;