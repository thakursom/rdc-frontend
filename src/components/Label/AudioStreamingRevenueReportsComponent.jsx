import React, { useState, useEffect, useRef } from "react";
import AudioStreamingRdcRevenueChart from "../Chart/AudioStreamingRdcRevenueChart";
import AudioStreamingRevenueBarChart from "../Chart/AudioStreamingRevenueBarChart";
import AudioStreamingCountryRevenueChart from "../Chart/AudioStreamingCountryRevenueChart";
import CustomPagination from "../Pagination/CustomPagination";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import AsyncSelect from 'react-select/async';
import Loader from "../Loader/Loader";

function AudioStreamingRevenueReportsComponent() {
    const [filters, setFilters] = useState({
        platform: "",
        month: "",
        quarter: "",
        fromDate: "",
        toDate: "",
        releases: false,
        artist: false,
        format: false,
        territory: false,
        page: 1,
        limit: 10,
    });

    const [data, setData] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [showDates, setShowDates] = useState(false);
    const [pageCount, setPageCount] = useState(1);
    const [totalRecords, setTotalRecords] = useState(10);
    const initialRender = useRef(true);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [downloadHistory, setDownloadHistory] = useState([]);
    const [labelFilter, setLabelFilter] = useState("");
    const [showReportsTable, setShowReportsTable] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [initialData, setInitialData] = useState(null);

    const reports = reportData?.reports || [];

    let columns = [
        { key: "date", label: "Date" },
        { key: "platform", label: "Platform" },
        { key: "artist", label: "Artist" },
        { key: "release", label: "Release" },
        { key: "isrc_code", label: "ISRC" },
        { key: "territory", label: "Territory" },
        { key: "revenue", label: "Revenue", isNumber: true }
    ];

    columns = columns.filter(col => reports.some(r => r[col.key] !== undefined && r[col.key] !== null));


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


    const buildQueryString = (includeCheckboxFilters = false) => {
        const params = new URLSearchParams();

        if (filters.platform) params.append("platform", filters.platform);
        if (filters.year) params.append("year", filters.year);
        if (filters.month) params.append("month", filters.month);
        if (filters.fromDate) params.append("fromDate", filters.fromDate);
        if (filters.toDate) params.append("toDate", filters.toDate);
        if (labelFilter) params.append("labelId", labelFilter);

        if (includeCheckboxFilters && selectedFilter) {
            params.append(selectedFilter, "true");
        }

        params.append("page", filters.page);
        params.append("limit", filters.limit);
        return params.toString();
    };

    const fetchInitialSummary = async () => {
        try {
            const result = await apiRequest(`/revenue-summary`, "GET", null, true);

            if (result.success) {
                const transformedData = {
                    summary: {
                        totalStreams: result.data.data.total_stream || 0,
                        totalRevenue: result.data.data.total_revenue || 0
                    },
                    revenueByMonth: result.data.data.netRevenueByMonth || {},
                    revenueByChannel: result.data.data.revenueByChannel || {},
                    revenueByCountry: result.data.data.revenueByCountry || {}
                };
                setInitialData(transformedData);
                setData(transformedData); // Show it immediately
            }
        } catch (error) {
            console.error("Error fetching initial summary:", error);
        }
    }

    const fetchSummarys = async (includeCheckboxFilters = false) => {
        try {
            const hasFilters = filters.platform || filters.year || filters.month || filters.fromDate ||
                filters.toDate || labelFilter || (includeCheckboxFilters && selectedFilter);

            if (!hasFilters) {
                if (initialData) {
                    setData(initialData);
                } else {
                    setSummaryLoading(true);
                    await fetchInitialSummary();
                    setSummaryLoading(false);
                }
                setReportsLoading(true);
                await fetchReports(includeCheckboxFilters);
                setReportsLoading(false);
                return;
            }
            setSummaryLoading(true);
            setReportsLoading(true);

            const query = buildQueryString(includeCheckboxFilters);
            const result = await apiRequest(`/audio-streaming-revenue/summary?${query}`, "GET", null, true);

            if (result.success) {
                setData(result.data.data);
                await fetchReports(includeCheckboxFilters);
            }
            setSummaryLoading(false);
            setReportsLoading(false);

        } catch (error) {
            console.error(error);
            setSummaryLoading(false);
            setReportsLoading(false);
        }
    };

    const fetchReports = async (includeCheckboxFilters = false) => {
        try {
            const query = buildQueryString(includeCheckboxFilters);
            const result = await apiRequest(`/audio-streaming-revenue/reports?${query}`, "GET", null, true);

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

    // Fetch data on initial render and when regular filters change
    useEffect(() => {
        const fetchInitialData = async () => {
            if (initialRender.current) {
                initialRender.current = false;
                await fetchInitialSummary();   // ← New: Load unfiltered summary
                await fetchReports(false);     // ← Then load first page of reports
                setReportsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (!initialRender.current) {
            const fetchFilteredData = async () => {
                await fetchSummarys(selectedFilter);
            };
            fetchFilteredData();
        }
    }, [filters.platform, filters.year, filters.month, filters.fromDate, filters.toDate, filters.page, filters.limit, labelFilter]);

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
            page: 1
        }));
    };


    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        if (checked) {
            setSelectedFilter(name);
        } else {
            setSelectedFilter("");
        }

        setFilters(prev => ({ ...prev, page: 1 }));
    };

    const handleClearFilters = async () => {
        const clearedFilters = {
            platform: "",
            month: "",
            quarter: "",
            fromDate: "",
            toDate: "",
            releases: false,
            artist: false,
            format: false,
            territory: false,
            page: 1,
            limit: 10,
        };

        setFilters(clearedFilters);
        setSelectedFilter("");
        setLabelFilter("");
        setShowDates(false);
        setFiltersApplied(false);

        if (initialData) {
            setData(initialData);
        } else {
            setSummaryLoading(true);
            await fetchInitialSummary();
            setSummaryLoading(false);
        }

        setReportsLoading(true);
        await fetchReports(false);
        setReportsLoading(false);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1
        }));
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, page: 1 }));
        setFiltersApplied(true);
        fetchSummarys(true);
    };

    const handleExcelDownload = async (useCheckboxFilters = false) => {
        try {
            setReportsLoading(true);

            const query = buildQueryString(useCheckboxFilters);

            const triggerResponse = await apiRequest(
                `/trigger-audio-streaming-excel?${query}`,
                "GET",
                null,
                true
            );

            if (triggerResponse.success) {
                toast.success(triggerResponse?.data?.message);
                await fetchHistory();
                if (!showReportsTable) {
                    setShowReportsTable(true);
                }
            } else {
                toast.error("Failed to start report generation");
            }

        } catch (error) {
            console.error("Error triggering report:", error);
            toast.error("Error starting report generation");
        } finally {
            setReportsLoading(false);
        }
    };

    const getLast12MonthsRange = () => {
        const revenueByMonth = data?.revenueByMonth;

        if (!revenueByMonth || Object.keys(revenueByMonth).length === 0) return "";

        const dates = Object.keys(revenueByMonth)
            .map(key => {
                const [month, year] = key.split(" ");
                const date = new Date(`${month} 1, ${year}`);
                return isNaN(date) ? null : date;
            })
            .filter(Boolean)
            .sort((a, b) => a - b);

        if (!dates.length) return "";

        const startDate = dates[0];
        const endDate = dates[dates.length - 1];

        const format = (date) =>
            date.toLocaleString("default", {
                month: "short",
                year: "numeric",
            });

        return `${format(startDate)} - ${format(endDate)}`;
    };

    const fetchHistory = async () => {
        try {
            const result = await apiRequest('/report-history', "GET", null, true);

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
                `/delete-audio-report?id=${itemToDelete._id}`,
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

    useEffect(() => {
        let intervalId;

        if (showReportsTable && downloadHistory.length > 0) {
            const hasPreparingReports = downloadHistory.some(
                item => item.status === "pending" || item.status === "generating"
            );

            if (hasPreparingReports) {
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
                        <h6>Audio Streaming Revenue Reports</h6>
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
                                disabled={reportsLoading}
                            >
                                <i className="fa-solid fa-file-excel" /> Generate Excel Report
                            </button>
                        </div>
                    </div>


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
                                                                    <span><i className="fa-solid fa-spinner fa-spin"></i>Stoping...</span>
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
                                            placeholder="Search Label"
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
                                                <option value="Apple Music">Apple Music</option>
                                                <option value="Spotify">Spotify</option>
                                                <option value="Gaana">Gaana</option>
                                                <option value="jio_savan">Jio Saavn</option>
                                                <option value="Facebook">Facebook</option>
                                                <option value="Amazon">Amazon</option>
                                                <option value="TikTok">Tik Tok</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

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
                                            checked={selectedFilter === key} // Use single value comparison
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
                                        disabled={reportsLoading}
                                    >
                                        <i className="fa-solid fa-filter me-2" />
                                        Filter
                                    </button>

                                    {/* Optional: Add clear filter button */}
                                    <button
                                        type="button"
                                        className="theme-btn bg-red white-cl"
                                        onClick={handleClearFilters}
                                        disabled={reportsLoading}
                                    >
                                        {/* <i className="fa-solid fa-times me-2" /> */}
                                        Clear
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
                                        <div className="main-chartbox" style={{ position: "relative" }}>
                                            <AudioStreamingRdcRevenueChart revenueByMonth={data?.revenueByMonth || {}} />
                                            {summaryLoading && (
                                                <div style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "8px",
                                                    zIndex: 10
                                                }}>
                                                    <Loader small={true} />
                                                </div>
                                            )}
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
                                        <div className="main-chartbox" style={{ position: "relative" }}>
                                            <AudioStreamingRevenueBarChart revenueByChannel={data?.revenueByChannel || {}} />
                                            {summaryLoading && (
                                                <div style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "8px",
                                                    zIndex: 10
                                                }}>
                                                    <Loader small={true} />
                                                </div>
                                            )}
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
                                        <div className="main-chartbox" style={{ position: "relative" }}>
                                            <AudioStreamingCountryRevenueChart revenueByCountry={data?.revenueByCountry || {}} />
                                            {summaryLoading && (
                                                <div style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "8px",
                                                    zIndex: 10
                                                }}>
                                                    <Loader small={true} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === YOUR ORIGINAL TABLE === */}
                    <div className="table-sec">
                        {reportsLoading ? (
                            <div className="text-center py-5"><Loader small={true} /></div>
                        ) : reports.length > 0 ? (
                            <>
                                <table className="rdc-table">
                                    <thead>
                                        <tr>
                                            {columns.map(col => (
                                                <th key={col.key} className={col.key === "date" ? "main-th start" : ""}>
                                                    {col.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {reports.map((row, i) => (
                                            <tr key={i}>
                                                {columns.map(col => (
                                                    <td key={col.key}>
                                                        {col.isNumber
                                                            ? `$${Number(row[col.key] || 0).toFixed(2)}`
                                                            : row[col.key] || "-"}
                                                    </td>
                                                ))}
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

export default AudioStreamingRevenueReportsComponent;