import React from 'react'
import { useNavigate } from 'react-router-dom'

function ReleasesComponent() {
    const navigate = useNavigate();
    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>Releases</h6>
                        <div className="release-filter">
                            <form className="release-from">
                                <div className="form-group">
                                    <div className="form-sec">
                                        <select className="form-select" id="label">
                                            <option value="label">Filter All Artist</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                            <div className="ingestion-fx">
                                <svg
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 13V21"
                                        stroke="#4C5461"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M4.00009 14.899C3.25714 14.1399 2.69666 13.2217 2.36113 12.2139C2.0256 11.2062 1.9238 10.1352 2.06346 9.08229C2.20311 8.02935 2.58055 7.02199 3.16719 6.13652C3.75383 5.25106 4.53428 4.5107 5.44943 3.97154C6.36458 3.43238 7.39042 3.10854 8.44926 3.02457C9.5081 2.94059 10.5722 3.09868 11.5609 3.48685C12.5496 3.87502 13.4369 4.4831 14.1558 5.26503C14.8747 6.04695 15.4062 6.98222 15.7101 7.99999H17.5001C18.4656 7.99988 19.4056 8.31031 20.1811 8.88543C20.9566 9.46055 21.5266 10.2699 21.8069 11.1938C22.0871 12.1177 22.0628 13.1073 21.7374 14.0164C21.4121 14.9254 20.803 15.7057 20.0001 16.242"
                                        stroke="#4C5461"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M8 17L12 13L16 17"
                                        stroke="#4C5461"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <p>Ingest New Report</p>
                            </div>
                        </div>
                    </div>
                    <div className="table-sec">
                        <table className="rdc-table">
                            <thead>
                                <tr>
                                    <th className="main-th start">UPC</th>
                                    <th>Title</th>
                                    <th>Artist</th>
                                    <th>Tracks</th>
                                    <th>Release Date</th>
                                    <th style={{ width: "20% !important" }} className="last">
                                        View
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="main-td">987654321098</td>
                                    <td>Island Nights</td>
                                    <td>Bruno Mars</td>
                                    <td>1</td>
                                    <td>2025-05-22</td>
                                    <td>
                                        <button className="border-less border-purple color-purple table-button me-1"
                                            onClick={() =>
                                                navigate(`/sub-label/release-details`)
                                            }
                                        >
                                            View
                                            <i className="fa-solid fa-chevron-right" />
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="main-td">987654321098</td>
                                    <td>Island Nights</td>
                                    <td>Bruno Mars</td>
                                    <td>1</td>
                                    <td>2025-05-22</td>
                                    <td>
                                        <button className="border-less border-purple color-purple table-button me-1"
                                            onClick={() =>
                                                navigate(`/sub-label/release-details`)
                                            }
                                        >
                                            View
                                            <i className="fa-solid fa-chevron-right" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        </>
    )
}

export default ReleasesComponent