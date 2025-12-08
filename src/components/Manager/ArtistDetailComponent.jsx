import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

function ArtistDetailComponent() {
    const { userId } = useParams();

    const [ArtistDetails, setArtistDetails] = useState([]);
    const navigate = useNavigate();
    console.log("ArtistDetails", ArtistDetails);


    const fetchSubLabels = async () => {

        const result = await apiRequest(`/fetchArtistById?id=${userId}`, "GET", null, true);

        if (result.success) {
            setArtistDetails(result?.data?.artist);
        } else {
            console.log("Error Fetching Label Data");
        }
    };

    useEffect(() => {
        fetchSubLabels();
    }, []);

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
                            <p>AYO</p>
                            <span>Country:&nbsp;BS</span>
                        </div>
                        <div className="top-button">
                            <button
                                type="button"
                                className="theme-btn purple-cl white-cl"
                                data-bs-toggle="modal"
                                data-bs-target="#myModal"
                            >
                                Generate Statement
                            </button>
                            <button className="theme-btn green-cl white-cl">Send Payout</button>
                            <div
                                className="modal fade artist-tabs"
                                id="myModal"
                                tabIndex={-1}
                                aria-labelledby="myModalLabel"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header artist-tab-head">
                                            <div className="inner-content">
                                                <p>AYO</p>
                                                <span>STMT-2025-08-29-AYO&nbsp;•&nbsp;Aug 1–24, 2025</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                <i className="fa-solid fa-xmark" />
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="chart-box artist-popup">
                                                <div className="table-sec">
                                                    <table className="rdc-table rdc-shadow">
                                                        <thead>
                                                            <tr>
                                                                <th className="main-th start">Platform</th>
                                                                <th>Streams</th>
                                                                <th>Revenue</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="main-td">Spotify</td>
                                                                <td>17,200</td>
                                                                <td>$267.62</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="main-td">Apple Music</td>
                                                                <td>9,600</td>
                                                                <td>$154.23</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="main-td">YouTube</td>
                                                                <td>8,100</td>
                                                                <td>$78.41</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer artist-footer">
                                            <div className="footer-content">
                                                <span>Total</span>
                                                <p>$500.26</p>
                                            </div>
                                            <div className="footer-button">
                                                <button
                                                    type="button"
                                                    className="theme-btn purple-cl white-cl"
                                                    data-bs-dismiss="modal"
                                                >
                                                    <i className="fa-solid fa-download" />
                                                    PDF
                                                </button>
                                                <button type="button" className="theme-btn green-cl white-cl">
                                                    <i className="fa-regular fa-credit-card" />
                                                    Send Payout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="artist-details">
                        <div className="row g-4">
                            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                                <div className="dash-card navy-cl">
                                    <div className="dash-icon">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
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
                                        <p>30d Streams</p>
                                        <h6>185,000</h6>
                                        <span>+5%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                                <div className="dash-card parot-cl">
                                    <div className="dash-icon">
                                        <svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M12 2V22"
                                                stroke="#3ED08E"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                                                stroke="#3ED08E"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="dash-content">
                                        <p>Unpaid Revenue</p>
                                        <h6>$2,850.45</h6>
                                        <span>as of today</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-4">
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
                                                d="M16 6L20 20"
                                                stroke="#F59E0B"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M12 6V20"
                                                stroke="#F59E0B"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M8 8V20"
                                                stroke="#F59E0B"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M4 4V20"
                                                stroke="#F59E0B"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="dash-content">
                                        <p>Active Releases</p>
                                        <h6>1</h6>
                                        <span>catalog</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashTabs">
                        <ul className="nav nav-tabs" id="myTabs" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link active"
                                    id="home-tab"
                                    data-bs-toggle="tab"
                                    href="#recent-activity"
                                    role="tab"
                                    aria-controls="home"
                                    aria-selected="true"
                                >
                                    Recent Activity
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link"
                                    id="profile-tab"
                                    data-bs-toggle="tab"
                                    href="#royaltySplits"
                                    role="tab"
                                    aria-controls="profile"
                                    aria-selected="false"
                                >
                                    Royalty Splits
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link"
                                    id="profile-tab"
                                    data-bs-toggle="tab"
                                    href="#payoutHistory"
                                    role="tab"
                                    aria-controls="profile"
                                    aria-selected="false"
                                >
                                    Payout History
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div
                                className="tab-pane fade show active"
                                id="recent-activity"
                                role="tabpanel"
                                aria-labelledby="home-tab"
                            >
                                <table className="rdc-table rdc-shadow">
                                    <thead>
                                        <tr>
                                            <th className="main-th start">Platform</th>
                                            <th>Date</th>
                                            <th>Streams</th>
                                            <th>Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="main-td">Spotify</td>
                                            <td>2025-08-20</td>
                                            <td>12,000</td>
                                            <td>$185.22</td>
                                        </tr>
                                        <tr>
                                            <td className="main-td">Spotify</td>
                                            <td>2025-08-20</td>
                                            <td>12,000</td>
                                            <td>$185.22</td>
                                        </tr>
                                        <tr>
                                            <td className="main-td">Spotify</td>
                                            <td>2025-08-20</td>
                                            <td>12,000</td>
                                            <td>$185.22</td>
                                        </tr>
                                        <tr>
                                            <td className="main-td">Spotify</td>
                                            <td>2025-08-20</td>
                                            <td>12,000</td>
                                            <td>$185.22</td>
                                        </tr>
                                        <tr>
                                            <td className="main-td">Spotify</td>
                                            <td>2025-08-20</td>
                                            <td>12,000</td>
                                            <td>$185.22</td>
                                        </tr>
                                        <tr>
                                            <td className="main-td">Spotify</td>
                                            <td>2025-08-20</td>
                                            <td>12,000</td>
                                            <td>$185.22</td>
                                        </tr>
                                        <tr>
                                            <td className="main-td">Spotify</td>
                                            <td>2025-08-20</td>
                                            <td>12,000</td>
                                            <td>$185.22</td>
                                        </tr>
                                        <tr>
                                            <td className="main-td">Spotify</td>
                                            <td>2025-08-20</td>
                                            <td>12,000</td>
                                            <td>$185.22</td>
                                        </tr>
                                        <tr>
                                            <td className="main-td">Spotify</td>
                                            <td>2025-08-20</td>
                                            <td>12,000</td>
                                            <td>$185.22</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="royaltySplits"
                                role="tabpanel"
                                aria-labelledby="profile-tab"
                            >
                                <div
                                    className="tab-pane fade show active"
                                    id="home"
                                    role="tabpanel"
                                    aria-labelledby="home-tab"
                                >
                                    <table className="rdc-table rdc-shadow">
                                        <thead>
                                            <tr>
                                                <th className="main-th start">Payee</th>
                                                <th>Percent</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="main-td">Artist</td>
                                                <td>60%</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">Artist</td>
                                                <td>60%</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">Artist</td>
                                                <td>60%</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">Artist</td>
                                                <td>60%</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">Artist</td>
                                                <td>60%</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">Artist</td>
                                                <td>60%</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">Artist</td>
                                                <td>60%</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">Artist</td>
                                                <td>60%</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">Artist</td>
                                                <td>60%</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">Artist</td>
                                                <td>60%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="payoutHistory"
                                role="tabpanel"
                                aria-labelledby="profile-tab"
                            >
                                <div
                                    className="tab-pane fade show active"
                                    id="home"
                                    role="tabpanel"
                                    aria-labelledby="home-tab"
                                >
                                    <table className="rdc-table rdc-shadow">
                                        <thead>
                                            <tr>
                                                <th className="main-th start">Payout ID</th>
                                                <th>Date</th>
                                                <th>Method</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="main-td">PO-1021</td>
                                                <td>2025-08-10</td>
                                                <td>Bank Transfer</td>
                                                <td>$520.50</td>
                                                <td>Paid</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">PO-1021</td>
                                                <td>2025-08-10</td>
                                                <td>Bank Transfer</td>
                                                <td>$520.50</td>
                                                <td>Paid</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">PO-1021</td>
                                                <td>2025-08-10</td>
                                                <td>Bank Transfer</td>
                                                <td>$520.50</td>
                                                <td>Paid</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">PO-1021</td>
                                                <td>2025-08-10</td>
                                                <td>Bank Transfer</td>
                                                <td>$520.50</td>
                                                <td>Paid</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">PO-1021</td>
                                                <td>2025-08-10</td>
                                                <td>Bank Transfer</td>
                                                <td>$520.50</td>
                                                <td>Paid</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">PO-1021</td>
                                                <td>2025-08-10</td>
                                                <td>Bank Transfer</td>
                                                <td>$520.50</td>
                                                <td>Paid</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">PO-1021</td>
                                                <td>2025-08-10</td>
                                                <td>Bank Transfer</td>
                                                <td>$520.50</td>
                                                <td>Paid</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">PO-1021</td>
                                                <td>2025-08-10</td>
                                                <td>Bank Transfer</td>
                                                <td>$520.50</td>
                                                <td>Paid</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">PO-1021</td>
                                                <td>2025-08-10</td>
                                                <td>Bank Transfer</td>
                                                <td>$520.50</td>
                                                <td>Paid</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">PO-1021</td>
                                                <td>2025-08-10</td>
                                                <td>Bank Transfer</td>
                                                <td>$520.50</td>
                                                <td>Paid</td>
                                            </tr>
                                            <tr>
                                                <td className="main-td">PO-1021</td>
                                                <td>2025-08-10</td>
                                                <td>Bank Transfer</td>
                                                <td>$520.50</td>
                                                <td>Paid</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default ArtistDetailComponent