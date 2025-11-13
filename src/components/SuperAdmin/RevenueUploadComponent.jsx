import React from 'react'

function RevenueUploadComponent() {
    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>Revenue Upload</h6>
                    </div>
                    <div className="row">
                        <div className="col-md-12  stem-col">
                            <div className="dash-charts stem-child">
                                <div className="chart-content-head">
                                    <h5>Upload Royalty/Usage Report</h5>
                                </div>
                                <form className="revenue-upload">
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="artist">
                                                    Platform
                                                </label>
                                                <select className="form-select" name="" id="platform">
                                                    <option value="Spotify">Spotify</option>
                                                    <option value="youtube">Youtube</option>
                                                    <option value="appleMusic">Apple Music</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="startDate">
                                                    Period From
                                                </label>
                                                <input className="form-control" type="date" id="startDate" />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="endDate">
                                                    Period To
                                                </label>
                                                <input className="form-control" type="date" id="endDate" />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <div className="drag-drop-csv">
                                            <div className="csv-icon">
                                                <i className="fa-solid fa-cloud-arrow-up" />
                                            </div>
                                            <p>Drag &amp; drop CSV here</p>
                                            <span>or</span>
                                            <div className="form-group">
                                                <input className="form-control" type="file" />
                                            </div>
                                            <div className="csv-btn">
                                                <button className="border-less">Need a template?</button>
                                                <button className="border-less border-green color-green table-button">
                                                    Download CSV
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="outer-content">
                                        <p>Secure action requires a transaction PIN.</p>
                                        <div className="outer-btn">
                                            <button className="theme-btn purple-cl white-cl">
                                                <i className="fa-solid fa-circle-check me-1" />
                                                Validate Only
                                            </button>
                                            <button
                                                className="theme-btn green-cl white-cl"
                                                data-bs-toggle="modal"
                                                data-bs-target="#processUpload"
                                            >
                                                <i className="fa-solid fa-upload me-1" />
                                                Process Upload
                                            </button>
                                        </div>
                                        <div
                                            className="modal fade artist-tabs"
                                            id="processUpload"
                                            tabIndex={-1}
                                            aria-labelledby="myModalLabel"
                                            aria-hidden="true"
                                        >
                                            <div className="modal-dialog modal-dialog-centered processUpload">
                                                <div className="modal-content">
                                                    <div className="modal-header artist-tab-head">
                                                        <div className="inner-content">
                                                            <p>Enter Transaction PIN</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn-close"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        >
                                                            <i className="fa-solid fa-xmark" />
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <form className="process">
                                                            <div className="form-group">
                                                                <label className="form-label" htmlFor="start-date">
                                                                    PIN (demo: 1234)
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    placeholder="search here"
                                                                    id="start-date"
                                                                />
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer artist-footer">
                                                        <div className="footer-button">
                                                            <button
                                                                type="button"
                                                                className="theme-btn bg-red white-cl"
                                                                data-bs-dismiss="modal"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="theme-btn green-cl white-cl"
                                                            >
                                                                Confirm
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default RevenueUploadComponent