import React from 'react'

function SalesAndTrendsComponent() {
    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>Sales &amp; Trends</h6>
                    </div>
                    <div className="revnue-filters salesTrends">
                        <form className="revenue-filter-fx" id="salesAndTrends">
                            <div className="sale-trend-form">
                                <div className="form-group">
                                    <div className="form-sec">
                                        <select className="form-select" id="label">
                                            <option value="All Status">Youtube Music</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="form-sec form-sec-set">
                                        <label className="form-label" htmlFor="start-date">
                                            From
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            placeholder="search here"
                                            id="start-date"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="form-sec form-sec-set">
                                        <label className="form-label" htmlFor="start-date">
                                            To
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            placeholder="search here"
                                            id="start-date"
                                        />
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
                                        Terriotory
                                    </label>
                                </div>
                                <div className="form-check">
                                    <button className="theme-btn green-cl white-cl">Apply</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="revenue-cards">
                        <div className="row g-4">
                            <div className="col-md-4">
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
                                        <p>Last Day Revenue</p>
                                        <h6>294.73</h6>
                                        <span>+234.93 vs prev day</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
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
                                        <p>7d Total</p>
                                        <h6>513.33</h6>
                                        <span>+513.33 vs prior 7d</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="dash-card yellow-dark">
                                    <div className="dash-icon ">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
                                                stroke="#F59E0B"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20"
                                                stroke="#F59E0B"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M10 9H8"
                                                stroke="#F59E0B"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M16 13H8"
                                                stroke="#F59E0B"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M16 17H8"
                                                stroke="#F59E0B"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="dash-content">
                                        <p>Days in Range</p>
                                        <h6>6</h6>
                                        <span>2025-06-30 → 2025-08-24</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row g-4 mb-4">
                        <div className="col-md-12  stem-col">
                            <div className="dash-charts stem-child">
                                <div className="chart-content-head">
                                    <h5>Daily Sales &amp; Trends</h5>
                                    <div className="chart-icon">
                                        <button
                                            className="rdc-transpairent"
                                            type="button"
                                            id="dailySales"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="fa-solid fa-ellipsis color-blk" />
                                        </button>
                                        <ul
                                            className="dropdown-menu rdcDropdown rdc-revenueByChannel"
                                            aria-labelledby="dailySales"
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
                                    <canvas id="lineChart" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="chart-box">
                        <div className="chart-content-head">
                            <h5>Daily Table</h5>
                        </div>
                        <table className="rdc-table rdc-shadow">
                            <thead>
                                <tr>
                                    <th className="main-th start">Date</th>
                                    <th>Track</th>
                                    <th>Streams</th>
                                    <th>Revenue</th>
                                    <th>DSP</th>
                                    <th>Territory</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="main-td">2025-07-29</td>
                                    <td>Song A</td>
                                    <td>12,345</td>
                                    <td>56.78</td>
                                    <td>Spotify</td>
                                    <td>US</td>
                                </tr>
                                <tr>
                                    <td className="main-td">2025-07-29</td>
                                    <td>Song A</td>
                                    <td>12,345</td>
                                    <td>56.78</td>
                                    <td>Spotify</td>
                                    <td>US</td>
                                </tr>
                                <tr>
                                    <td className="main-td">2025-07-29</td>
                                    <td>Song A</td>
                                    <td>12,345</td>
                                    <td>56.78</td>
                                    <td>Spotify</td>
                                    <td>US</td>
                                </tr>
                                <tr>
                                    <td className="main-td">2025-07-29</td>
                                    <td>Song A</td>
                                    <td>12,345</td>
                                    <td>56.78</td>
                                    <td>Spotify</td>
                                    <td>US</td>
                                </tr>
                                <tr>
                                    <td className="main-td">2025-07-29</td>
                                    <td>Song A</td>
                                    <td>12,345</td>
                                    <td>56.78</td>
                                    <td>Spotify</td>
                                    <td>US</td>
                                </tr>
                                <tr>
                                    <td className="main-td">2025-07-29</td>
                                    <td>Song A</td>
                                    <td>12,345</td>
                                    <td>56.78</td>
                                    <td>Spotify</td>
                                    <td>US</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        </>
    )
}

export default SalesAndTrendsComponent