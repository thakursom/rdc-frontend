import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SingleReleaseComponent() {
    const navigate = useNavigate();

    // Static fields (you can remove state if you don’t want input to work)
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">

                    {/* Heading */}
                    <div className="mian-sec-heading artistHeading">
                        <h6>Single Release Details</h6>
                        <button
                            className="theme-btn green-cl white-cl"
                            onClick={() => navigate(-1)}
                        >
                            <i className="fa-solid fa-arrow-left me-1"></i> Back
                        </button>
                    </div>

                    {/* Dummy name */}
                    <div className="heading-content">
                        <div className="inner-content">
                            <p>Release Name</p>
                        </div>
                    </div>

                    {/* DASH CARDS SECTION */}
                    <div className="artist-details">
                        <div className="row g-4">

                            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                <div className="navy-cl stem-child">
                                    <div className="dash-card">
                                        <div className="dash-icon">
                                            <svg width="24" height="24" fill="none">
                                                <path d="M16 6L20 20" stroke="#4D4E8E" strokeWidth="2" />
                                                <path d="M12 6V20" stroke="#4D4E8E" strokeWidth="2" />
                                                <path d="M8 8V20" stroke="#4D4E8E" strokeWidth="2" />
                                                <path d="M4 4V20" stroke="#4D4E8E" strokeWidth="2" />
                                            </svg>
                                        </div>
                                        <div className="dash-content">
                                            <p>Total Releases</p>
                                            <h6>45,000</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                <div className="parot-cl stem-child">
                                    <div className="dash-card ">
                                        <div className="dash-icon">
                                            <svg width="24" height="24" fill="none">
                                                <path
                                                    d="M23.4 0.3C23.78 0.65 24 1.11 24 1.59V16.8C24 19.01 21.85 20.8 19.2 20.8C16.55 20.8 14.4 19.01 14.4 16.8C14.4 14.59 16.55 12.8 19.2 12.8C19.76 12.8 20.3 12.88 20.8 13.03V7.19L9.6 9.68V20C9.6 22.2 7.45 24 4.8 24C2.15 24 0 22.2 0 20C0 17.79 2.15 16 4.8 16C5.36 16 5.9 16.08 6.4 16.23V4.79C6.4 4.04 6.92 3.39 7.66 3.24L22.05 0.04C22.53 -0.07 23.03 0.05 23.4 0.35Z"
                                                    fill="#3ED08E"
                                                />
                                            </svg>
                                        </div>
                                        <div className="dash-content">
                                            <p>Top DSP</p>
                                            <h6>Spotify</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                <div className="yellow-dark stem-child">
                                    <div className="dash-card ">
                                        <div className="dash-icon">
                                            <svg width="24" height="24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="2" />
                                                <path d="M2 12H22" stroke="#F59E0B" strokeWidth="2" />
                                                <path d="M12 2C15 5.5 15 18.5 12 22C9 18.5 9 5.5 12 2Z"
                                                    stroke="#F59E0B" strokeWidth="2" />
                                            </svg>
                                        </div>
                                        <div className="dash-content">
                                            <p>Top Country</p>
                                            <h6>USA</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                <div className="orange-dark stem-child">
                                    <div className="dash-card ">
                                        <div className="dash-icon">
                                            <svg width="24" height="24" fill="none">
                                                <path d="M16 7H22V13" stroke="#FF5F51" strokeWidth="2" />
                                                <path d="M22 7L13.5 15.5L8.5 10.5L2 17" stroke="#FF5F51" strokeWidth="2" />
                                            </svg>
                                        </div>
                                        <div className="dash-content">
                                            <p>Total Revenue</p>
                                            <h6>$12,450</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/*  FILTER UI SAME AS ARTIST DETAIL */}
                    <div className="filter-section mb-4">
                        <div className="row g-3 align-items-end">

                            <div className="col-md-4">
                                <label className="form-label">
                                    <i className="fa-solid fa-magnifying-glass me-1"></i>
                                    Search Track
                                </label>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter track name..."
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

                            <div className="col-md-3">
                                <label className="form-label">From</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">To</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>

                            <div className="col-md-2 d-flex gap-2">
                                <button className="theme-btn green-cl white-cl">Apply</button>
                                <button
                                    className="theme-btn bg-red white-cl"
                                    onClick={() => {
                                        setSearch("");
                                        setFromDate("");
                                        setToDate("");
                                    }}
                                    disabled={!search && !fromDate && !toDate}
                                >
                                    Clear
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="table-sec">
                        <table className="rdc-table rdc-shadow">
                            <thead>
                                <tr>
                                    <th className="main-th start">Artist Name</th>
                                    <th>Label</th>
                                    <th>DSP</th>
                                    <th>Release Date</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Static rows */}
                                {[...Array(10)].map((_, idx) => (
                                    <tr key={idx}>
                                        <td className="main-td">Bruno Mars</td>
                                        <td>XYZ Records</td>
                                        <td>Spotify</td>
                                        <td>2025-05-22</td>
                                        <td>$56.78</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
}

export default SingleReleaseComponent;
