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