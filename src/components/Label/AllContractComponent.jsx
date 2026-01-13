import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import CustomPagination from "../Pagination/CustomPagination";

function AllContractComponent() {
    const { userId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [contracts, setContracts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(1);
    const [totalContracts, setTotalContracts] = useState(0);
    const [labelName, setLabelName] = useState("");

    useEffect(() => {
        if (location.state?.labelName) {
            setLabelName(location.state.labelName);
        } else if (contracts.length > 0) {
            setLabelName(contracts[0]?.userName || "");
        }
    }, [location.state, contracts]);

    const fetchAllContractsForUser = async () => {
        setLoading(true);
        try {
            const res = await apiRequest(
                `/getContractsByUser?userId=${userId}&page=${page}&limit=${perPage}`,
                "GET",
                null,
                true
            );

            if (res.success) {
                setContracts(res.data.data);
                setTotalContracts(res.data.pagination.total);
                setPageCount(res.data.pagination.totalPages);
            } else {
                toast.error("Failed to fetch contracts");
            }
        } catch (err) {
            console.error("Error fetching contracts:", err);
            toast.error("Error fetching contracts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchAllContractsForUser();
        }
    }, [userId, page, perPage]);

    const handlePageChange = (selectedObj) => {
        setPage(selectedObj.selected + 1);
    };

    const handlePerPageChange = (value) => {
        setPerPage(value);
        setPage(1);
    };

    return (
        <section className="rdc-rightbar" id="right-sidebar">
            <div className="main-content-dashboard">
                <div className="mian-sec-heading d-flex justify-content-between align-items-center mian-sec-heading1">
                    <h6>All Contracts for {labelName}</h6>
                    <button className="theme-btn green-cl white-cl" onClick={() => window.history.back()}>
                        <i className="fa-solid fa-arrow-left me-1" /> Back
                    </button>
                </div>

                <div className="dashTabs mainDashboarTabs">
                    {/* CONTRACTS TABLE */}
                    <div className="table-sec mt-3">
                        {loading ? (
                            <Loader />
                        ) : (
                            <table className="rdc-table">
                                <thead>
                                    <tr>
                                        <th>Label Name</th>
                                        <th>Percentage</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contracts.length > 0 ? (
                                        contracts.map((contract, i) => (
                                            <tr key={contract._id}>
                                                <td>{contract.userName}</td>
                                                <td>{contract.labelPercentage}</td>
                                                <td>{new Date(contract.startDate).toISOString().split("T")[0]}</td>
                                                <td>{new Date(contract.endDate).toISOString().split("T")[0]}</td>
                                                <td>{contract.description || 'N/A'}</td>
                                                <td>
                                                    <span
                                                        className={`badge ${contract.status === "active"
                                                            ? "bg-success"
                                                            : contract.status === "Pending"
                                                                ? "bg-warning"
                                                                : "bg-danger"
                                                            }`}
                                                    >
                                                        {contract.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <button className="border-less border-purple color-purple table-button me-1">
                                                            NOC
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: "center" }}>
                                                No contracts found for this label
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* PAGINATION */}
                    {totalContracts > perPage && (
                        <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end" }}>
                            <CustomPagination
                                pageCount={pageCount}
                                currentPage={page}
                                onPageChange={handlePageChange}
                                perPage={perPage}
                                onPerPageChange={handlePerPageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default AllContractComponent;