import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import CustomPagination from "../Pagination/CustomPagination";
import { apiRequest } from "../../../src/services/api";
import Loader from "../Loader/Loader";

function UserManagementComponent() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("label");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);

    const result = await apiRequest(`/fetchAllUser?page=${page}&filterRole=${filterRole}&search=${search}`, "GET", null, true);

    if (result.success) {
      setUsers(result.data.users);
      setTotalPages(result.data.pagination.totalPages);
    } else {
      console.log("Error Fetching Users", result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [filterRole, page, search]);


  // Handle pagination click
  const handlePageChange = (selectedObj) => {
    setPage(selectedObj.selected + 1);
  };

  return (
    <>
      <section className="rdc-rightbar" id="right-sidebar">
        <div className="main-content-dashboard">
          <div className="mian-sec-heading">
            <h6>User Managment</h6>
          </div>

          <div className="dashTabs mainDashboarTabs">
            {/* Tabs Same */}
            <ul className="nav nav-tabs" role="tablist" style={{ marginBottom: "15px" }}>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${filterRole === "label" ? "active" : ""}`}
                  role="tab"
                  onClick={() => {
                    setFilterRole("label");
                    setPage(1);
                  }}
                >
                  Label
                </button>

              </li>

              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${filterRole === "manager" ? "active" : ""}`}
                  role="tab"
                  onClick={() => {
                    setFilterRole("manager");
                    setPage(1);
                  }}
                >
                  Manager
                </button>

              </li>
            </ul>

            {/*Table */}

            <div className="d-flex justify-content-between align-items-center">
              <div className="form-sec" style={{ marginBottom: "15px", width: "300px" }}>
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

              <button className="theme-btn green-cl white-cl me-1"
                onClick={() => navigate(`/superadmin/add-user`)}
              >
                <i className="fa-regular fa-circle-user me-1" />
                Add User
              </button>
            </div>

            <div className="table-sec">
              {loading ? (
                <Loader />
              ) : (
                <table className="rdc-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Roles</th>
                      {/* <th>ThirdPartyUsername</th> */}
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {users.length > 0 ? (
                      users.map((u, i) => (
                        <tr key={i}>
                          <td>{u.name || "N/A"}</td>
                          <td>{u.email || "N/A"}</td>
                          <td>{u.role || "N/A"}</td>
                          {/* <td>{u.third_party_username || "N/A"}</td> */}
                          <td>
                            <button className="border-less border-purple color-purple table-button me-1">
                              <a className="color-purple" href="#">
                                View
                              </a>{" "}
                              <i className="fa-solid fa-chevron-right" />
                            </button>
                            <button className="border-less border-green color-green table-button"
                              onClick={() => navigate(`/superadmin/sub-label/${u.id}`)}
                            >
                              Sub Label <i className="fa-solid fa-chevron-right" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" style={{ textAlign: "center" }}>No Users Found</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>


            {/* Pagination */}
            <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end" }}>
              <CustomPagination
                pageCount={totalPages}
                onPageChange={handlePageChange}
                currentPage={page}
              />
            </div>


          </div>
        </div>
      </section>
    </>
  );
}

export default UserManagementComponent;
