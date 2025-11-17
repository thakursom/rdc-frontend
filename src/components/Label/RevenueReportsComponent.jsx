import React from 'react'

function RevenueReportsComponent() {
    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>Revenue Reports</h6>
                        <div className="btn-right-sec">
                            <button className="theme-btn green-cl white-cl me-1">
                                <i className="fa-solid fa-file-excel" />
                                Excel
                            </button>
                            <button className="theme-btn purple-cl white-cl table-button ">
                                <i className="fa-regular fa-file-lines me-1" />
                                Pdf
                            </button>
                        </div>
                    </div>
                    <div className="revnue-filters">
                        <form className="revenue-filter-fx">
                            <div className="row g-3 mb-4">
                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
                                    <div className="form-group">
                                        <div className="form-sec">
                                            <select className="form-select" id="label">
                                                <option value="All Status">All Youtube</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
                                    <div className="form-group">
                                        <div className="form-sec">
                                            <select className="form-select" id="label">
                                                <option value="All Status">Month</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
                                    <div className="form-group">
                                        <div className="form-sec">
                                            <select className="form-select" id="label">
                                                <option value="All Status">Quarter</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
                                    <div className="form-group">
                                        <div className="form-sec">
                                            <select className="form-select" id="label">
                                                <option value="All Status">Custom</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rdc-checkbox">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultValue=""
                                        id="check1"
                                        defaultChecked=""
                                    />
                                    <label className="form-check-label" htmlFor="check1">
                                        Releases
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultValue=""
                                        id="check1"
                                    />
                                    <label className="form-check-label" htmlFor="check1">
                                        Artist
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultValue=""
                                        id="check1"
                                    />
                                    <label className="form-check-label" htmlFor="check1">
                                        Track
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultValue=""
                                        id="check1"
                                    />
                                    <label className="form-check-label" htmlFor="check1">
                                        Partner
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultValue=""
                                        id="check1"
                                    />
                                    <label className="form-check-label" htmlFor="check1">
                                        Content Type
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultValue=""
                                        id="check1"
                                    />
                                    <label className="form-check-label" htmlFor="check1">
                                        Format
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultValue=""
                                        id="check1"
                                    />
                                    <label className="form-check-label" htmlFor="check1">
                                        Terriotory
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultValue=""
                                        id="check1"
                                    />
                                    <label className="form-check-label" htmlFor="check1">
                                        Quarters
                                    </label>
                                </div>
                                <div className="form-check">
                                    <button className="theme-btn green-cl white-cl">
                                        <i className="fa-solid fa-filter me-2" />
                                        Filter
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="revenue-cards">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="dash-card navy-cl">
                                    <div className="dash-icon ">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M23.4 0.348032C23.78 0.653057 24 1.1131 24 1.59814V16.7994C24 19.0096 21.85 20.7997 19.2 20.7997C16.55 20.7997 14.4 19.0096 14.4 16.7994C14.4 14.5892 16.55 12.7991 19.2 12.7991C19.76 12.7991 20.3 12.8791 20.8 13.0291V7.1936L9.6 9.68381V19.9997C9.6 22.2099 7.45 24 4.8 24C2.15 24 0 22.2099 0 19.9997C0 17.7895 2.15 15.9993 4.8 15.9993C5.36 15.9993 5.9 16.0793 6.4 16.2294V4.7984C6.4 4.04834 6.92 3.39829 7.655 3.23827L22.055 0.0380064C22.53 -0.0670023 23.025 0.048007 23.405 0.353032L23.4 0.348032Z"
                                                fill="#4D4E8E"
                                            />
                                        </svg>
                                    </div>
                                    <div className="dash-content">
                                        <p>Total Stream</p>
                                        <h6>18,700</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="dash-card parot-cl">
                                    <div className="dash-icon">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#3ED08E"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-dollar-sign w-8 h-8"
                                            aria-hidden="true"
                                            data-source-pos="346:26-346:60"
                                            data-source-name="DollarSign"
                                        >
                                            <line x1={12} x2={12} y1={2} y2={22} />
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                    </div>
                                    <div className="dash-content">
                                        <p>Total Revenue</p>
                                        <h6>$513.33</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="revenue-charts">
                        <div className="row g-4">
                            <div className="col-md-12  stem-col">
                                <div className="dash-charts stem-child">
                                    <div className="chart-content-head">
                                        <h5>
                                            Net Revnue By Month
                                            <p>
                                                <i className="fa-solid fa-circle" />
                                                By Channel
                                            </p>
                                            <span>Sep 2024 - Aug 2025</span>
                                        </h5>
                                        <div className="chart-icon">
                                            <button
                                                className="rdc-transpairent"
                                                type="button"
                                                id="netRevnue"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <i className="fa-solid fa-ellipsis color-blk" />
                                            </button>
                                            <ul
                                                className="dropdown-menu rdcDropdown rdc-revenueByChannel"
                                                aria-labelledby="netRevnue"
                                            >
                                                <li>
                                                    <a className="dropdown-item" href="#">
                                                        Action
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" href="#">
                                                        Another Action
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" href="#">
                                                        Something else
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="main-chartbox">
                                        <canvas
                                            id="rdcRevenueChart2"
                                            aria-label="Stacked revenue chart"
                                            role="img"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6  stem-col">
                                <div className="dash-charts stem-child">
                                    <div className="chart-content-head">
                                        <h5>
                                            Revnue By Channel
                                            <p>
                                                <i className="fa-solid fa-circle" />
                                            </p>
                                            <span>Sep 2024 - Aug 2025</span>
                                        </h5>
                                        <div className="chart-icon">
                                            <button
                                                className="rdc-transpairent"
                                                type="button"
                                                id="revnueByChannels"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <i className="fa-solid fa-ellipsis color-blk" />
                                            </button>
                                            <ul
                                                className="dropdown-menu rdcDropdown rdc-revenueByChannel"
                                                aria-labelledby="revnueByChannels"
                                            >
                                                <li>
                                                    <a className="dropdown-item" href="#">
                                                        Action
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" href="#">
                                                        Another Action
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" href="#">
                                                        Something else
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="main-chartbox">
                                        <canvas id="revenueBarChart2" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6  stem-col">
                                <div className="dash-charts stem-child">
                                    <div className="chart-content-head">
                                        <h5>
                                            Revnue By Country
                                            <p>
                                                <i className="fa-solid fa-circle" />
                                            </p>
                                            <span>Sep 2024 - Aug 2025</span>
                                        </h5>
                                        <div className="chart-icon">
                                            <button
                                                className="rdc-transpairent"
                                                type="button"
                                                id="revnueByCountry"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <i className="fa-solid fa-ellipsis color-blk" />
                                            </button>
                                            <ul
                                                className="dropdown-menu rdcDropdown rdc-revenueByChannel"
                                                aria-labelledby="revnueByCountry"
                                            >
                                                <li>
                                                    <a className="dropdown-item" href="#">
                                                        Action
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" href="#">
                                                        Another Action
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" href="#">
                                                        Something else
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="main-chartbox">
                                        <canvas id="countryRevenueChart" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="table-sec">
                        <table className="rdc-table">
                            <thead>
                                <tr>
                                    <th className="main-th start">Date</th>
                                    <th>Plateform</th>
                                    <th>Artist</th>
                                    <th>Release</th>
                                    <th>Steams</th>
                                    <th className="last">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="main-td">2025-08-24</td>
                                    <td>Spotify</td>
                                    <td>AYO</td>
                                    <td>Salt &amp; Sand</td>
                                    <td>11,200</td>
                                    <td>$173.40</td>
                                </tr>
                                <tr>
                                    <td className="main-td">2025-08-24</td>
                                    <td>Spotify</td>
                                    <td>AYO</td>
                                    <td>Salt &amp; Sand</td>
                                    <td>11,200</td>
                                    <td>$173.40</td>
                                </tr>
                                <tr>
                                    <td className="main-td">2025-08-24</td>
                                    <td>Spotify</td>
                                    <td>AYO</td>
                                    <td>Salt &amp; Sand</td>
                                    <td>11,200</td>
                                    <td>$173.40</td>
                                </tr>
                                <tr>
                                    <td className="main-td">2025-08-24</td>
                                    <td>Spotify</td>
                                    <td>AYO</td>
                                    <td>Salt &amp; Sand</td>
                                    <td>11,200</td>
                                    <td>$173.40</td>
                                </tr>
                                <tr>
                                    <td className="main-td">2025-08-24</td>
                                    <td>Spotify</td>
                                    <td>AYO</td>
                                    <td>Salt &amp; Sand</td>
                                    <td>11,200</td>
                                    <td>$173.40</td>
                                </tr>
                                <tr>
                                    <td className="main-td">2025-08-24</td>
                                    <td>Spotify</td>
                                    <td>AYO</td>
                                    <td>Salt &amp; Sand</td>
                                    <td>11,200</td>
                                    <td>$173.40</td>
                                </tr>
                                <tr>
                                    <td className="main-td">2025-08-24</td>
                                    <td>Spotify</td>
                                    <td>AYO</td>
                                    <td>Salt &amp; Sand</td>
                                    <td>11,200</td>
                                    <td>$173.40</td>
                                </tr>
                                <tr>
                                    <td className="main-td">2025-08-24</td>
                                    <td>Spotify</td>
                                    <td>AYO</td>
                                    <td>Salt &amp; Sand</td>
                                    <td>11,200</td>
                                    <td>$173.40</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        </>
    )
}

export default RevenueReportsComponent