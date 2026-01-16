import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import Loader from "../Loader/Loader";

import GrowthChart from "../Chart/GrowthChart";
import PlateFormShare from "../Chart/PlateFormShare";
import RevenueStackedArea from "../Chart/RevenueStackedArea";
import MusicStreamsChart from "../Chart/MusicStreamsChart";
import WeeklyStreamChart from "../Chart/WeeklyStreamChart";
import MusicStreamComparisonChart from "../Chart/MusicStreamComparisonChart";
import StreamingTrendsOverTimeChart from "../Chart/StreamingTrendsOverTimeChart";
import TerritoryRevenue from "../Chart/TerritoryRevenue";

function DashboardComponent() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await apiRequest("/audio-streaming-Dashboard", "GET", null, true);

                if (response?.success) {
                    setDashboardData(response.data.data);
                }
            } catch (err) {
                console.error("Dashboard data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getLast12MonthsRange = () => {
        const items = dashboardData?.revenueByMonthPlatform || [];
        if (!Array.isArray(items) || items.length === 0) return "";

        const months = items
            .map(item => item._id?.trim())
            .filter(m => m && /^\d{4}-\d{2}$/.test(m))
            .sort();

        if (months.length === 0) return "";

        const format = (m) => {
            const [y, mo] = m.split('-').map(Number);
            return new Date(y, mo - 1, 1).toLocaleString('default', {
                month: 'short',
                year: 'numeric'
            });
        };

        return `${format(months[0])} - ${format(months[months.length - 1])}`;
    };

    if (!dashboardData && !loading) {
        return <div className="text-center py-10">No data available</div>;
    }
    const data = dashboardData || {};

    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="dashTabs mainDashboarTabs">
                        <ul className="nav nav-tabs" id="myTabs" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link active"
                                    id="audio-revenue-tab"
                                    data-bs-toggle="tab"
                                    href="#audio-revenue"
                                    role="tab"
                                    aria-controls="audio-revenue"
                                    aria-selected="true"
                                >
                                    Revenue
                                </a>
                            </li>

                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link"
                                    id="audio-streams-tab"
                                    data-bs-toggle="tab"
                                    href="#audio-streams"
                                    role="tab"
                                    aria-controls="audio-streams"
                                    aria-selected="false"
                                >
                                    Audio Streams
                                </a>
                            </li>
                        </ul>

                        <div className="tab-content" id="myTabContent">
                            <div
                                className="tab-pane fade show active"
                                id="audio-revenue"
                                role="tabpanel"
                                aria-labelledby="audio-revenue-tab"
                            >

                                <div className="form-main-sec row pb-5 pt-4 g-4">
                                    <form className="rdc-form">
                                        <div className="form-group">
                                            <div className="form-sec">
                                                <i className="fa-solid fa-magnifying-glass" />
                                                <input
                                                    className="form-control"
                                                    type="search"
                                                    placeholder="search here"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-sec">
                                                <select className="form-select" id="label">
                                                    <option value="label">Label</option>
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
                                        <div className="form-group">
                                            <div className="form-sec">
                                                <button className="theme-btn green-cl white-cl">Apply</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="row pb-5 g-4">
                                    {
                                        loading ? (
                                            <div className="text-center py-5"><Loader small={true} /></div>
                                        ) : (
                                            <>
                                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                                    <div className="stem-child parot-cl">
                                                        <div className="dash-card">
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
                                                                <h6>
                                                                    <h6>${Number(data?.overview?.totalRevenue || 0).toLocaleString()}</h6>
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                                    <div className="stem-child navy-cl">
                                                        <div className="dash-card ">
                                                            <div className="dash-icon">
                                                                <svg
                                                                    width={20}
                                                                    height={20}
                                                                    viewBox="0 0 20 20"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M14.5 3.25L19 19"
                                                                        stroke="#4D4E8E"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M10 3.25V19"
                                                                        stroke="#4D4E8E"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M5.5 5.5V19"
                                                                        stroke="#4D4E8E"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M1 1V19"
                                                                        stroke="#4D4E8E"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="dash-content">
                                                                <p>Top Release</p>
                                                                <h6>{data?.overview?.topRelease?.release || 'N/A'}</h6>
                                                                <span>${Number(data?.overview?.topRelease?.revenue || 0).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                                    <div className="stem-child orange-dark">
                                                        <div className="dash-card ">
                                                            <div className="dash-icon ">
                                                                <svg
                                                                    width={24}
                                                                    height={24}
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M21.799 0.330462C21.3583 -0.110154 20.6458 -0.110154 20.2098 0.330462L17.9549 2.58042C17.8424 2.69292 17.7533 2.82885 17.697 2.97885L16.9751 4.90069L13.3419 8.53812C11.2277 7.16002 8.68678 7.12252 7.20069 8.61312C6.68502 9.12873 6.35686 9.76622 6.19747 10.4693C6.02401 11.2474 5.30207 11.9084 4.50512 11.9506C3.305 12.0115 2.19395 12.4521 1.35012 13.2912C-0.750088 15.3911 -0.3563 19.1879 2.22677 21.7707C4.80983 24.3534 8.60708 24.7519 10.7073 22.6519C11.5464 21.8129 11.9918 20.6973 12.048 19.4973C12.0902 18.7004 12.7512 17.9832 13.5294 17.8051C14.2326 17.6458 14.8702 17.3129 15.3859 16.802C16.8766 15.3114 16.8391 12.7755 15.4609 10.6615L19.0987 7.02408L21.0208 6.30222C21.1708 6.24597 21.3068 6.15691 21.4193 6.04442L23.6695 3.79446C24.1102 3.35384 24.1102 2.64136 23.6695 2.20543L21.799 0.330462ZM9.75094 12.0021C10.9933 12.0021 12.0012 13.0099 12.0012 14.2521C12.0012 15.4942 10.9933 16.502 9.75094 16.502C8.50863 16.502 7.50072 15.4942 7.50072 14.2521C7.50072 13.0099 8.50863 12.0021 9.75094 12.0021Z"
                                                                        fill="#FF5F51"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="dash-content">
                                                                <p>Top Artist</p>
                                                                <h6>{data?.overview?.topArtist?.artist || 'N/A'}</h6>
                                                                <span>${Number(data?.overview?.topArtist?.revenue || 0).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                                    <div className="stem-child yellow-dark">
                                                        <div className="dash-card ">
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
                                                                        fill="#F59E0B"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="dash-content">
                                                                <p>Top Track</p>
                                                                <h6>{data?.overview?.topTrack?.track || 'N/A'}</h6>
                                                                <span>${Number(data?.overview?.topTrack?.revenue || 0).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </>
                                        )
                                    }

                                </div>

                                <div className="row g-4">
                                    <div className="col-md-6 col-lg-7 col-xxl-8 stem-col">
                                        <div className="dash-charts stem-child">
                                            <div className="chart-content-head">
                                                <h5>Monthly Revenue</h5>
                                                <div className="chart-icon">
                                                    <button
                                                        className="theme-btn parot-light color-blk"
                                                        type="button"
                                                        id="mothlyRevenue"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <i className="fa-solid fa-download color-blk me-1" />
                                                        Export CSV
                                                    </button>
                                                    <ul
                                                        className="dropdown-menu rdcDropdown rdc-mothlyRevenue"
                                                        aria-labelledby="mothlyRevenue"
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

                                            <div className="main-chartbox" style={{ position: "relative", height: "400px" }}>
                                                {loading ? (
                                                    <div
                                                        className="position-absolute top-50 start-50 translate-middle"
                                                        style={{ zIndex: 10 }}
                                                    >
                                                        <Loader small={true} />
                                                    </div>
                                                ) : (
                                                    <GrowthChart revenueByMonthData={data?.monthlyRevenue} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-5 col-xxl-4   stem-col">
                                        <div className="dash-charts stem-child">
                                            <div className="chart-content-head">
                                                <h5>Plateform Share</h5>
                                                <div className="chart-icon">
                                                    <button
                                                        className="rdc-transpairent"
                                                        type="button"
                                                        id="plateformShare"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <i className="fa-solid fa-ellipsis color-blk" />
                                                    </button>
                                                    <ul
                                                        className="dropdown-menu rdcDropdown rdc-plateformShare"
                                                        aria-labelledby="plateformShare"
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
                                            <div className="main-chartbox" style={{ position: "relative", height: "400px" }}>
                                                {/* <canvas id="myChart" /> */}
                                                {loading ? (
                                                    <div className="position-absolute top-50 start-50 translate-middle"
                                                        style={{ zIndex: 10 }}
                                                    >
                                                        <Loader small={true} />
                                                    </div>
                                                ) : (
                                                    <PlateFormShare data={data?.platformShare} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12  stem-col">
                                        <div className="dash-charts stem-child">
                                            <div className="chart-content-head">
                                                <h5>
                                                    Net Revenue By Month{" "}
                                                    <p>
                                                        <i className="fa-solid fa-circle" />
                                                        By Channel
                                                    </p>
                                                    <span>{getLast12MonthsRange()}</span>{" "}
                                                </h5>
                                                <div className="chart-icon">
                                                    <button
                                                        className="rdc-transpairent"
                                                        type="button"
                                                        id="revenueByMonth"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <i className="fa-solid fa-ellipsis color-blk" />
                                                    </button>
                                                    <ul
                                                        className="dropdown-menu rdcDropdown"
                                                        aria-labelledby="revenueByMonth"
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
                                            <div className="main-chartbox" style={{ position: "relative", height: "400px" }}>
                                                {/* <canvas id="revenueChart" /> */}
                                                {/* <RevenueByMonthChart /> */}
                                                {loading ? (
                                                    <div className="position-absolute top-50 start-50 translate-middle"
                                                        style={{ zIndex: 10 }}
                                                    >
                                                        <Loader small={true} />
                                                    </div>
                                                ) : (
                                                    <RevenueStackedArea revenueData={data?.revenueByMonthPlatform} />
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6  stem-col">
                                        <div className="dash-charts stem-child">
                                            <div className="chart-content-head">
                                                <h5>Music Streams Dashboard</h5>
                                                <div className="chart-icon">
                                                    <button
                                                        className="rdc-transpairent"
                                                        type="button"
                                                        id="revenueByChannel"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <i className="fa-solid fa-ellipsis color-blk" />
                                                    </button>
                                                    <ul
                                                        className="dropdown-menu rdcDropdown rdc-revenueByChannel"
                                                        aria-labelledby="revenueByChannel"
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
                                            <div className="main-chartbox" style={{ position: "relative", height: "400px" }}>
                                                {/* <canvas id="yearChart" /> */}
                                                {loading ? (
                                                    <div className="position-absolute top-50 start-50 translate-middle"
                                                        style={{ zIndex: 10 }}
                                                    >
                                                        <Loader small={true} />
                                                    </div>
                                                ) : (
                                                    <MusicStreamsChart musicData={data?.yearlyStreams[0]?.data} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6  stem-col">
                                        <div className="dash-charts stem-child1">
                                            <div className="chart-content-head">
                                                <h5>Territory Heatmap (Revenue)</h5>
                                                <div className="chart-icon">
                                                    <button
                                                        className="rdc-transpairent"
                                                        type="button"
                                                        id="territoryHeatmap"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <i className="fa-solid fa-ellipsis color-blk" />
                                                    </button>
                                                    <ul
                                                        className="dropdown-menu rdcDropdown"
                                                        aria-labelledby="territoryHeatmap"
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
                                            <div className="main-chartbox" style={{ position: "relative", height: "400px" }}>
                                                {loading ? (
                                                    <div className="position-absolute top-50 start-50 translate-middle"
                                                        style={{ zIndex: 10 }}
                                                    >
                                                        <Loader small={true} />
                                                    </div>
                                                ) : (
                                                    <TerritoryRevenue territoryData={data?.territoryRevenue} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="audio-streams"
                                role="tabpanel"
                                aria-labelledby="audio-streams-tab"
                            >
                                <div
                                    className="tab-pane fade show active"
                                    id="home"
                                    role="tabpanel"
                                    aria-labelledby="home-tab"
                                >
                                    <div className="form-main-sec row pb-5 pt-4 g-4 ">
                                        <form className="rdc-form">
                                            <div className="form-group">
                                                <div className="form-sec">
                                                    <i className="fa-solid fa-magnifying-glass" />
                                                    <input
                                                        className="form-control"
                                                        type="search"
                                                        placeholder="search here"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="form-sec">
                                                    <select className="form-select" id="label">
                                                        <option value="label">Label</option>
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
                                            <div className="form-group">
                                                <div className="form-sec">
                                                    <button className="theme-btn green-cl white-cl">
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="row pb-5 g-4">
                                        {
                                            loading ? (
                                                <div className="text-center py-5"><Loader small={true} /></div>
                                            ) : (
                                                <>
                                                    <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                                        <div className="stem-child parot-cl">
                                                            <div className="dash-card ">
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
                                                                    <p>Total Stream</p>
                                                                    <h6>${data?.overview?.totalStreams || 0}</h6>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                                        <div className="stem-child navy-cl">
                                                            <div className="dash-card ">
                                                                <div className="dash-icon">
                                                                    <svg
                                                                        width={20}
                                                                        height={20}
                                                                        viewBox="0 0 20 20"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M14.5 3.25L19 19"
                                                                            stroke="#4D4E8E"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M10 3.25V19"
                                                                            stroke="#4D4E8E"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M5.5 5.5V19"
                                                                            stroke="#4D4E8E"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M1 1V19"
                                                                            stroke="#4D4E8E"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <div className="dash-content">
                                                                    <p>Top Release</p>
                                                                    <h6>{data?.overview?.topRelease?.release || 'N/A'}</h6>
                                                                    <span>${Number(data?.overview?.topRelease?.revenue || 0).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                                        <div className="stem-child orange-dark">
                                                            <div className="dash-card ">
                                                                <div className="dash-icon ">
                                                                    <svg
                                                                        width={24}
                                                                        height={24}
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M21.799 0.330462C21.3583 -0.110154 20.6458 -0.110154 20.2098 0.330462L17.9549 2.58042C17.8424 2.69292 17.7533 2.82885 17.697 2.97885L16.9751 4.90069L13.3419 8.53812C11.2277 7.16002 8.68678 7.12252 7.20069 8.61312C6.68502 9.12873 6.35686 9.76622 6.19747 10.4693C6.02401 11.2474 5.30207 11.9084 4.50512 11.9506C3.305 12.0115 2.19395 12.4521 1.35012 13.2912C-0.750088 15.3911 -0.3563 19.1879 2.22677 21.7707C4.80983 24.3534 8.60708 24.7519 10.7073 22.6519C11.5464 21.8129 11.9918 20.6973 12.048 19.4973C12.0902 18.7004 12.7512 17.9832 13.5294 17.8051C14.2326 17.6458 14.8702 17.3129 15.3859 16.802C16.8766 15.3114 16.8391 12.7755 15.4609 10.6615L19.0987 7.02408L21.0208 6.30222C21.1708 6.24597 21.3068 6.15691 21.4193 6.04442L23.6695 3.79446C24.1102 3.35384 24.1102 2.64136 23.6695 2.20543L21.799 0.330462ZM9.75094 12.0021C10.9933 12.0021 12.0012 13.0099 12.0012 14.2521C12.0012 15.4942 10.9933 16.502 9.75094 16.502C8.50863 16.502 7.50072 15.4942 7.50072 14.2521C7.50072 13.0099 8.50863 12.0021 9.75094 12.0021Z"
                                                                            fill="#FF5F51"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <div className="dash-content">
                                                                    <p>Top Artist</p>
                                                                    <h6>{data?.overview?.topArtist?.artist || 'N/A'}</h6>
                                                                    <span>${Number(data?.overview?.topArtist?.revenue || 0).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 col-stem">
                                                        <div className="stem-child yellow-dark">
                                                            <div className="dash-card ">
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
                                                                            fill="#F59E0B"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <div className="dash-content">
                                                                    <p>Top Track</p>
                                                                    <h6>{data?.overview?.topTrack?.track || 'N/A'}</h6>
                                                                    <span>${Number(data?.overview?.topTrack?.revenue || 0).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </>
                                            )}
                                    </div>

                                    <div className="row g-4">
                                        <div className="col-md-12 col-lg-12 col-xl-6  stem-col">
                                            <div className="dash-charts stem-child">
                                                <div className="chart-content-head">
                                                    <h5>Weekly Streams</h5>
                                                    <div className="chart-icon">
                                                        <button
                                                            className="rdc-transpairent"
                                                            type="button"
                                                            id="weeklyStreams"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            <i className="fa-solid fa-ellipsis color-blk" />
                                                        </button>
                                                        <ul
                                                            className="dropdown-menu rdcDropdown rdc-revenueByChannel"
                                                            aria-labelledby="weeklyStreams"
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
                                                <div className="main-chartbox" style={{ position: "relative", height: "400px" }}>
                                                    {/* <canvas id="weeklyChart" /> */}
                                                    {loading ? (
                                                        <div
                                                            className="position-absolute top-50 start-50 translate-middle"
                                                            style={{ zIndex: 10 }}
                                                        >
                                                            <Loader small={true} />
                                                        </div>
                                                    ) : (
                                                        <WeeklyStreamChart weeklyData={data?.weeklyStreams[0].data} />
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                        <div className="col-md-12 col-lg-12 col-xl-6  stem-col">
                                            <div className="dash-charts stem-child">
                                                <div className="chart-content-head">
                                                    <h5>Music Stream Comparison (MTD + 12%)</h5>
                                                    <div className="chart-icon">
                                                        <button
                                                            className="rdc-transpairent"
                                                            type="button"
                                                            id="musicStream"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            <i className="fa-solid fa-ellipsis color-blk" />
                                                        </button>
                                                        <ul
                                                            className="dropdown-menu rdcDropdown rdc-revenueByChannel"
                                                            aria-labelledby="musicStream"
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
                                                <div className="main-chartbox" style={{ position: "relative", height: "400px" }}>
                                                    {/* <canvas id="streamsChart" /> */}
                                                    {loading ? (
                                                        <div
                                                            className="position-absolute top-50 start-50 translate-middle"
                                                            style={{ zIndex: 10 }}
                                                        >
                                                            <Loader small={true} />
                                                        </div>
                                                    ) : (
                                                        <MusicStreamComparisonChart comparisonData={data?.musicStreamComparison[0]} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12  stem-col">
                                            <div className="dash-charts stem-child">
                                                <div className="chart-content-head">
                                                    <div className="stream-chart-heading">
                                                        <h5>Streaming Trends Over Time</h5>
                                                        <p>Monthly streaming performance across all platforms</p>
                                                    </div>
                                                    <div className="chart-icon">
                                                        <button
                                                            className="rdc-transpairent"
                                                            type="button"
                                                            id="streamingTrends"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            <i className="fa-solid fa-ellipsis color-blk" />
                                                        </button>
                                                        <ul
                                                            className="dropdown-menu rdcDropdown rdc-revenueByChannel"
                                                            aria-labelledby="streamingTrends"
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
                                                <div className="chart-container mb-3" style={{ position: "relative", height: "450px" }}>
                                                    {/* <canvas id="musicChart" /> */}
                                                    {loading ? (
                                                        <div
                                                            className="position-absolute top-50 start-50 translate-middle"
                                                            style={{ zIndex: 10 }}
                                                        >
                                                            <Loader small={true} />
                                                        </div>
                                                    ) : (
                                                        <StreamingTrendsOverTimeChart trendsData={data?.streamingTrends[0]} />
                                                    )}
                                                </div>
                                                <p>Streams (Millions)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>

    );
}

export default DashboardComponent