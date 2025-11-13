import React, { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";
import { useParams, useNavigate } from "react-router-dom";

function ContractLogComponent() {
    const { id } = useParams();
    // ✅ Assuming you have a route like /contracts/:contract_id/logs
    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Pagination + Search
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");

    // ✅ Fetch Logs for given contract_id
    const fetchLogs = async (pageNumber = 1, searchTerm = "") => {
        try {
            setLoading(true);

            const res = await apiRequest(
                `/getContractLogById?contract_id=${id}&page=${pageNumber}&search=${encodeURIComponent(searchTerm)}`,
                "GET",
                null,
                true
            );

            if (res.success) {
                setLogs(res.data?.data || []);
                setTotalPages(res.data?.pagination?.totalPages || 0);
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Load logs when component mounts or page/search changes
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchLogs(page, search);
        }, 500); // debounce

        return () => clearTimeout(delay);
    }, [page, search, id]);

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
    };

    const handleViewLog = (log) => {
        setSelectedLog(log);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedLog(null);
    };

    return (
        <section className="rdc-rightbar" id="right-sidebar">
            <div className="main-content-dashboard">
                {/* Header with Back button + Search */}
                <div className="mian-sec-heading d-flex justify-content-between align-items-center">
                    <h6>Contract Logs</h6>
                    <button
                        className="theme-btn green-cl white-cl"
                        onClick={() => navigate(-1)}
                    >
                        <i className="fa-solid fa-arrow-left me-1" /> Back
                    </button>
                </div>

                {/* Table Section */}
                <div>
                    {loading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "300px",
                            }}
                        >
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <div className="table-sec">
                                <table className="rdc-table">
                                    <thead>
                                        <tr>
                                            <th>Client</th>
                                            <th>Action</th>
                                            <th>IP Address</th>
                                            <th>Date</th>
                                            <th>View</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.length > 0 ? (
                                            logs.map((log) => (
                                                <tr key={log._id}>
                                                    <td>{log.user?.name || "N/A"}</td>
                                                    <td>{log.action}</td>
                                                    <td>{log.ipAddress?.replace(/^::ffff:/, "") || "-"}</td>
                                                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                                                    <td>
                                                        <button
                                                            className="purple-cl white-cl icon-btn"
                                                            onClick={() => handleViewLog(log)}
                                                        >
                                                            <i className="fa-solid fa-eye" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: "center" }}>
                                                    No logs found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {/* <div
                                style={{
                                    marginTop: "25px",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <CustomPagination
                                    pageCount={totalPages}
                                    onPageChange={handlePageChange}
                                    currentPage={page}
                                />
                            </div> */}
                        </>
                    )}
                </div>

                {/* Modal */}
                {showModal && selectedLog && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>Log Details</h5>
                                <button className="close-btn" onClick={closeModal}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    <strong>Client:</strong> {selectedLog.user?.name} ({selectedLog.user?.email})
                                </p>
                                <p>
                                    <strong>Action:</strong> {selectedLog.action}
                                </p>
                                <p>
                                    <strong>Message:</strong> {selectedLog.message}
                                </p>
                                <p>
                                    <strong>IP:</strong>{" "}
                                    {selectedLog.ipAddress?.replace(/^::ffff:/, "") || "-"}
                                </p>
                                <p>
                                    <strong>Date:</strong> {new Date(selectedLog.createdAt).toLocaleString()}
                                </p>
                                <hr />
                                <h6>Full Data (JSON)</h6>
                                <pre
                                    style={{
                                        background: "#f8f9fa",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        overflowX: "auto",
                                    }}
                                >
                                    {JSON.stringify(selectedLog.data, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default ContractLogComponent;
