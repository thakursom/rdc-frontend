import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function ArtistDetailComponent() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [records, setRecords] = useState([]);
    const [topReleases, setTopReleases] = useState(null);
    const [topDSP, setTopDSP] = useState(null);
    const [topCountry, setTopCountry] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [applyFilter, setApplyFilter] = useState(false);
    const [loading, setLoading] = useState(false);


    const fetchArtistReport = async () => {
        setLoading(true);
        const result = await apiRequest(
            `/fetchArtistByName?artistName=${state?.artistName}&page=${page}&limit=${perPage}&search=${search}&fromDate=${fromDate}&toDate=${toDate}`,
            "GET",
            null,
            true
        );

        if (result.success) {
            const api = result.data;

            setRecords(api?.data || []);
            setTopReleases(api?.topRelease || null);
            setTopDSP(api?.topDSP || null);
            setTopCountry(api?.topCountry || null);
            setPageCount(api?.pagination?.totalPages || 1);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchArtistReport();
    }, [page, perPage, search, applyFilter]);



    const handlePageChange = (selectedObj) => {
        setPage(selectedObj.selected + 1);
    };

    const handlePerPageChange = (value) => {
        setPerPage(value);
        setPage(1);
    };

    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading artistHeading">
                        <h6>Artist Detail</h6>
                        <button
                            className="theme-btn green-cl white-cl"
                            onClick={() => navigate(-1)}
                        >
                            <i className="fa-solid fa-arrow-left me-1" /> Back
                        </button>
                    </div>
                    <div className="heading-content">
                        <div className="inner-content">
                            <p>{state?.artistName || "N/A"}</p>
                            {/* <span>Country: {state?.countries?.join(", ") || "N/A"}</span> */}
                        </div>

                    </div>

                    {/* --- DASH CARDS SECTION --- */}
                    <div className="artist-details">
                        <div className="row g-4">

                            {/* Total Streams */}
                            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                <div className="navy-cl stem-child">
                                    <div className="dash-card ">
                                        <div className="dash-icon">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M16 7H22V13"
                                                    stroke="#4D4E8E"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M22 7L13.5 15.5L8.5 10.5L2 17"
                                                    stroke="#4D4E8E"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                        <div className="dash-content">
                                            <p>Total Streams</p>
                                            <h6>{state?.totalStream || "N/A"}</h6>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Top Releases */}
                            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                <div className="parot-cl stem-child">
                                    <div className="dash-card ">
                                        <div className="dash-icon">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                <path d="M16 6L20 20" stroke="#3ED08E" strokeWidth={2} />
                                                <path d="M12 6V20" stroke="#3ED08E" strokeWidth={2} />
                                                <path d="M8 8V20" stroke="#3ED08E" strokeWidth={2} />
                                                <path d="M4 4V20" stroke="#3ED08E" strokeWidth={2} />
                                            </svg>
                                        </div>
                                        <div className="dash-content">
                                            <p>Top Releases</p>
                                            <h6>{topReleases?._id || "N/A"}</h6>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Top DSP */}
                            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                <div className="yellow-dark stem-child">
                                    <div className="dash-card ">
                                        <div className="dash-icon">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M23.4 0.348032C23.78 0.653057 24 1.1131 24 1.59814V16.7994C24 19.0096 21.85 20.7997 19.2 20.7997C16.55 20.7997 14.4 19.0096 14.4 16.7994C14.4 14.5892 16.55 12.7991 19.2 12.7991C19.76 12.7991 20.3 12.8791 20.8 13.0291V7.1936L9.6 9.68381V19.9997C9.6 22.2099 7.45 24 4.8 24C2.15 24 0 22.2099 0 19.9997C0 17.7895 2.15 15.9993 4.8 15.9993C5.36 15.9993 5.9 16.0793 6.4 16.2294V4.7984C6.4 4.04834 6.92 3.39829 7.655 3.23827L22.055 0.0380064C22.53 -0.0670023 23.025 0.048007 23.405 0.353032Z"
                                                    fill="#F59E0B"
                                                />
                                            </svg>
                                        </div>
                                        <div className="dash-content">
                                            <p>Top DSP</p>
                                            <h6>{topDSP?._id || "N/A"}</h6>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Top Country */}
                            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                <div className="orange-dark stem-child">
                                    <div className="dash-card ">
                                        <div className="dash-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="#FF5F51" strokeWidth="2" />
                                                <path d="M2 12H22" stroke="#FF5F51" strokeWidth="2" />
                                                <path d="M12 2C15 5.5 15 18.5 12 22C9 18.5 9 5.5 12 2Z"
                                                    stroke="#FF5F51" strokeWidth="2" />
                                            </svg>
                                        </div>
                                        <div className="dash-content">
                                            <p>Top Country</p>
                                            <h6>{topCountry?._id || "N/A"}</h6>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                    {/* FILTER SECTION WITH APPLY & CLEAR BUTTONS */}
                    <div className="filter-section mb-4">
                        <div className="row g-3 align-items-end">
                            {/* Search Release */}
                            <div className="col-md-4">
                                <label className="form-label">
                                    <i className="fa-solid fa-magnifying-glass me-1"></i>
                                    Search Release
                                </label>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter release name..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    {search && (
                                        <i
                                            className="fa-solid fa-xmark position-absolute end-0 top-50 translate-middle-y pe-3 text-muted"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setSearch("")}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* From Date */}
                            <div className="col-md-3">
                                <label className="form-label">From</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>

                            {/* To Date */}
                            <div className="col-md-3">
                                <label className="form-label">To</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>

                            {/* Apply & Clear Buttons */}
                            <div className="col-md-2">
                                <div className="d-flex gap-2">
                                    <button
                                        className="theme-btn green-cl white-cl"
                                        onClick={() => {
                                            setPage(1);
                                            setApplyFilter(prev => !prev);
                                        }}
                                    >
                                        Apply
                                    </button>


                                    {/* CLEAR */}
                                    <button
                                        className="theme-btn bg-red white-cl"
                                        onClick={() => {
                                            setSearch("");
                                            setFromDate("");
                                            setToDate("");
                                            setPage(1);
                                            setApplyFilter(prev => !prev);   // trigger refresh
                                        }}
                                        disabled={!search && !fromDate && !toDate}
                                    >
                                        Clear
                                    </button>

                                </div>
                            </div>

                        </div>
                    </div>
                    {/* --- RECORD TABLE --- */}
                    <div className="table-sec">
                        <table className="rdc-table rdc-shadow">
                            <thead>
                                <tr>
                                    <th className="main-th start">Platform</th>
                                    <th>Releases</th>
                                    <th>Date</th>
                                    <th>Streams</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        <Loader small={true} />
                                    </td>
                                </tr>
                            ) : (
                                <tbody>
                                    {records.length > 0 ? (
                                        records.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.retailer}</td>
                                                <td>{item.release}</td>
                                                <td>{item.date}</td>
                                                <td>{item.track_count}</td>
                                                <td>${Number(item.net_total || 0).toFixed(2)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" style={{ textAlign: "center" }}>No Data Found</td></tr>
                                    )}
                                </tbody>
                            )}
                        </table>
                    </div>
                    {/* --- PAGINATION BELOW TABLE --- */}
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
            </section >
        </>
    );
}

export default ArtistDetailComponent;
