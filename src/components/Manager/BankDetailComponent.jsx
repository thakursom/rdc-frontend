import { useState, useEffect } from "react";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";

function BankDetailComponent() {
    const [bankDetails, setBankDetails] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bankToDelete, setBankToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    const fetchBankDetails = async () => {
        setLoading(true);

        const res = await apiRequest(
            `/getBankDetails?page=${page}&limit=${perPage}&search=${search}`,
            "GET",
            null,
            true
        );

        if (res.success) {
            setBankDetails(res.data.data);
            setPageCount(res.data.pagination.totalPages);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchBankDetails();
    }, [page, perPage, search]);

    const handlePageChange = (selectedObj) => {
        setPage(selectedObj.selected + 1);
    };

    const handlePerPageChange = (value) => {
        setPerPage(value);
        setPage(1);
    };

    const handleDeleteClick = (bank) => {
        setBankToDelete(bank);
        setShowDeleteModal(true);
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setBankToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!bankToDelete) return;

        setDeleteLoading(true);
        try {
            const res = await apiRequest(
                `/deleteBankDetail/${bankToDelete._id}`,
                "DELETE",
                null,
                true
            );

            if (res.success) {
                fetchBankDetails();
                console.log("Bank detail deleted successfully");
            } else {
                console.error("Failed to delete bank detail:", res.message);
            }
        } catch (error) {
            console.error("Error deleting bank detail:", error);
        } finally {
            setDeleteLoading(false);
            handleCloseModal();
        }
    };

    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>User Bank Details</h6>
                    </div>

                    <div className="dashTabs mainDashboarTabs">

                        {/* SEARCH */}
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
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

                            <button
                                className="theme-btn green-cl white-cl mb-2"
                                onClick={() => navigate(`/manager/bank-details-form`)}
                            >
                                <i className="fa-regular fa-circle-user me-1" />
                                Add Bank Details
                            </button>
                        </div>

                        {/* TABLE */}
                        <div className="table-sec">
                            {loading ? (
                                <Loader />
                            ) : (
                                <table className="rdc-table">
                                    <thead>
                                        <tr>
                                            <th>Client</th>
                                            <th>Payment Method</th>
                                            <th>Details</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {bankDetails.length > 0 ? (
                                            bankDetails.map((b, i) => (
                                                <tr key={i}>
                                                    <td data-label="Client">{b.userName || "N/A"}</td>
                                                    <td data-label="Payment Method" >{b.paymentMethod}</td>
                                                    <td data-label="Details" >
                                                        {b.paymentMethod === "bank" && `Bank: ${b.bankName}, Account: ${b.accountNumber}`}
                                                        {b.paymentMethod === "paypal" && `Email: ${b.paypalEmail}`}
                                                        {b.paymentMethod === "upi" && `UPI ID: ${b.upiId}`}
                                                    </td>

                                                    <td data-label="Action" >
                                                        <button
                                                            className="border-less border-green color-green table-button me-1"
                                                            onClick={() => navigate(`/manager/bank-details-form/${b._id}`)}
                                                        >
                                                            Edit <i className="fa-solid fa-chevron-right" />
                                                        </button>

                                                        <button
                                                            className="border-less border-red dark-red table-button"
                                                            onClick={() => handleDeleteClick(b)}
                                                        >
                                                            Delete <i className="fa-solid fa-trash" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: "center" }}>
                                                    No Records Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* PAGINATION */}
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
                </div>

                {/* DELETE CONFIRMATION MODAL */}
                {showDeleteModal && (
                    <div className="modal-backdrop show">
                        <div className="modal d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Confirm Deletion</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={handleCloseModal}
                                            disabled={deleteLoading}
                                        ><i class="fa-solid fa-xmark"></i></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>
                                            Are you sure you want to delete bank details for{" "}
                                            <strong>{bankToDelete?.userName || "N/A"}</strong>?
                                        </p>
                                        <p className="text-muted small">
                                            Payment Method: {bankToDelete?.paymentMethod}
                                        </p>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="theme-btn green-cl white-cl"
                                            onClick={handleCloseModal}
                                            disabled={deleteLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="theme-btn bg-red white-cl"
                                            onClick={handleConfirmDelete}
                                            disabled={deleteLoading}
                                        >
                                            {deleteLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                "Delete"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}

export default BankDetailComponent;