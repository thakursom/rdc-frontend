import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

function SubLabelSummaryComponent() {
    const { userId } = useParams();
    const [labels, setLabels] = useState([]);
    const navigate = useNavigate();

    const fetchSubLabels = async () => {
        const result = await apiRequest(
            `/fetchLabelAndSubLabelContract?id=${userId}`,
            "GET",
            null,
            true
        );

        if (result.success) {
            setLabels(result?.data?.contract);
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
                        <h6>Sub Label Summary</h6>
                        <button
                            className="theme-btn green-cl white-cl"
                            onClick={() => navigate(-1)}
                        >
                            <i className="fa-solid fa-arrow-left me-1" /> Back
                        </button>
                    </div>

                    <div className="table-sec">
                        <table className="rdc-table">
                            <thead>
                                <tr>
                                    <th className="main-th start">Sub Label Name</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {labels.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center" }}>
                                            No contracts found
                                        </td>
                                    </tr>
                                ) : (
                                    labels.map((item, index) => (
                                        <tr key={index}>
                                            <td className="main-td">{item.userName}</td>
                                            <td>{new Date(item.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(item.endDate).toLocaleDateString()}</td>

                                            <td className={item.status === "active" ? "dark-green" : "dark-red"}>
                                                {item.status}
                                            </td>

                                            <td>{item.description || "N/A"}</td>

                                            <td>
                                                <button className="border-less border-purple color-purple table-button me-1">
                                                    NOC
                                                </button>

                                                <button className="border-less border-yellow color-yellow table-button">
                                                    Send Mail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
}

export default SubLabelSummaryComponent;
