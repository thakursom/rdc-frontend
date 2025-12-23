import React, { useState, useEffect, useRef } from "react";
import YoutubeRdcRevenueChart from "../Chart/YoutubeRdcRevenueChart";
import YoutubeRevenueBarChart from "../Chart/YoutubeRevenueBarChart";
import YoutubeCountryRevenueChart from "../Chart/YoutubeCountryRevenueChart";
import CustomPagination from "../Pagination/CustomPagination";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import AsyncSelect from 'react-select/async';
import Loader from "../Loader/Loader";

function YoutubeRevenueReportsComponent() {
    const [filters, setFilters] = useState({
        platform: "",
        month: "",
        quarter: "",
        fromDate: "",
        toDate: "",
        releases: false,
        artist: false,
        track: false,
        partner: false,
        contentType: false,
        format: false,
        territory: false,
        quarters: false,
        page: 1,
        limit: 10,
    });

    const [data, setData] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDates, setShowDates] = useState(false);
    const [pageCount, setPageCount] = useState(1);
    const [totalRecords, setTotalRecords] = useState(10);

    // Separate state for checkbox filters that require button click
    const [checkboxFilters, setCheckboxFilters] = useState({
        releases: false,
        artist: false,
        track: false,
        partner: false,
        contentType: false,
        format: false,
        territory: false,
        quarters: false,
    });

    // Track initial render
    const initialRender = useRef(true);
    // Track if filters have been applied via button
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [downloadStatus, setDownloadStatus] = useState("");
    const [downloadHistory, setDownloadHistory] = useState([]);
    const [labelFilter, setLabelFilter] = useState("");
    const [showReportsTable, setShowReportsTable] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [role, setRole] = useState("");
    const [userId, setUserId] = useState(null);

    const DOWNLOAD_STATUS_KEY = "youtubeExcelDownloadStatus";

    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= currentYear - 10; i--) {
            years.push(i);
        }
        return years;
    };

    const years = generateYears();

    const loadOptions = async (inputValue) => {
        try {
            const res = await apiRequest(`/fetchAllSubLabel?search=${inputValue}`, "GET", null, true);

            if (res.success) {
                return res.data?.labels.map(item => ({
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

    // Check localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(DOWNLOAD_STATUS_KEY);
        if (saved === "downloaded") {
            setDownloadStatus("downloaded");
        } else if (saved === "preparing") {
            setDownloadStatus("preparing");
        }
        const user = JSON.parse(localStorage.getItem("user"));
        setRole(user?.role);
        setUserId(user?.userId)
    }, []);

    // Sync status to localStorage whenever it changes
    useEffect(() => {
        if (downloadStatus) {
            localStorage.setItem(DOWNLOAD_STATUS_KEY, downloadStatus);
        } else {
            localStorage.removeItem(DOWNLOAD_STATUS_KEY);
        }
    }, [downloadStatus]);

    const buildQueryString = (includeCheckboxFilters = false) => {
        const params = new URLSearchParams();

        // Always include these filters
        if (filters.platform) params.append("platform", filters.platform);
        if (filters.year) params.append("year", filters.year);
        if (filters.month) params.append("month", filters.month);
        if (filters.fromDate) params.append("fromDate", filters.fromDate);
        if (filters.toDate) params.append("toDate", filters.toDate);
        if (labelFilter) params.append("labelId", labelFilter);
        if (role) params.append("role", role);
        if (userId) params.append("userId", userId);

        // Include checkbox filters based on parameter
        if (includeCheckboxFilters) {
            if (checkboxFilters.releases) params.append("releases", "true");
            if (checkboxFilters.artist) params.append("artist", "true");
            if (checkboxFilters.track) params.append("track", "true");
            if (checkboxFilters.partner) params.append("partner", "true");
            if (checkboxFilters.contentType) params.append("contentType", "true");
            if (checkboxFilters.format) params.append("format", "true");
            if (checkboxFilters.territory) params.append("territory", "true");
            if (checkboxFilters.quarters) params.append("quarters", "true");
        }

        params.append("page", filters.page);
        params.append("limit", filters.limit);
        return params.toString();
    };

    const fetchSummarys = async (includeCheckboxFilters = false) => {
        setLoading(true);
        try {
            const query = buildQueryString(includeCheckboxFilters);
            const result = await apiRequest(`/youtube-revenue/summary?${query}`, "GET", null, true);

            if (result.success) {
                setData(result.data.data);
                // After summary is loaded, fetch reports
                await fetchReports(includeCheckboxFilters);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReports = async (includeCheckboxFilters = false) => {
        try {
            const query = buildQueryString(includeCheckboxFilters);
            const result = await apiRequest(`/youtube-revenue/reports?${query}`, "GET", null, true);

            if (result.success) {
                setReportData(result.data.data);
                if (result.data.data.pagination) {
                    setTotalRecords(result.data.data.pagination.totalRecords);
                    setPageCount(result.data.data.pagination.totalPages);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            if (initialRender.current) {
                initialRender.current = false;
                await fetchSummarys(false);
            } else {
                const hasActiveCheckboxFilters = Object.values(checkboxFilters).some(value => value);
                await fetchSummarys(hasActiveCheckboxFilters);
            }
        };

        fetchInitialData();
    }, [filters.platform, filters.year, filters.month, filters.fromDate, filters.toDate, filters.page, filters.limit, labelFilter])

    // Handle pagination click
    const handlePageChange = (selectedObj) => {
        setFilters(prev => ({
            ...prev,
            page: selectedObj.selected + 1
        }));
    };

    const handlePerPageChange = (value) => {
        setFilters(prev => ({
            ...prev,
            limit: parseInt(value),
            page: 1 // reset to first page
        }));
    };

    // Handle checkbox filter changes separately
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckboxFilters(prev => ({
            ...prev,
            [name]: checked
        }));
        // Reset to page 1 when checkbox changes
        setFilters(prev => ({ ...prev, page: 1 }));
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (["releases", "artist", "track", "territory"].includes(name)) {
            // These are now handled by handleCheckboxChange
            return;
        }

        setFilters(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            page: 1
        }));
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, page: 1 }));
        fetchSummarys(true); // This will automatically call fetchReports after
    };


    const handleExcelDownload = async (useCheckboxFilters = false) => {
        try {
            setLoading(true);

            // First, trigger YouTube report generation
            const query = buildQueryString(useCheckboxFilters);

            const triggerResponse = await apiRequest(
                `/trigger-youtube-excel?${query}`,
                "GET",
                null,
                true
            );

            if (triggerResponse.success) {
                toast.success(triggerResponse?.data?.message);

                // Fetch updated history to show preparing status
                await fetchHistory();

                // Auto-show the reports table if not already shown
                if (!showReportsTable) {
                    setShowReportsTable(true);
                }
            } else {
                toast.error("Failed to start YouTube report generation");
            }

        } catch (error) {
            console.error("Error triggering YouTube report:", error);
            toast.error("Error starting YouTube report generation");
        } finally {
            setLoading(false);
        }
    };

    const getLast12MonthsRange = () => {
        const now = new Date();
        const currentMonth = now.toLocaleString('default', { month: 'short' });
        const currentYear = now.getFullYear();

        const pastDate = new Date();
        pastDate.setMonth(pastDate.getMonth() - 11);

        const pastMonth = pastDate.toLocaleString('default', { month: 'short' });
        const pastYear = pastDate.getFullYear();

        return `${pastMonth} ${pastYear} - ${currentMonth} ${currentYear}`;
    };

    const fetchHistory = async () => {
        try {
            const result = await apiRequest('/youtube-report-history', "GET", null, true);
            console.log("result", result);

            if (result.success) {
                setDownloadHistory(result?.data?.data || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {

        fetchHistory();
    }, []);

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
        setDeletingId(null);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete?._id) return;

        setDeletingId(itemToDelete._id);

        try {
            const res = await apiRequest(
                `/delete-youtube-report?id=${itemToDelete._id}`,
                "DELETE",
                null,
                true
            );

            if (res.success) {
                itemToDelete.status == 'ready' ? toast.success("Report deleted successfully!") : toast.success("Report stoped successfully!");
                await fetchHistory();
                handleCloseDeleteModal();
            } else {
                toast.error(res.message || "Failed to delete report");
            }
        } catch (error) {
            console.error("Error deleting report:", error);
            toast.error("Error deleting report");
        } finally {
            setDeletingId(null);
        }
    };

    // Polling effect for report status
    useEffect(() => {
        let intervalId;

        if (showReportsTable && downloadHistory.length > 0) {
            // Check if any reports are still pending
            const hasPreparingReports = downloadHistory.some(
                item => item.status === "pending" || item.status === "generating"
            );

            if (hasPreparingReports) {
                // Poll every 5 seconds for status updates
                intervalId = setInterval(() => {
                    fetchHistory();
                }, 5000);
            }
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [showReportsTable, downloadHistory]);


    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>Youtube Revenue Reports</h6>
                        <div className="btn-right-sec">
                            {downloadHistory.length >= 1 && (
                                <button
                                    className="theme-btn green-cl white-cl me-1 position-relative"
                                    onClick={() => setShowReportsTable(!showReportsTable)}
                                >
                                    <i className={`fa-solid me-2 ${showReportsTable ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                    {showReportsTable ? 'Hide' : 'Show'} downloads ({downloadHistory.length})
                                </button>
                            )}
                            <button
                                className="theme-btn green-cl white-cl me-1 position-relative"
                                onClick={() => handleExcelDownload(filtersApplied)}
                                disabled={loading}
                            >
                                <i className="fa-solid fa-file-excel" /> Generate Excel Report
                            </button>
                        </div>
                    </div>

                    {downloadStatus === "preparing" && (
                        <div className="alert alert-warning alert-sm mt-2 py-2">
                            Data getting ready to export… Please wait
                        </div>
                    )}
                    {/* {downloadStatus === "downloaded" && (
                        <div className="alert alert-success alert-sm mt-2 py-2 d-flex justify-content-between align-items-center">
                            <span>File downloaded successfully!</span>
                            <button
                                type="button"
                                className="btn btn-link text-success p-0 border-0"
                                onClick={() => {
                                    setDownloadStatus("");
                                    localStorage.removeItem("youtubeExcelDownloadStatus");
                                }}
                                style={{ fontSize: "1.2rem", lineHeight: "1" }}
                            >
                                ×
                            </button>
                        </div>
                    )} */}

                    <div className="mt-4">
                        {showReportsTable && downloadHistory && downloadHistory.length > 0 && (
                            <div className="table-sec generate-report mt-3">
                                <table className="rdc-table rdc-shadow">
                                    <thead>
                                        <tr>
                                            <th>File Name</th>
                                            <th>Generated On</th>
                                            <th>Status</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {downloadHistory.map((item) => (
                                            <tr key={item._id} className={item.status === 'pending' ? 'table-warning' : item === downloadHistory[0] ? 'table-primary' : ''}>
                                                <td>
                                                    <i className="fa-solid fa-file-excel text-success me-2"></i>
                                                    <strong>
                                                        {item.status === 'pending' ? 'Generating...' : item.filename}
                                                    </strong>
                                                    {item === downloadHistory[0] && item.status !== 'pending' &&
                                                        <span className="badge bg-primary ms-2 small">Latest</span>
                                                    }
                                                </td>
                                                <td>
                                                    {new Date(item.generatedAt).toLocaleDateString('en-US', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td>
                                                    {["pending", "generating"].includes(item.status) && (
                                                        <span className="badge bg-warning text-dark">
                                                            <i className="fa-solid fa-spinner fa-spin me-1"></i>
                                                            Pending...
                                                        </span>
                                                    )}
                                                    {item.status === "ready" && (
                                                        <span className="badge bg-success">
                                                            <i className="fa-solid fa-check me-1"></i>
                                                            Ready
                                                        </span>
                                                    )}
                                                    {item.status === "failed" && (
                                                        <span className="badge bg-danger">
                                                            <i className="fa-solid fa-times me-1"></i>
                                                            Failed
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-center report-delete">
                                                    {item.status === "ready" && item.fileURL ? (
                                                        <>
                                                            <a
                                                                href={item.fileURL}
                                                                download={item.filename}
                                                                className="theme-btn green-cl white-cl small px-3 py-2"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <i className="fa-solid fa-download me-2"></i>
                                                                Download
                                                            </a>
                                                            <button
                                                                className="border-less border-red dark-red table-button me-2"
                                                                onClick={() => handleDeleteClick(item)}
                                                                disabled={deletingId === item._id}
                                                            >
                                                                {deletingId === item._id ? (
                                                                    <span><i className="fa-solid fa-spinner fa-spin"></i> Deleting...</span>
                                                                ) : (
                                                                    <>Delete <i className="fa-solid fa-trash" /></>
                                                                )}
                                                            </button>
                                                        </>
                                                    ) : item.status === "pending" ? (
                                                        <>
                                                            <button
                                                                className="border-less border-red dark-red table-button me-2 stop-button"
                                                                onClick={() => handleDeleteClick(item)}
                                                                disabled={deletingId === item._id}
                                                            >
                                                                {deletingId === item._id ? (
                                                                    <span><i className="fa-solid fa-spinner fa-spin"></i> Stoping...</span>
                                                                ) : (
                                                                    <>Stop <i className="fa-solid fa-trash" /></>
                                                                )}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="border-less border-red dark-red table-button me-2"
                                                                onClick={() => handleDeleteClick(item)}
                                                                disabled={deletingId === item._id}
                                                            >
                                                                {deletingId === item._id ? (
                                                                    <span><i className="fa-solid fa-spinner fa-spin"></i> Deleting...</span>
                                                                ) : (
                                                                    <>Delete <i className="fa-solid fa-trash" /></>
                                                                )}
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* === YOUR ORIGINAL FILTERS === */}
                    <div className="revnue-filters mt-3">
                        <form className="revenue-filter-fx" onSubmit={handleApplyFilters}>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                                    <div className="form-group" style={{ maxWidth: "400px" }}>
                                        <AsyncSelect
                                            cacheOptions
                                            loadOptions={loadOptions}
                                            defaultOptions
                                            placeholder="Search Sub Label"
                                            isClearable
                                            onChange={(selected) => {
                                                if (selected) {
                                                    setLabelFilter(selected.value);
                                                } else {
                                                    setLabelFilter("");
                                                }
                                                setFilters(prev => ({ ...prev, page: 1 }));
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                                    <div className="form-group">
                                        <div className="form-sec">
                                            <select className="form-select" name="platform" value={filters.platform} onChange={handleFilterChange}>
                                                <option value="">Select Platform</option>
                                                <option>Sound Recording (Audio Claim)</option>
                                                <option>Art Track (YouTube Music)</option>
                                                <option>YouTubePartnerChannel</option>
                                                <option>YouTubeRDCChannel</option>
                                                <option>YouTubeVideoClaim</option>
                                                <option>YTPremiumRevenue</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {/* Year Filter - Added here */}
                                {/* <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
                                    <div className="form-group">
                                        <div className="form-sec">
                                            <select className="form-select" name="year" value={filters.year} onChange={handleFilterChange}>
                                                <option value="">Select Year</option>
                                                {years.map(year => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
                                    <div className="form-group">
                                        <div className="form-sec">
                                            <select className="form-select" name="month" value={filters.month} onChange={handleFilterChange}>
                                                <option value="">Month</option>
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {new Date(0, i).toLocaleString("default", { month: "long" })}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div> */}

                                {/* <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
                                    <div className="form-group">
                                        <div className="form-sec">
                                            <select className="form-select" name="quarter" value={filters.quarter} onChange={handleFilterChange}>
                                                <option value="">Quarter</option>
                                                <option value="1">Q1 (Jan-Mar)</option>
                                                <option value="2">Q2 (Apr-Jun)</option>
                                                <option value="3">Q3 (Jul-Sep)</option>
                                                <option value="4">Q4 (Oct-Dec)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div> */}

                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3">
                                    <div className="form-group">
                                        <div className="form-sec">
                                            <select
                                                className="form-select"
                                                value={showDates ? "custom" : ""}
                                                onChange={(e) => {
                                                    if (e.target.value === "custom") {
                                                        setShowDates(true);
                                                    } else {
                                                        // When selecting "Date Range" (default)
                                                        setShowDates(false);
                                                        setFilters(prev => ({
                                                            ...prev,
                                                            fromDate: "",
                                                            toDate: ""
                                                        }));
                                                    }
                                                }}
                                            >
                                                <option value="">Date Range</option>
                                                <option value="custom">Custom</option>
                                            </select>

                                            {showDates && (
                                                <div className="mt-2 dateRange">
                                                    <div className="input-group-fx">
                                                        <label>From</label>
                                                        <input
                                                            type="month"
                                                            name="fromDate"
                                                            className="form-control mb-2"
                                                            value={filters.fromDate}
                                                            onChange={handleFilterChange}
                                                        />
                                                    </div>
                                                    <div className="input-group-fx">
                                                        <label>To</label>
                                                        <input
                                                            type="month"
                                                            name="toDate"
                                                            className="form-control"
                                                            value={filters.toDate}
                                                            onChange={handleFilterChange}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`rdc-checkbox ${showDates ? "pt-5" : ""}`}>
                                {["releases", "artist", "track", "territory"].map(key => (
                                    <div key={key} className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name={key}
                                            checked={checkboxFilters[key]}
                                            onChange={handleCheckboxChange}
                                            id={key}
                                        />
                                        <label className="form-check-label" htmlFor={key}>
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </label>
                                    </div>
                                ))}

                                <div className="form-check">
                                    <button
                                        type="submit"
                                        className="theme-btn green-cl white-cl"
                                        disabled={loading}
                                    >
                                        <i className="fa-solid fa-filter me-2" />
                                        {/* {loading && filtersApplied ? "Filtering..." : "Apply Filters"} */}
                                        Filter
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* === YOUR ORIGINAL SUMMARY CARDS === */}
                    {data && (
                        <div className="revenue-cards">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="dash-card navy-cl">
                                        <div className="dash-icon">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M23.4 0.348032C23.78 0.653057 24 1.1131 24 1.59814V16.7994C24 19.0096 21.85 20.7997 19.2 20.7997C16.55 20.7997 14.4 19.0096 14.4 16.7994C14.4 14.5892 16.55 12.7991 19.2 12.7991C19.76 12.7991 20.3 12.8791 20.8 13.0291V7.1936L9.6 9.68381V19.9997C9.6 22.2099 7.45 24 4.8 24C2.15 24 0 22.2099 0 19.9997C0 17.7895 2.15 15.9993 4.8 15.9993C5.36 15.9993 5.9 16.0793 6.4 16.2294V4.7984C6.4 4.04834 6.92 3.39829 7.655 3.23827L22.055 0.0380064C22.53 -0.0670023 23.025 0.048007 23.405 0.353032L23.4 0.348032Z" fill="#4D4E8E" />
                                            </svg>
                                        </div>
                                        <div className="dash-content">
                                            <p>Total Stream</p>
                                            <h6>{data.summary.totalStreams.toLocaleString()}</h6>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="dash-card parot-cl">
                                        <div className="dash-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#3ED08E" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                <line x1={12} x2={12} y1={2} y2={22} />
                                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                            </svg>
                                        </div>
                                        <div className="dash-content">
                                            <p>Total Revenue</p>
                                            <h6>${data.summary.totalRevenue.toFixed(2)}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === YOUR ORIGINAL CHARTS === */}
                    {data && (
                        <div className="revenue-charts">
                            <div className="row g-4">
                                <div className="col-md-12 stem-col">
                                    <div className="dash-charts stem-child">
                                        <div className="chart-content-head">
                                            <h5>Net Revenue By Month <p><i className="fa-solid fa-circle" /> By Channel</p><span>
                                                {getLast12MonthsRange()}
                                            </span></h5>
                                        </div>
                                        <div className="main-chartbox">
                                            <YoutubeRdcRevenueChart revenueByMonth={data?.revenueByMonth || {}} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 stem-col">
                                    <div className="dash-charts stem-child">
                                        <div className="chart-content-head">
                                            <h5>Revenue By Channel <p><i className="fa-solid fa-circle" /></p><span>
                                                {getLast12MonthsRange()}
                                            </span></h5>
                                        </div>
                                        <div className="main-chartbox">
                                            <YoutubeRevenueBarChart revenueByChannel={data?.revenueByChannel || {}} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 stem-col">
                                    <div className="dash-charts stem-child">
                                        <div className="chart-content-head">
                                            <h5>Revenue By Country <p><i className="fa-solid fa-circle" /></p><span>
                                                {getLast12MonthsRange()}
                                            </span></h5>
                                        </div>
                                        <div className="main-chartbox">
                                            <YoutubeCountryRevenueChart revenueByCountry={data?.revenueByCountry || {}} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* === YOUR ORIGINAL TABLE === */}
                    <div className="table-sec">
                        {loading ? (
                            <div className="text-center py-5"><Loader small={true} /></div>
                        ) : reportData?.reports?.length > 0 ? (
                            <>
                                <table className="rdc-table">
                                    <thead>
                                        <tr>
                                            <th className="main-th start">Date</th>
                                            <th>Platform</th>
                                            <th>Artist</th>
                                            <th>Release</th>
                                            {/* <th>Streams</th> */}
                                            <th className="last">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.reports.map((row, i) => (
                                            <tr key={i}>
                                                <td className="main-td">{row.date}</td>
                                                <td>{row.platform}</td>
                                                <td>{row.artist}</td>
                                                <td>{row.release}</td>
                                                {/* <td>{row.streams.toLocaleString()}</td> */}
                                                <td>${row.revenue.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </>
                        ) : (
                            <div className="text-center py-5 text-muted">No data found</div>
                        )}
                    </div>
                    {/* Pagination - Added here */}
                    <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end" }}>
                        <CustomPagination
                            pageCount={pageCount}
                            currentPage={filters.page}
                            onPageChange={handlePageChange}
                            perPage={filters.limit}
                            onPerPageChange={handlePerPageChange}
                            totalRecords={totalRecords}
                        />
                    </div>
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-backdrop show">
                    <div className="modal d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className={`modal-title ${itemToDelete?.status === 'ready' ? 'text-danger' : 'text-warning'}`}>
                                        <i className={`fa-solid ${itemToDelete?.status === 'ready' ? 'fa-trash-can' : 'fa-circle-stop'} me-2`}></i>
                                        {itemToDelete?.status === 'ready' ? 'Confirm Delete' : 'Confirm Stop'}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseDeleteModal}
                                        disabled={deletingId}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="delete-warning mb-3">
                                        <div className="alert alert-warning d-flex align-items-center" role="alert">
                                            <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                            <div>
                                                {itemToDelete?.status === 'ready'
                                                    ? 'Warning: This action will permanently delete the revenue upload!'
                                                    : 'Warning: This action will stop the report generation process!'}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mb-3">
                                        {itemToDelete?.status === 'ready'
                                            ? 'Are you sure you want to delete this generated report?'
                                            : 'Are you sure you want to stop this report generation?'}
                                    </p>

                                    <div className="delete-details bg-light p-3 rounded">
                                        <h6 className="mb-2">Report Details:</h6>
                                        <div className="row small">
                                            <div className="col-md-6">
                                                <p className="mb-1">
                                                    <strong>File Name:</strong> {itemToDelete?.filename
                                                        ? itemToDelete?.filename.length > 20
                                                            ? itemToDelete?.filename.slice(0, 20) + "..."
                                                            : itemToDelete?.filename
                                                        : "N/A"}
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="mb-1">
                                                    <strong>Generated On:</strong>
                                                    {new Date(itemToDelete?.generatedAt).toLocaleDateString('en-US', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="mb-1">
                                                    <strong>Status:</strong>
                                                    <span className={`badge ${itemToDelete?.status === 'ready' ? 'bg-success' : itemToDelete?.status === 'preparing' ? 'bg-warning' : 'bg-danger'}`}>
                                                        {itemToDelete?.status}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="theme-btn border-btn"
                                        onClick={handleCloseDeleteModal}
                                        disabled={deletingId}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="theme-btn bg-red white-cl"
                                        onClick={handleConfirmDelete}
                                        disabled={deletingId}
                                    >
                                        {deletingId ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                {itemToDelete?.status === 'ready' ? 'Deleting...' : 'Stopping...'}
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-trash-can me-2"></i>
                                                {itemToDelete?.status === 'ready' ? 'Delete Permanently' : 'Stop'}
                                            </>
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

export default YoutubeRevenueReportsComponent;