import React, { useEffect, useState } from "react";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";
import { apiRequest } from "../../services/api";

function LogComponent() {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);

        const result = await apiRequest(
            `/getAllLogs?page=${page}&limit=${perPage}`,
            "GET",
            null,
            true
        );

        if (result.success) {
            setLogs(result?.data?.data || []);
            setPageCount(result?.data?.totalPages || 1);
        } else {
            console.log("Error Fetching Logs:", result.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
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
                        <h6>Logs</h6>
                    </div>
                    <div className="table-sec">
                        {loading ? (
                            <Loader />
                        ) : (
                            <table className="rdc-table">
                                <thead>
                                    <tr>
                                        <th className="main-th start">Email</th>
                                        <th>Action</th>
                                        <th>Description</th>
                                        <th>IP</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {logs.length > 0 ? (
                                        logs.map((log, i) => (
                                            <tr key={i}>
                                                <td data-label="Email" className="main-td">{log.email || "N/A"}</td>
                                                <td data-label="Action" >{log.action || "N/A"}</td>
                                                <td data-label="Description" >{log.description || "N/A"}</td>
                                                <td data-label="IP" >{log.ip || "N/A"}</td>
                                                <td data-label="Date" >{log.createdAt ? new Date(log.createdAt).toISOString().split("T")[0] : "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center" }}>
                                                No Logs Found
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
    )
}

export default LogComponent