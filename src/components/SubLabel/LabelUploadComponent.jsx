import React from 'react'

function LabelUploadComponent() {
    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>Label Upload</h6>
                    </div>
                    <div className="converter-xml-fx">
                        <div className="converter-content">
                            <form className="convert-from">
                                <p>Upload Label Master XLS</p>
                                <div className="form-group">
                                    <input className="form-control" type="file" id="formFile" />
                                </div>
                                <button className="theme-btn bg-yellow white-cl">
                                    Download Sample
                                </button>
                                <button className="theme-btn green-cl white-cl">Upload</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default LabelUploadComponent