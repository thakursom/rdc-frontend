import React from 'react'

function SettingComponent() {
    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>Setting</h6>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-6 stem-col">
                            <div className="dash-charts stem-child">
                                <div className="chart-content-head">
                                    <h5>Global Splits (Default)</h5>
                                </div>
                                <form className="setting-form">
                                    <div className="row ">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="artist">
                                                    Artist
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="artist"
                                                    placeholder={60}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="label">
                                                    Label
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="label"
                                                    placeholder={30}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3 py-3">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="producer">
                                                    Producer
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="producer"
                                                    placeholder={10}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <button className="theme-btn green-cl white-cl">Save</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-6 stem-col">
                            <div className="dash-charts stem-child">
                                <div className="chart-content-head">
                                    <h5>Taxes &amp; Withholding</h5>
                                </div>
                                <form className="setting-form">
                                    <div className="row ">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="artist">
                                                    Jurisdiction
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="artist"
                                                    placeholder="e.g : US-CA,JM,TT"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="label">
                                                    Rate (%)
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="label"
                                                    placeholder={15}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3 py-3">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="producer">
                                                    Producer
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="producer"
                                                    placeholder={10}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <button className="border-less border-green color-green table-button me-2">
                                                Add Rule
                                            </button>
                                            <button className="theme-btn green-cl white-cl">Save</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default SettingComponent