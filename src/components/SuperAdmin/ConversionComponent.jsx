import React from 'react'

function ConversionComponent() {
    return (
        <>
            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>XSLS XML Conversion</h6>
                    </div>
                    <div className="converter-xml-fx">
                        <div className="converter-content">
                            <form className="convert-from">
                                <p>Upload XLS</p>
                                <div className="form-group">
                                    <input className="form-control" type="file" id="formFile" />
                                </div>
                                <button className="theme-btn green-cl white-cl">Upload</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default ConversionComponent