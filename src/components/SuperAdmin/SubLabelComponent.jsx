import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

function SubLabelComponent() {
    const { userId } = useParams();
    const [labels, setLabels] = useState([]);

    const fetchSubLabels = async () => {

        const result = await apiRequest(`/fetchSubLabel?parent_id=${userId}`, "GET", null, true);

        if (result.success) {
            setLabels(result?.data?.labels);
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
                    <div className="mian-sec-heading">
                        <h6>Sub Label</h6>
                    </div>
                    <div className="subLabel-button">
                        <div className="btn-left-sec subLabelBtn">
                            <button className="theme-btn green-cl white-cl me-1">
                                <i className="fa-regular fa-circle-user me-1" />
                                Add User
                            </button>
                            <button className="theme-btn green-cl white-cl me-1">
                                <i className="fa-solid fa-arrow-up-from-bracket me-1" />
                                Bulk Partner Upload
                            </button>
                            <button className="theme-btn green-cl white-cl">
                                <i className="fa-solid fa-arrow-up-right-from-square me-1" />
                                Export Label
                            </button>
                        </div>
                        <div className="btn-right-sec">
                            <button className="theme-btn purple-cl white-cl">
                                Generate Invoice
                            </button>
                        </div>
                    </div>
                    <form className="subLable-form">
                        <div className="form-group">
                            <div className="form-sec">
                                <select className="form-select" id="label">
                                    <option value="All Status">All Status</option>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-sec">
                                <i className="fa-solid fa-magnifying-glass" />
                                <input
                                    className="form-control"
                                    type="search"
                                    placeholder="search here"
                                />
                            </div>
                        </div>
                    </form>
                    <div className="table-sec">
                        <div className="table-head">
                            <h6>Manage Label</h6>
                        </div>
                        <table className="rdc-table">
                            <thead>
                                <tr>
                                    <th className="main-th start">Label</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Contract Status</th>
                                    <th>Revenuse</th>
                                    <th style={{ width: "20%" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {labels.length > 0 ? (
                                    labels.map((l, i) => (
                                        <tr key={i}>
                                            <td className="main-td">
                                                {/* <img
                                                    className="me-2"
                                                    src="./assets/Img/userImg.jpg"
                                                // alt="Not Found"
                                                />{" "} */}
                                                {l.role || "N/A"}
                                            </td>
                                            <td>{l.name || "N/A"}</td>
                                            <td> {l.email || "N/A"}</td>
                                            <td className="dark-green">Active</td>
                                            <td className="user-status">50,000</td>
                                            <td>
                                                <button className="border-less border-purple color-purple me-1 table-button ">
                                                    <i className="fa-regular fa-file-lines me-1" /> Pdf
                                                </button>
                                                <button className="border-less border-green color-green me-1 table-button ">
                                                    <i className="fa-regular fa-pen-to-square" /> Edit
                                                </button>
                                                <button className="border-less border-red dark-red table-button ">
                                                    <i className="fa-regular fa-trash-can" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" style={{ textAlign: "center" }}>No Users Found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        </>
    )
}

export default SubLabelComponent