import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";

function LabelSummaryComponent() {
    const [contracts, setContracts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [contractToDelete, setContractToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [contractToRemind, setContractToRemind] = useState(null);
    const [emailLoading, setEmailLoading] = useState(false);
    const [whatsappLoading, setWhatsappLoading] = useState(false);
    const [showRenewModal, setShowRenewModal] = useState(false);
    const [contractToRenew, setContractToRenew] = useState(null);
    const [renewLoading, setRenewLoading] = useState(false);


    const navigate = useNavigate();

    // Fetch contracts
    const fetchContracts = async () => {
        setLoading(true);
        try {
            const res = await apiRequest(
                `/getAllContracts?page=${page}&limit=${perPage}&search=${search}`,
                "GET",
                null,
                true
            );

            if (res.success) {
                setContracts(res.data.data);
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
        fetchContracts();
    }, [page, perPage, search]);

    const handlePageChange = (selectedObj) => {
        setPage(selectedObj.selected + 1);
    };

    const handlePerPageChange = (value) => {
        setPerPage(value);
        setPage(1); // reset to first page
    };

    // Delete Modal Handlers
    const handleDeleteClick = (contract) => {
        setContractToDelete(contract);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setContractToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!contractToDelete) return;
        setDeleteLoading(true);

        try {
            const res = await apiRequest(
                `/deleteContract/${contractToDelete._id}`,
                "DELETE",
                null,
                true
            );

            if (res.success) {
                toast.success("Contract deleted successfully!");
                fetchContracts();
            } else {
                toast.error(res.message || "Failed to delete contract");
            }
        } catch (error) {
            console.error("Error deleting contract:", error);
            toast.error("Error deleting contract");
        } finally {
            setDeleteLoading(false);
            handleCloseDeleteModal();
        }
    };

    const handleAutoRenewContract = (contract) => {
        setContractToRenew(contract);
        setShowRenewModal(true);
    };

    const handleConfirmAutoRenew = async () => {
        if (!contractToRenew) return;

        setRenewLoading(true);

        try {
            const res = await apiRequest(
                `/contracts/auto-renew/${contractToRenew._id}`,
                "POST",
                null,
                true
            );

            if (res.success) {
                toast.success("Contract auto-renewed successfully! New contract created for 1 year.");
                fetchContracts(); // Refresh list to show latest contract
            } else {
                toast.error(res.message || "Failed to auto-renew contract");
            }
        } catch (error) {
            console.error("Error auto-renewing contract:", error);
            toast.error("Error auto-renewing contract. Please try again.");
        } finally {
            setRenewLoading(false);
            setShowRenewModal(false);
            setContractToRenew(null);
        }
    };

    const handleCloseRenewModal = () => {
        setShowRenewModal(false);
        setContractToRenew(null);
        setRenewLoading(false);
    };

    // Reminder Modal Handlers
    const handleReminderClick = (contract) => {
        setContractToRemind(contract);
        setShowReminderModal(true);
    };

    const handleCloseReminderModal = () => {
        // close modal and reset selected contract
        setShowReminderModal(false);
        setContractToRemind(null);
        // optionally also reset loading flags (safe guard)
        setEmailLoading(false);
        setWhatsappLoading(false);
    };

    const handleConfirmReminder = async () => {
        if (!contractToRemind) return;
        setEmailLoading(true);

        try {
            const res = await apiRequest(
                `/sendContractReminder/${contractToRemind._id}`,
                "POST",
                null,
                true
            );

            if (res.success) {
                toast.success("Reminder email sent successfully!");
            } else {
                toast.error(res.message || "Failed to send reminder email");
            }
        } catch (error) {
            console.error("Error sending reminder email:", error);
            toast.error("Error sending reminder email");
        } finally {
            setEmailLoading(false);
            handleCloseReminderModal();
        }
    };

    // const handleSendWhatsappReminder = async (contract) => {
    //     if (!contract) return;
    //     setWhatsappLoading(true);

    //     try {
    //         const res = await apiRequest(
    //             `/sendContractWhatsappReminder/${contract._id}`,
    //             "POST",
    //             null,
    //             true
    //         );

    //         if (res.success) {
    //             toast.success("WhatsApp Reminder sent successfully!");
    //         } else {
    //             toast.error(res.message || "Failed to send WhatsApp reminder");
    //         }
    //     } catch (error) {
    //         console.error("Error sending WhatsApp reminder:", error);
    //         toast.error("Error sending WhatsApp reminder");
    //     } finally {
    //         setWhatsappLoading(false);
    //         handleCloseReminderModal();
    //     }
    // };


    const handleSendWhatsappReminder = () => {
        // Just open WhatsApp Web in a new tab
        window.open("https://web.whatsapp.com/", "_blank");

        // Close modal
        handleCloseReminderModal();
    };


    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>Label Summary</h6>
                    </div>

                    <div className="dashTabs mainDashboarTabs">
                        {/* SEARCH BAR + ADD BUTTON */}
                        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
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

                            <button
                                className="theme-btn green-cl white-cl me-1"
                                onClick={() => navigate(`/superadmin/contract-from`)}
                            >
                                <i className="fa-solid fa-file-signature me-1" />
                                Add New Contract
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
                                            {/* <th>Contract Name</th> */}
                                            <th>Label Name</th>
                                            <th>Percentage</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th className="act">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contracts.length > 0 ? (
                                            contracts.map((contract, i) => (
                                                <tr key={i}>
                                                    {/* <td>{contract.contractName}</td> */}
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
                                                        <button
                                                            className="border-less border-yellow color-yellow table-button me-1"
                                                            onClick={() => handleAutoRenewContract(contract)}

                                                        >
                                                            Auto Renew Contract <i className="fa-solid fa-file-signature me-1"></i>
                                                        </button>
                                                        <button className="border-less border-green color-green table-button me-1"
                                                            onClick={() =>
                                                                navigate(`/label/all-contracts/${contract.user_id}`)
                                                            }
                                                        >
                                                            All Contracts
                                                        </button>
                                                        <button className="border-less border-purple color-purple table-button me-1"
                                                            onClick={() =>
                                                                navigate(`/label/sub-label-summary/${contract.user_id}`)
                                                            }
                                                        >
                                                            Sub Label
                                                        </button>
                                                        {/* <button className="border-less border-purple color-purple table-button me-1">
                                                            NOC
                                                        </button> */}
                                                        <button
                                                            className="border-less border-green color-green table-button me-1"
                                                            onClick={() =>
                                                                navigate(`/label/contract-from/${contract._id}`)
                                                            }
                                                        >
                                                            Edit <i className="fa-solid fa-chevron-right" />
                                                        </button>

                                                        {/* <button
                                                            className="border-less border-red dark-red table-button me-1"
                                                            onClick={() => handleDeleteClick(contract)}
                                                        >
                                                            Delete <i className="fa-solid fa-trash" />
                                                        </button> */}

                                                        <button
                                                            className="border-less border-purple color-purple table-button me-1"
                                                            onClick={() =>
                                                                navigate(`/label/contract-logs/${contract._id}`)
                                                            }
                                                        >
                                                            View Logs <i className="fa-solid fa-right-to-bracket"></i>
                                                        </button>

                                                        <button
                                                            className="border-less border-yellow color-yellow table-button"
                                                            onClick={() => handleReminderClick(contract)}
                                                        >
                                                            Send Reminder <i className="fa-solid fa-envelope"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: "center" }}>
                                                    No Contracts Found
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

                {/* DELETE MODAL */}
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
                                            onClick={handleCloseDeleteModal}
                                            disabled={deleteLoading}
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p>
                                            Are you sure you want to delete contract{" "}
                                            <strong>{contractToDelete?.contractName}</strong>?
                                        </p>
                                        <p className="text-muted small">
                                            Client: {contractToDelete?.userName || "N/A"}
                                        </p>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="theme-btn green-cl white-cl"
                                            onClick={handleCloseDeleteModal}
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

                {/* REMINDER MODAL */}
                {showReminderModal && (
                    <div className="modal-backdrop  show" id="modal-view">
                        <div className="modal d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Send Reminder</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={handleCloseReminderModal}
                                            disabled={emailLoading || whatsappLoading}
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p>
                                            Are you sure you want to send a reminder for contract{" "}
                                            <strong>{contractToRemind?.contractName}</strong>?
                                        </p>
                                        <p className="text-muted small">
                                            Client: {contractToRemind?.userName || "N/A"}
                                        </p>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="theme-btn green-cl white-cl"
                                            onClick={handleCloseReminderModal}
                                            disabled={emailLoading || whatsappLoading}
                                        >
                                            Cancel
                                        </button>

                                        {/* WhatsApp Reminder Button */}
                                        <button
                                            type="button"
                                            className="theme-btn bg-green white-cl"
                                            onClick={() => handleSendWhatsappReminder(contractToRemind)}
                                            disabled={whatsappLoading || emailLoading}
                                        >
                                            {whatsappLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send WhatsApp
                                                </>
                                            )}
                                        </button>

                                        {/* Email Reminder Button */}
                                        <button
                                            type="button"
                                            className="theme-btn navy-cl white-cl"
                                            onClick={handleConfirmReminder}
                                            disabled={emailLoading || whatsappLoading}
                                        >
                                            {emailLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                    Sending...
                                                </>
                                            ) : (
                                                "Send Email"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* AUTO RENEW CONFIRMATION MODAL */}
                {showRenewModal && (
                    <div className="modal-backdrop show">
                        <div className="modal d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            <i className="fa-solid fa-file-signature me-2"></i>
                                            Confirm Auto Renewal
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={handleCloseRenewModal}
                                            disabled={renewLoading}
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p>
                                            Are you sure you want to <strong>auto-renew</strong> this contract?
                                        </p>
                                        <div className="bg-light p-3 rounded mb-3">
                                            <p className="mb-1"><strong>Client:</strong> {contractToRenew?.userName}</p>
                                            <p className="mb-1"><strong>Current Contract Ends:</strong> {new Date(contractToRenew?.endDate).toLocaleDateString()}</p>
                                            <p className="mb-0 text-success">
                                                <strong>New Period:</strong> {(() => {
                                                    const end = new Date(contractToRenew?.endDate);
                                                    const newStart = new Date(end);
                                                    newStart.setDate(newStart.getDate() + 1);
                                                    const newEnd = new Date(newStart);
                                                    newEnd.setFullYear(newEnd.getFullYear() + 1);
                                                    return `${newStart.toLocaleDateString()} → ${newEnd.toLocaleDateString()}`;
                                                })()}
                                            </p>
                                        </div>
                                        <small className="text-muted">
                                            A new contract will be created with the same details (PDF, percentage, etc.).
                                        </small>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="theme-btn green-cl white-cl"
                                            onClick={handleCloseRenewModal}
                                            disabled={renewLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="theme-btn bg-warning text-dark"
                                            onClick={handleConfirmAutoRenew}
                                            disabled={renewLoading}
                                        >
                                            {renewLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                    Renewing...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-rotate-right me-2"></i>
                                                    Auto Renew
                                                </>
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

export default LabelSummaryComponent;
