import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function PayoutComponent() {
    const navigate = useNavigate();

    const [payouts, setPayouts] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchPayouts = async () => {
        setLoading(true);

        const res = await apiRequest(
            `/getAllPayouts?page=${page}&limit=${perPage}`,
            "GET",
            null,
            true
        );

        if (res.success) {
            setPayouts(res.data?.data || []);
            setPageCount(res.data?.pagination?.totalPages || 1);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchPayouts();
    }, [page, perPage]);

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
                    <div className="mian-sec-heading">
                        <h6>Payouts</h6>
                    </div>

                    <div className="d-flex justify-content-end w-100 mb-2">
                        <button
                            className="theme-btn green-cl white-cl me-1"
                            onClick={() => navigate(`/superadmin/bulk-payout`)}
                        >
                            <i className="fa-solid fa-cloud-arrow-up"></i>
                            Upload Bulk
                        </button>
                        <button
                            className="theme-btn green-cl white-cl me-1"
                            onClick={() => navigate(`/superadmin/payout-from`)}
                        >
                            <i className="fa-solid fa-sack-dollar me-1"></i>
                            Pay
                        </button>
                    </div>

                    <div className="table-sec">
                        <table className="rdc-table">
                            <thead>
                                <tr>
                                    <th className="main-th start">Payee</th>
                                    <th>Method</th>
                                    <th>Amount Paid</th>
                                    <th>Comment</th>
                                    <th>Date of Payment</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center">
                                            <Loader small={true} />
                                        </td>
                                    </tr>
                                ) : payouts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center">
                                            No payouts found
                                        </td>
                                    </tr>
                                ) : (
                                    payouts.map((p) => (
                                        <tr key={p._id}>
                                            <td className="main-td">{p.userName || "N/A"}</td>
                                            <td>{p.paymentMethod || "N/A"}</td>
                                            <td>{p.amount || "N/A"}</td>
                                            <td>
                                                <span title={p.description}>
                                                    {p.description
                                                        ? p.description.length > 30
                                                            ? p.description.slice(0, 30) + "..."
                                                            : p.description
                                                        : "N/A"}
                                                </span>
                                            </td>
                                            <td>{p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : "N/A"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end", }}>
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

export default PayoutComponent;
