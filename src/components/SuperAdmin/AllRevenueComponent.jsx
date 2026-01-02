import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../../src/services/api";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import CustomPagination from "../Pagination/CustomPagination";

function AllRevenueComponent() {
    const { userId } = useParams();

    const [revenues, setRevenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(1);

    const navigate = useNavigate();

    // Fetch revenue API
    const fetchRevenueData = async () => {
        setLoading(true);

        try {
            const result = await apiRequest(
                `/getRevenueById?userId=${userId}&page=${page}&limit=${perPage}`,
                "GET",
                null,
                true
            );

            if (result.success) {
                setRevenues(result.data.data || []);
                setPageCount(result.data.pagination.totalPages || 1);
            } else {
                toast.error(result.message || "Failed to fetch revenue data");
                setRevenues([]);
            }
        } catch (err) {
            console.error("API Error:", err);
            setError("Something went wrong");
            toast.error("Something went wrong");
            setRevenues([]);
        }

        setLoading(false);
    };


    useEffect(() => {
        fetchRevenueData();
    }, [userId, page, perPage]);

    // Pagination change handler
    const handlePageChange = (selectedObj) => {
        setPage(selectedObj.selected + 1);
    };

    const handlePerPageChange = (value) => {
        setPerPage(value);
        setPage(1); // reset to first page
    };

    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">

                    <div className="mian-sec-heading">
                        <h6>Revenues</h6>
                        <button
                            className="theme-btn green-cl white-cl"
                            onClick={() => navigate(-1)}
                        >
                            <i className="fa-solid fa-arrow-left me-1" /> Back
                        </button>
                    </div>

                    <div className="table-sec">
                        {loading ? (
                            <Loader />
                        ) : (
                            <table className="rdc-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Artist</th>
                                        <th>Tracks</th>
                                        {/* <th>Release Date</th> */}
                                        <th>Label</th>
                                        <th>ISRC</th>
                                        <th>Retailer</th>
                                        <th>Territory</th>
                                        {/* <th>Delivery</th> */}
                                        <th>Net Total</th>
                                        <th>Upload Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {revenues?.length > 0 ? (
                                        revenues.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {(() => {
                                                        const title = item.track_title || item.asset_title || "N/A";
                                                        return (
                                                            <span title={title}>
                                                                {title.length > 30 ? title.slice(0, 30) + "..." : title}
                                                            </span>
                                                        );
                                                    })()}
                                                </td>
                                                <td>{item.track_artist || "N/A"}</td>
                                                <td>{item.track_count || "N/A"}</td>
                                                {/* <td>{item.date || "N/A"}</td> */}
                                                <td>{item.label || item.label_name || "N/A"}</td>
                                                <td>{item.isrc_code || "N/A"}</td>
                                                <td>{item.retailer || "N/A"}</td>
                                                <td>{item.territory || item.country || "N/A"}</td>
                                                {/* <td>{item.delivery || "N/A"}</td> */}
                                                <td>{item.net_total || item.total_revenue || "N/A"}</td>
                                                <td>{item.uploading_date || "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" style={{ textAlign: "center" }}>
                                                No data found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>


                    {/* Pagination */}
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
            </section>
        </>
    );
}

export default AllRevenueComponent;
