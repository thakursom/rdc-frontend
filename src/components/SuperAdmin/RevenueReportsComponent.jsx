import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiRequest } from "../../services/api";

function RevenueReportsComponent() {
    const [filters, setFilters] = useState({
        platform: '',
        month: '',
        quarter: '',
        releases: false,
        artist: false,
        track: false,
        partner: false,
        contentType: false,
        format: false,
        territory: false,
        quarters: false,
        page: 1,
        limit: 10
    });

    const [reportData, setReportData] = useState({
        summary: { totalStreams: 0, totalRevenue: 0, platforms: [], artists: [], releases: [] },
        reports: [],
        pagination: { totalRecords: 0, totalPages: 1, currentPage: 1 }
    });

    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

    const currentFiltersRef = useRef(filters);
    const exportStatusRef = useRef({
        isExporting: false,
        startTime: null,
        completed: false,
        failed: false
    });

    useEffect(() => {
        currentFiltersRef.current = filters;
    }, [filters]);

    // Restore export status on mount & tab visibility
    const restoreExportStatus = useCallback(() => {
        try {
            const raw = localStorage.getItem('revenueExportStatus');
            if (!raw) return;
            const status = JSON.parse(raw);

            if (status.completed) {
                setExporting(false);
                setShowExportModal(true);
                exportStatusRef.current = status;
                setTimeout(() => {
                    localStorage.removeItem('revenueExportStatus');
                    setShowExportModal(false);
                    exportStatusRef.current = { isExporting: false, startTime: null, completed: false, failed: false };
                }, 4000);
                return;
            }

            const isRecent = status.startTime && (Date.now() - status.startTime) < 300000;
            if ((status.isExporting || status.failed || isRecent) && !status.completed) {
                setExporting(true);
                setShowExportModal(true);
                exportStatusRef.current = status;
            } else {
                localStorage.removeItem('revenueExportStatus');
            }
        } catch (err) {
            localStorage.removeItem('revenueExportStatus');
        }
    }, []);

    useEffect(() => {
        restoreExportStatus();
    }, [restoreExportStatus]);

    useEffect(() => {
        const handler = () => !document.hidden && restoreExportStatus();
        document.addEventListener('visibilitychange', handler);
        return () => document.removeEventListener('visibilitychange', handler);
    }, [restoreExportStatus]);

    const saveExportStatus = useCallback((updates = {}) => {
        const newStatus = { ...exportStatusRef.current, ...updates };
        exportStatusRef.current = newStatus;
        localStorage.setItem('revenueExportStatus', JSON.stringify(newStatus));
    }, []);

    const clearExportStatus = useCallback(() => {
        localStorage.removeItem('revenueExportStatus');
        exportStatusRef.current = { isExporting: false, startTime: null, completed: false, failed: false };
    }, []);

    const fetchRevenueReport = useCallback(async (filterParams = filters) => {
        setLoading(true);
        try {
            const qp = new URLSearchParams();
            Object.entries(filterParams).forEach(([k, v]) => {
                if (v !== undefined && v !== '' && v !== false) qp.append(k, v);
            });
            const res = await apiRequest(`/revenueReports?${qp.toString()}`, "GET", null, true);
            if (res.success) setReportData(res.data.data);
        } catch (e) { } finally {
            setLoading(false);
        }
    }, [filters]);

    const exportToExcelViaBackend = async () => {
        const originalTitle = document.title;
        document.title = 'Exporting Excel... - Revenue Reports';

        try {
            setExporting(true);
            setShowExportModal(true);
            saveExportStatus({ isExporting: true, startTime: Date.now(), completed: false, failed: false });

            await new Promise(r => setTimeout(r, 3000));

            const exportFilters = { ...currentFiltersRef.current };
            delete exportFilters.page;
            delete exportFilters.limit;

            const qp = new URLSearchParams();
            Object.entries(exportFilters).forEach(([k, v]) => {
                if (v !== undefined && v !== '' && v !== false) {
                    qp.append(k, typeof v === 'boolean' ? v.toString() : v);
                }
            });

            const blob = await apiRequest(`/revenueReports/export/excel?${qp.toString()}`, "GET", null, true, true);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            const ts = new Date().toISOString().split('T')[0];
            const hasFilters = Object.values(exportFilters).some(v => v && v !== false);
            a.href = url;
            a.download = hasFilters ? `Revenue_Report_Filtered_${ts}.xlsx` : `Revenue_Report_All_${ts}.xlsx`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);

            // SUCCESS: Show "Downloaded" message
            saveExportStatus({ isExporting: false, completed: true, failed: false });
            setExporting(false);

            // Auto hide after 4 seconds
            setTimeout(() => {
                clearExportStatus();
                setShowExportModal(false);
            }, 4000);

        } catch (error) {
            saveExportStatus({ isExporting: false, failed: true });
            setExporting(false);
            alert(`Export failed: ${error.message || 'Unknown error'}`);
            setTimeout(() => {
                setShowExportModal(false);
            }, 5000);
        } finally {
            document.title = originalTitle;
        }
    };

    useEffect(() => {
        fetchRevenueReport();
    }, [fetchRevenueReport]);

    const handleFilterChange = (name, value) => setFilters(prev => ({ ...prev, [name]: value }));
    const handleCheckboxChange = name => setFilters(prev => ({ ...prev, [name]: !prev[name] }));
    const handleFilterSubmit = e => { e.preventDefault(); fetchRevenueReport({ ...filters, page: 1 }); };
    const handlePageChange = newPage => {
        const updated = { ...filters, page: newPage };
        setFilters(updated);
        fetchRevenueReport(updated);
    };

    const formatNumber = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formatCurrency = a => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(a);
    const formatDate = d => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';

    const shouldShowModal = showExportModal;

    return (
        <>
            {shouldShowModal && (
                <div className="export-progress-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255,255,255,0.97)', zIndex: 9999,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(3px)'
                }}>
                    <div style={{
                        background: '#fff', padding: '2.5rem', borderRadius: '16px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.15)', textAlign: 'center',
                        maxWidth: '450px', width: '90%'
                    }}>
                        {exportStatusRef.current.completed ? (
                            <>
                                <div style={{ fontSize: '4.5rem', color: '#28a745', marginBottom: '1rem' }}>Checkmark</div>
                                <h4 style={{ color: '#28a745', margin: '0.5rem 0' }}>Downloaded Successfully!</h4>
                                <p style={{ color: '#555' }}>Your Excel file has been downloaded.</p>
                            </>
                        ) : exportStatusRef.current.failed ? (
                            <>
                                <div style={{ fontSize: '4.5rem', color: '#dc3545', marginBottom: '1rem' }}>Cross</div>
                                <h4 style={{ color: '#dc3545' }}>Export Failed</h4>
                                <p style={{ color: '#555' }}>Please try again.</p>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '3.8rem', marginBottom: '1rem' }}>Exporting</div>
                                <h5 style={{ color: '#2c3e50' }}>Exporting to Excel...</h5>
                                <p style={{ color: '#7f8c8d' }}>Please do not close or refresh this page.</p>
                                <div style={{ height: '10px', background: '#e0e0e0', borderRadius: '5px', overflow: 'hidden', margin: '20px 0' }}>
                                    <div style={{
                                        height: '100%', background: '#3ED08E', width: '100%',
                                        animation: 'progress-animation 2s ease-in-out infinite'
                                    }}></div>
                                </div>
                                <small style={{ color: '#666' }}>Export continues even if you switch tabs</small>
                            </>
                        )}
                    </div>
                </div>
            )}

            <section className="rdc-rightbar" id="right-sidebar">
                <div className="main-content-dashboard">
                    <div className="mian-sec-heading">
                        <h6>Revenue Reports</h6>
                        <div className="btn-right-sec">
                            <button
                                className="theme-btn green-cl white-cl me-1"
                                onClick={exportToExcelViaBackend}
                                disabled={loading || exporting}
                            >
                                {exporting ? (
                                    <>Exporting... In Progress</>
                                ) : (
                                    <>Excel Export</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* बाकी सब तुम्हारा पुराना UI same रहेगा */}
                    <div className="revnue-filters">
                        <form className="revenue-filter-fx" onSubmit={handleFilterSubmit}>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
                                    <div className="form-group">
                                        <select className="form-select" value={filters.platform}
                                            onChange={e => handleFilterChange('platform', e.target.value)}
                                            disabled={loading || exporting}>
                                            <option value="">Select Platform</option>
                                            <option value="Apple Music">Apple Music</option>
                                            <option value="Spotify">Spotify</option>
                                            <option value="Gaana">Gaana</option>
                                            <option value="JioSaavn">Jio Saavn</option>
                                            <option value="Facebook">Facebook</option>
                                            <option value="Amazon">Amazon</option>
                                            <option value="TikTok">Tik Tok</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
                                    <div className="form-group">
                                        <select className="form-select" value={filters.month}
                                            onChange={e => handleFilterChange('month', e.target.value)}
                                            disabled={loading || exporting}>
                                            <option value="">Month</option>
                                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
                                    <div className="form-group">
                                        <select className="form-select" value={filters.quarter}
                                            onChange={e => handleFilterChange('quarter', e.target.value)}
                                            disabled={loading || exporting}>
                                            <option value="">Quarter</option>
                                            <option value={1}>Q1 (Jan-Mar)</option>
                                            <option value={2}>Q2 (Apr-Jun)</option>
                                            <option value={3}>Q3 (Jul-Sep)</option>
                                            <option value={4}>Q4 (Oct-Dec)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="rdc-checkbox">
                                {[
                                    { name: 'releases', label: 'Releases' },
                                    { name: 'artist', label: 'Artist' },
                                    { name: 'track', label: 'Track' },
                                    { name: 'partner', label: 'Partner' },
                                    { name: 'contentType', label: 'Content Type' },
                                    { name: 'format', label: 'Format' },
                                    { name: 'territory', label: 'Territory' },
                                    { name: 'quarters', label: 'Quarters' }
                                ].map(item => (
                                    <div className="form-check" key={item.name}>
                                        <input className="form-check-input" type="checkbox"
                                            checked={filters[item.name]}
                                            onChange={() => handleCheckboxChange(item.name)}
                                            id={`check-${item.name}`}
                                            disabled={loading || exporting} />
                                        <label className="form-check-label" htmlFor={`check-${item.name}`}>
                                            {item.label}
                                        </label>
                                    </div>
                                ))}

                                <div className="form-check">
                                    <button type="submit" className="theme-btn green-cl white-cl"
                                        disabled={loading || exporting}>
                                        {loading ? <>Loading...</> : <>Filter</>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="revenue-cards">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="dash-card navy-cl">
                                    <div className="dash-icon">
                                        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M23.4 0.348032C23.78 0.653057 24 1.1131 24 1.59814V16.7994C24 19.0096 21.85 20.7997 19.2 20.7997C16.55 20.7997 14.4 19.0096 14.4 16.7994C14.4 14.5892 16.55 12.7991 19.2 12.7991C19.76 12.7991 20.3 12.8791 20.8 13.0291V7.1936L9.6 9.68381V19.9997C9.6 22.2099 7.45 24 4.8 24C2.15 24 0 22.2099 0 19.9997C0 17.7895 2.15 15.9993 4.8 15.9993C5.36 15.9993 5.9 16.0793 6.4 16.2294V4.7984C6.4 4.04834 6.92 3.39829 7.655 3.23827L22.055 0.0380064C22.53 -0.0670023 23.025 0.048007 23.405 0.353032L23.4 0.348032Z" fill="#4D4E8E" />
                                        </svg>
                                    </div>
                                    <div className="dash-content">
                                        <p>Total Stream</p>
                                        <h6>{formatNumber(reportData.summary.totalStreams)}</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="dash-card parot-cl">
                                    <div className="dash-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#3ED08E" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <line x1={12} x2={12} y1={2} y2={22} />
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                    </div>
                                    <div className="dash-content">
                                        <p>Total Revenue</p>
                                        <h6>{formatCurrency(reportData.summary.totalRevenue)}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-sec">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <table className="rdc-table">
                                    <thead>
                                        <tr>
                                            <th className="main-th start">Date</th>
                                            <th>Platform</th>
                                            <th>Artist</th>
                                            <th>Release</th>
                                            <th>Streams</th>
                                            <th className="last">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.reports.length > 0 ? reportData.reports.map((r, i) => (
                                            <tr key={i}>
                                                <td className="main-td">{formatDate(r.date)}</td>
                                                <td>{r.platform}</td>
                                                <td>{r.artist}</td>
                                                <td>{r.release}</td>
                                                <td>{formatNumber(r.streams)}</td>
                                                <td>{formatCurrency(r.revenue)}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="text-center py-4">No data found</td></tr>
                                        )}
                                    </tbody>
                                </table>

                                {reportData.pagination.totalPages > 1 && (
                                    <div className="d-flex justify-content-center mt-4">
                                        <nav>
                                            <ul className="pagination">
                                                <li className={`page-item ${filters.page === 1 ? 'disabled' : ''}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(filters.page - 1)}
                                                        disabled={filters.page === 1 || loading || exporting}>Previous</button>
                                                </li>
                                                {[...Array(reportData.pagination.totalPages)].map((_, i) => (
                                                    <li key={i} className={`page-item ${filters.page === i + 1 ? 'active' : ''}`}>
                                                        <button className="page-link" onClick={() => handlePageChange(i + 1)}
                                                            disabled={loading || exporting}>{i + 1}</button>
                                                    </li>
                                                ))}
                                                <li className={`page-item ${filters.page === reportData.pagination.totalPages ? 'disabled' : ''}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(filters.page + 1)}
                                                        disabled={filters.page === reportData.pagination.totalPages || loading || exporting}>Next</button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes progress-animation {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </>
    );
}

export default RevenueReportsComponent;