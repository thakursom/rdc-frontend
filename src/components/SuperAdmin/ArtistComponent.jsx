import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import CustomPagination from "../Pagination/CustomPagination";
import { apiRequest } from "../../../src/services/api";
import AsyncSelect from 'react-select/async';
import Loader from "../Loader/Loader";

function ArtistComponent() {
    const [Artists, setArtists] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(1);
    const [search, setSearch] = useState("");
    const [labelFilter, setLabelFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const loadOptions = async (inputValue) => {
        try {
            const res = await apiRequest(`/fetchAllLabel?search=${inputValue}`, "GET", null, true);

            if (res.success) {
                return res.data?.labels.map(item => ({
                    value: item.id,
                    label: `${item.name}`
                }));
            }
            return [];
        } catch (err) {
            console.log("Dropdown Fetch Error", err);
            return [];
        }
    };


    const fetchArtists = async () => {
        setLoading(true);

        let url = `/fetchAllArtist?page=${page}&limit=${perPage}&search=${search}`;
        if (labelFilter) {
            url = `/fetchUserAndSubUsersArtist?id=${labelFilter}&page=${page}&limit=${perPage}&search=${search}`;
        }

        const result = await apiRequest(url, "GET", null, true);

        if (result.success) {
            setArtists(result?.data?.artists || result.data.artists);
            setPageCount(result?.data?.pagination?.totalPages || 1);
        }
        setLoading(false);
    };


    useEffect(() => {
        fetchArtists();
    }, [page, perPage, search, labelFilter]);


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
                        <h6>Artist</h6>
                    </div>
                    <form className="artist-form">
                        <div className="form-group" style={{ maxWidth: "400px" }}>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadOptions}
                                defaultOptions
                                placeholder="Search Label"
                                isClearable
                                onChange={(selected) => {
                                    if (selected) {
                                        setLabelFilter(selected.value);
                                    } else {
                                        setLabelFilter("");
                                    }
                                    setPage(1);
                                }}
                            />


                        </div>
                    </form>
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
                    <div className="table-sec">
                        <table className="rdc-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "30%" }} className="main-th start">Artist</th>
                                    <th>Country</th>
                                    <th>Stream</th>
                                    <th>Revenue</th>
                                    <th>Action</th>
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
                                    {Artists.length > 0 ? (
                                        Artists.map((art, i) => (
                                            <tr key={i}>
                                                <td className="main-td">{art.name || null}</td>
                                                <td>
                                                    {Array.isArray(art.countries) && art.countries.length > 0
                                                        ? art.countries.join(", ")
                                                        : "N/A"}
                                                </td>
                                                <td>{art.totalStream || 0}</td>
                                                <td>${(art.totalRevenue ?? 0).toFixed(2) || 0}</td>
                                                <td>
                                                    <button
                                                        className="border-less border-green color-green table-button"
                                                        onClick={() =>
                                                            navigate(`/superadmin/artist-details`, {
                                                                state: {
                                                                    totalStream: art.totalStream,
                                                                    totalRevenue: art.totalRevenue,
                                                                    artistName: art.name,
                                                                    countries: art.countries
                                                                }
                                                            })
                                                        }
                                                    >
                                                        Open<i className="fa-solid fa-chevron-right" />
                                                    </button>

                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" style={{ textAlign: "center" }}>No Artists Found</td></tr>
                                    )}
                                </tbody>
                            )}
                        </table>
                    </div>
                    {/* ✅ Pagination */}
                    <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end" }}>
                        <CustomPagination
                            pageCount={pageCount}
                            currentPage={page}
                            onPageChange={handlePageChange}
                            perPage={perPage}
                            onPerPageChange={handlePerPageChange}
                        />
                    </div>

                    <div className="chart-box">
                        <div className="chart-content-head">
                            <h5>Mothly Revenue</h5>
                        </div>
                        <table className="rdc-table rdc-shadow">
                            <thead>
                                <tr>
                                    <th className="main-th start">Rank</th>
                                    <th>Artist</th>
                                    <th>Song Title</th>
                                    <th>Stream</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="main-td">🥇 1</td>
                                    <td>Bruno Mars</td>
                                    <td>Die With a Smile</td>
                                    <td>185,000</td>
                                    <td>$2,850.45</td>
                                </tr>
                                <tr>
                                    <td className="main-td">🥈 2</td>
                                    <td>Halsey&nbsp;</td>
                                    <td>Without Me</td>
                                    <td>170,000</td>
                                    <td>$1,250.45</td>
                                </tr>
                                <tr>
                                    <td className="main-td">🥉 3</td>
                                    <td>Weeknd</td>
                                    <td>Blinding Lights</td>
                                    <td>168,000</td>
                                    <td>$1,250.45</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </section>
        </>
    )
}

export default ArtistComponent