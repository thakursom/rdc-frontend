import React, { useState, useEffect, useRef } from "react";
import YoutubeRdcRevenueChart from "../Chart/YoutubeRdcRevenueChart";
import YoutubeRevenueBarChart from "../Chart/YoutubeRevenueBarChart";
import YoutubeCountryRevenueChart from "../Chart/YoutubeCountryRevenueChart";
import { apiRequest } from "../../services/api";

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
    const [loading, setLoading] = useState(true);
    const [showDates, setShowDates] = useState(false);

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
    const DOWNLOAD_STATUS_KEY = "youtubeExcelDownloadStatus";

    // Check localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(DOWNLOAD_STATUS_KEY);
        if (saved === "downloaded") {
            setDownloadStatus("downloaded");
        } else if (saved === "preparing") {
            setDownloadStatus("preparing");
        }
    }, []);

    // Sync status to localStorage whenever it changes
    useEffect(() => {
        if (downloadStatus) {
            localStorage.setItem(DOWNLOAD_STATUS_KEY, downloadStatus);
        } else {
            localStorage.removeItem(DOWNLOAD_STATUS_KEY);
        }
    }, [downloadStatus]);

    const buildQueryString = (useCheckboxFilters = false) => {
        const params = new URLSearchParams();

        // Always include these filters
        if (filters.platform) params.append("platform", filters.platform);
        if (filters.month) params.append("month", filters.month);
        if (filters.quarter) params.append("quarter", filters.quarter);
        if (filters.fromDate) params.append("fromDate", filters.fromDate);
        if (filters.toDate) params.append("toDate", filters.toDate);

        // Only include checkbox filters when filter button is clicked
        if (useCheckboxFilters) {
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

    const fetchReports = async (useCheckboxFilters = false) => {
        setLoading(true);
        try {
            const query = buildQueryString(useCheckboxFilters);
            const result = await apiRequest(`/youtubeRevenueReport?${query}`, "GET", null, true);
            console.log("result", result);

            if (result.success) {
                setData(result.data.data);
                if (useCheckboxFilters) {
                    setFiltersApplied(true);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Skip initial render if it's not the first time and checkbox filters haven't been applied
        if (initialRender.current) {
            initialRender.current = false;
            fetchReports(false);
        } else if (!filtersApplied) {
            // Only fetch automatically if checkbox filters haven't been applied yet
            fetchReports(false);
        }
    }, [filters.platform, filters.month, filters.quarter, filters.fromDate, filters.toDate, filters.page]);

    // Handle checkbox filter changes separately
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckboxFilters(prev => ({
            ...prev,
            [name]: checked
        }));
        // Reset filters applied flag when checkboxes change
        setFiltersApplied(false);
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (["releases", "artist", "track", "partner", "contentType", "format", "territory", "quarters"].includes(name)) {
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
        // Merge checkbox filters into main filters for the API call
        fetchReports(true);
    };


    const handleExcelDownload = async (useCheckboxFilters = false) => {

        let platformName = "All_Platforms";
        if (filters.platform && filters.platform.trim() !== "") {
            const platforms = filters.platform.split(",").map(p => p.trim());
            if (platforms.length === 1) {
                platformName = platforms[0].replace(/[^a-zA-Z0-9]/g, "_");
            } else if (platforms.length > 1) {
                platformName = `${platforms.length}_Platforms`;
            }
        }

        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `${platformName}_Revenue_Report_${today}.xlsx`;

        try {
            // Set status to preparing
            setDownloadStatus("preparing");
            localStorage.setItem(DOWNLOAD_STATUS_KEY, "preparing");

            setLoading(true);

            const query = buildQueryString(useCheckboxFilters);
            console.log("query", query);
            const response = await apiRequest(
                `/revenueReports/export/youtubeExcel?${query}`,
                "GET",
                null,
                true,
                { responseType: 'blob' }
            );

            if (!response || response.size === 0) {
                alert("No data found to export.");
                setDownloadStatus("");
                localStorage.removeItem(DOWNLOAD_STATUS_KEY);
                return;
            }

            const blob = new Blob([response], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            // Success: Update status
            setDownloadStatus("downloaded");
            localStorage.setItem(DOWNLOAD_STATUS_KEY, "downloaded");

        } catch (error) {
            console.error("Excel download error:", error);
            alert("Failed to download Excel file.");
            setDownloadStatus("");
            localStorage.removeItem(DOWNLOAD_STATUS_KEY);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>Youtube Revenue Reports</h6>
                        <div className="btn-right-sec">
                            <button
                                className="theme-btn green-cl white-cl me-1 position-relative"
                                onClick={handleExcelDownload}
                                disabled={loading || downloadStatus === "preparing"}
                            >
                                <i className="fa-solid fa-file-excel" /> Excel
                            </button>
                        </div>
                    </div>

                    {downloadStatus === "preparing" && (
                        <div className="alert alert-warning alert-sm mt-2 py-2">
                            Data getting ready to export… Please wait
                        </div>
                    )}
                    {downloadStatus === "downloaded" && (
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
                    )}

                    {/* === YOUR ORIGINAL FILTERS === */}
                    <div className="revnue-filters">
                        <form className="revenue-filter-fx" onSubmit={handleApplyFilters}>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
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

                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
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
                                </div>

                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
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
                                </div>

                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
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
                                                            type="date"
                                                            name="fromDate"
                                                            className="form-control mb-2"
                                                            value={filters.fromDate}
                                                            onChange={handleFilterChange}
                                                        />
                                                    </div>
                                                    <div className="input-group-fx">
                                                        <label>To</label>
                                                        <input
                                                            type="date"
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
                                {["releases", "artist", "track", "partner", "contentType", "format", "territory", "quarters"].map(key => (
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
                                                {(() => {
                                                    const now = new Date();
                                                    const currentMonth = now.toLocaleString('default', { month: 'short' });
                                                    const currentYear = now.getFullYear();

                                                    // Go back 11 months from now
                                                    const pastDate = new Date();
                                                    pastDate.setMonth(pastDate.getMonth() - 11);

                                                    const pastMonth = pastDate.toLocaleString('default', { month: 'short' });
                                                    const pastYear = pastDate.getFullYear();

                                                    return `${pastMonth} ${pastYear} - ${currentMonth} ${currentYear}`;
                                                })()}
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
                                                {(() => {
                                                    const now = new Date();
                                                    const currentMonth = now.toLocaleString('default', { month: 'short' });
                                                    const currentYear = now.getFullYear();

                                                    // Go back 11 months from now
                                                    const pastDate = new Date();
                                                    pastDate.setMonth(pastDate.getMonth() - 11);

                                                    const pastMonth = pastDate.toLocaleString('default', { month: 'short' });
                                                    const pastYear = pastDate.getFullYear();

                                                    return `${pastMonth} ${pastYear} - ${currentMonth} ${currentYear}`;
                                                })()}
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
                                                {(() => {
                                                    const now = new Date();
                                                    const currentMonth = now.toLocaleString('default', { month: 'short' });
                                                    const currentYear = now.getFullYear();

                                                    // Go back 11 months from now
                                                    const pastDate = new Date();
                                                    pastDate.setMonth(pastDate.getMonth() - 11);

                                                    const pastMonth = pastDate.toLocaleString('default', { month: 'short' });
                                                    const pastYear = pastDate.getFullYear();

                                                    return `${pastMonth} ${pastYear} - ${currentMonth} ${currentYear}`;
                                                })()}
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
                            <div className="text-center py-5">Loading...</div>
                        ) : data?.reports?.length > 0 ? (
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
                                        {data.reports.map((row, i) => (
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

                                {/* Pagination - Your Style */}
                                {/* <div className="d-flex justify-content-end mt-3">
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => handlePageChange(filters.page - 1)}
                                        disabled={filters.page === 1 || loading}
                                    >
                                        Previous
                                    </button>
                                    <span className="align-self-center mx-3">
                                        Page {filters.page} of {data.pagination.totalPages || 1}
                                    </span>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handlePageChange(filters.page + 1)}
                                        disabled={filters.page === data.pagination.totalPages || loading}
                                    >
                                        Next
                                    </button>
                                </div> */}
                            </>
                        ) : (
                            <div className="text-center py-5 text-muted">No data found</div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default YoutubeRevenueReportsComponent;