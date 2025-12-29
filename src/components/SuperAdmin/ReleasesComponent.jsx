import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import CustomPagination from "../Pagination/CustomPagination";
import { apiRequest } from "../../services/api";
import Loader from "../Loader/Loader";

function ReleasesComponent() {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(1);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const fetchReleases = async () => {
        setLoading(true);

        const response = await apiRequest(`/releases?page=${page}&limit=${perPage}&search=${search}`, "GET", null, true);

        if (response.success) {
            setReleases(response.data.releases || []);
            setPageCount(response.data.pagination?.totalPages || 1);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchReleases();
    }, [page, perPage, search]);

    const handlePageChange = (obj) => {
        setPage(obj.selected + 1);
    };

    const handlePerPageChange = (value) => {
        setPerPage(value);
        setPage(1);
    };

    return (
        <section className="rdc-rightbar" id="right-sidebar">
            <div className="main-content-dashboard">
                <div className="mian-sec-heading">
                    <h6>Releases</h6>
                </div>

                {/* Search */}
                <div className="form-sec" style={{ marginBottom: "15px", maxWidth: "400px" }}>
                    <i className="fa-solid fa-magnifying-glass" />
                    <input
                        className="form-control"
                        type="search"
                        placeholder="search here"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {/* Table */}
                <div className="table-sec">
                    <table className="rdc-table">
                        <thead>
                            <tr>
                                <th className="main-th start">UPC</th>
                                <th>Title</th>
                                <th>Artist</th>
                                <th>Tracks</th>
                                <th>Release Date</th>
                                <th className="last" style={{ width: "20%" }}>
                                    Action
                                </th>
                            </tr>
                        </thead>

                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    <Loader small={true} />
                                </td>
                            </tr>
                        ) : (
                            <tbody>
                                {releases.length > 0 ? (
                                    releases.map((rel, i) => (
                                        <tr key={i}>
                                            <td className="main-td">{rel.upc_number || 'N/A'}</td>
                                            <td>{rel.title || 'N/A'}</td>
                                            <td>
                                                {(rel.display_artist || []).join(", ") || rel.artists || 'N/A'}
                                            </td>
                                            <td>{rel.total_tracks || 0}</td>
                                            <td>{rel.release_date ? new Date(rel.release_date).toISOString().split("T")[0] : 'N/A'}</td>
                                            <td>
                                                <button
                                                    className="border-less border-purple color-purple table-button me-1"
                                                    onClick={() => navigate(`/superadmin/release-details`, { state: rel })}
                                                >
                                                    View <i className="fa-solid fa-chevron-right" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center" }}>
                                            No Releases Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        )}
                    </table>
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
    );
}

export default ReleasesComponent;
