import React, { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";
import { useParams, useNavigate } from "react-router-dom";

function ContractLogComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");

    const formatValue = (value) => {
        if (value === null || value === undefined) return "<empty>";
        if (typeof value === "boolean") return value ? "Yes" : "No";
        if (value instanceof Date || (typeof value === "string" && !isNaN(Date.parse(value)))) {
            return new Date(value).toLocaleDateString();
        }
        if (typeof value === "string" && value.startsWith("http")) {
            return <a href={value} target="_blank" rel="noopener noreferrer">View File</a>;
        }
        return String(value);
    };

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

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchLogs(page, search);
        }, 500);

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

    const isUpdateLog = logs.some(log => log.data?.after);

    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading d-flex justify-content-between align-items-center mian-sec-heading1">
                        <h6>Contract Logs</h6>
                        <button
                            className="theme-btn green-cl white-cl"
                            onClick={() => navigate(-1)}
                        >
                            <i className="fa-solid fa-arrow-left me-1" /> Back
                        </button>
                    </div>

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
                                                <th>{isUpdateLog ? "Updated By" : "Added By"}</th>
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
                                                        <td>{log.updated_by || "N/A"}</td>
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
                            <div className="modal-content" style={{ maxWidth: "800px", width: "90%" }}>
                                <div className="modal-header">
                                    <h5>Log Details</h5>
                                    <button className="close-btn" onClick={closeModal}>
                                        &times;
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <p><strong>Client:</strong> {selectedLog.user?.name} ({selectedLog.user?.email})</p>
                                            <p><strong>Action:</strong> <span className="badge bg-primary">{selectedLog.action}</span></p>
                                            <p><strong>IP Address:</strong> {selectedLog.ipAddress?.replace(/^::ffff:/, "") || "-"}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Date:</strong> {new Date(selectedLog.createdAt).toLocaleString()}</p>
                                            <p><strong>Message:</strong> {selectedLog.message || "-"}</p>
                                        </div>
                                    </div>

                                    <hr />

                                    <h6 className="mb-3">
                                        <i className="fa-solid fa-exchange-alt me-2"></i>
                                        Changes Made
                                    </h6>

                                    {selectedLog.data?.before && selectedLog.data?.after ? (
                                        <>
                                            {(() => {
                                                const before = selectedLog.data.before;
                                                const after = selectedLog.data.after;
                                                const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
                                                const changedFields = Array.from(keys).filter(key =>
                                                    JSON.stringify(before[key]) !== JSON.stringify(after[key])
                                                );

                                                return changedFields.length > 0 ? (
                                                    <div className="table-responsive">
                                                        <table className="table table-sm table-bordered table-striped">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th style={{ width: "30%" }}>Field</th>
                                                                    <th style={{ width: "35%" }}>Previous Value</th>
                                                                    <th style={{ width: "35%" }}>New Value</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {changedFields.map(key => (
                                                                    <tr key={key}>
                                                                        <td><strong>{key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</strong></td>
                                                                        <td>
                                                                            <em className="text-danger">
                                                                                {formatValue(before[key])}
                                                                            </em>
                                                                        </td>
                                                                        <td>
                                                                            <em className="text-success">
                                                                                {formatValue(after[key])}
                                                                            </em>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="alert alert-info">
                                                        <i className="fa-solid fa-info-circle me-2"></i>
                                                        No changes detected in the tracked fields.
                                                    </div>
                                                );
                                            })()}
                                        </>
                                    ) : (
                                        <div className="alert alert-warning">
                                            <i className="fa-solid fa-exclamation-triangle me-2"></i>
                                            No before/after data available for this log.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default ContractLogComponent;
