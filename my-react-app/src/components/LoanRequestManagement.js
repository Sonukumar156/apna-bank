import { useState, useEffect, useCallback } from 'react'
import { requestLoan, fetchAllLoanRequests, fetchUserLoanRequests, updateLoanStatus, payLoan } from '../api'

// ─── Toast Notification ──────────────────────────────────────────────────────
function Toast({ toasts }) {
    return (
        <div className="fixed top-5 right-5 z-[999] flex flex-col gap-3 pointer-events-none">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border max-w-sm animate-in slide-in-from-right-5 duration-300
                        ${t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                          t.type === 'error'   ? 'bg-rose-50 border-rose-200 text-rose-800' :
                                                 'bg-blue-50 border-blue-200 text-blue-800'}`}
                >
                    {/* Icon */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-bold
                        ${t.type === 'success' ? 'bg-emerald-500' : t.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'}`}>
                        {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'i'}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5 opacity-60">
                            {t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : 'Info'}
                        </p>
                        <p className="text-sm font-bold leading-snug">{t.message}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Details Modal ───────────────────────────────────────────────────────────
function LoanDetailsModal({ req, onClose }) {
    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loan Receipt</p>
                        <h3 className="text-xl font-bold text-white mt-0.5">Disbursement Details</h3>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-8 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Detail label="Member Name" value={req.memberName} />
                        <Detail label="Loan Amount" value={`₹${req.amount.toLocaleString()}`} highlight />
                        <Detail label="Requested Rate" value={`${req.requestedInterestRate ?? '—'}%`} />
                        <Detail label="Requested Duration" value={req.requestedDuration ? `${req.requestedDuration} Months` : '—'} />
                        <Detail label="Final Interest Rate" value={req.interestRate != null ? `${req.interestRate}%` : '—'} />
                        <Detail label="Final Duration" value={req.duration ? `${req.duration} Months` : '—'} />
                        <Detail label="Request Date" value={req.requestDate} />
                        <Detail label="Payment Date" value={req.paymentDate || '—'} />
                        <Detail label="Purpose" value={req.purpose} />
                        {req.adminRemarks && <Detail label="Admin Remarks" value={req.adminRemarks} />}
                    </div>
                    {req.transactionId && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" /></svg>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Transaction ID</p>
                                <p className="text-sm font-bold text-slate-900 mt-0.5">{req.transactionId}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="px-8 pb-8">
                    <button onClick={onClose} className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold uppercase tracking-widest text-sm hover:bg-slate-700 transition-all">
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

function Detail({ label, value, highlight }) {
    return (
        <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`font-bold ${highlight ? 'text-blue-600 text-base' : 'text-slate-800 text-sm'}`}>{value}</p>
        </div>
    )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LoanRequestManagement({ user, isAdmin, onRefresh }) {
    const [loanRequests, setLoanRequests] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showRequestForm, setShowRequestForm] = useState(false)
    const [formData, setFormData] = useState({ amount: '', purpose: '', requestedInterestRate: '2', requestedDuration: '12' })
    const [adminRemarks, setAdminRemarks] = useState('')
    const [processingRequestId, setProcessingRequestId] = useState(null)
    const [processingType, setProcessingType] = useState(null)
    const [formError, setFormError] = useState('')
    const [viewingDetails, setViewingDetails] = useState(null)
    const [rowPayDetails, setRowPayDetails] = useState({})
    const [toasts, setToasts] = useState([])

    // Toast helper
    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
    }, [])

    useEffect(() => { loadLoanRequests() }, [])

    const loadLoanRequests = async () => {
        try {
            const data = isAdmin ? await fetchAllLoanRequests() : await fetchUserLoanRequests(user._id)
            setLoanRequests(data)
            const defaults = {}
            data.forEach(req => {
                defaults[req._id] = {
                    interestRate: String(req.requestedInterestRate ?? 2),
                    duration: String(req.requestedDuration ?? 12)
                }
            })
            setRowPayDetails(defaults)
        } catch (err) {
            console.error('Failed to load loan requests:', err)
        }
    }

    const handleRequestSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormError('')
        try {
            await requestLoan({
                userId: user._id,
                amount: parseFloat(formData.amount),
                purpose: formData.purpose,
                requestedInterestRate: parseFloat(formData.requestedInterestRate),
                requestedDuration: parseInt(formData.requestedDuration)
            })
            setFormData({ amount: '', purpose: '', requestedInterestRate: '2', requestedDuration: '12' })
            setShowRequestForm(false)
            await loadLoanRequests()
            showToast('Loan request submitted! Admin will review it shortly.', 'success')
        } catch (err) {
            setFormError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateStatus = async (requestId, newStatus) => {
        setProcessingRequestId(requestId)
        setProcessingType('status')
        try {
            await updateLoanStatus(requestId, newStatus, adminRemarks)
            setAdminRemarks('')
            await loadLoanRequests()
            showToast(
                newStatus === 'approved' ? 'Loan request approved. Member has been notified.' : 'Loan request rejected. Member has been notified.',
                newStatus === 'approved' ? 'success' : 'error'
            )
        } catch (err) {
            showToast(err.message, 'error')
        } finally {
            setProcessingRequestId(null)
            setProcessingType(null)
        }
    }

    const handlePayLoan = async (requestId) => {
        setProcessingRequestId(requestId)
        setProcessingType('pay')
        try {
            const details = rowPayDetails[requestId] || { interestRate: '2', duration: '12' }
            await payLoan(requestId, details)
            await loadLoanRequests()
            if (onRefresh) onRefresh()
            showToast('Loan disbursed successfully! Receipt has been emailed to the member.', 'success')
        } catch (err) {
            showToast(err.message, 'error')
        } finally {
            setProcessingRequestId(null)
            setProcessingType(null)
        }
    }

    const updateRowPayDetails = (reqId, field, val) => {
        setRowPayDetails(prev => ({ ...prev, [reqId]: { ...(prev[reqId] || {}), [field]: val } }))
    }

    const statusBadge = (status) => {
        const map = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            approved: 'bg-blue-100 text-blue-800 border-blue-200',
            rejected: 'bg-red-100 text-red-800 border-red-200',
            paid: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        }
        return map[status] || 'bg-gray-100 text-gray-800 border-gray-200'
    }

    const DURATION_OPTIONS = [3, 6, 9, 12, 18, 24, 36, 48, 60]
    const RATE_OPTIONS = [1, 1.5, 2, 2.5, 3, 4, 5]

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Toast Notifications */}
            <Toast toasts={toasts} />

            {/* Details Modal */}
            {viewingDetails && <LoanDetailsModal req={viewingDetails} onClose={() => setViewingDetails(null)} />}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">{isAdmin ? 'Manage Loan Requests' : 'My Loan Requests'}</h3>
                    <p className="text-sm text-slate-500 mt-1">{isAdmin ? 'Review, approve and disburse member loan requests' : 'Submit and track your loan applications'}</p>
                </div>
                {!isAdmin && (
                    <button onClick={() => setShowRequestForm(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                        + Request Loan
                    </button>
                )}
            </div>

            {/* Member Request Form */}
            {!isAdmin && showRequestForm && (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4 duration-300">
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Submit a Loan Request</h4>
                    <p className="text-xs text-slate-400 mb-6">Fill in the details below. Admin will review and finalise the terms.</p>

                    {formError && (
                        <div className="mb-4 p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm font-bold text-rose-600 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                            <span className="w-5 h-5 bg-rose-500 rounded-full text-white flex items-center justify-center text-xs shrink-0">✕</span>
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleRequestSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Loan Amount (₹)</label>
                                <input type="number" required min="1000" value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                    placeholder="e.g. 50000" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Purpose</label>
                                <input type="text" required value={formData.purpose}
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                    placeholder="e.g. Medical, Business, Home" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Requested Interest Rate %</label>
                                <select value={formData.requestedInterestRate}
                                    onChange={(e) => setFormData({ ...formData, requestedInterestRate: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                                    {RATE_OPTIONS.map(r => <option key={r} value={r}>{r}%</option>)}
                                </select>
                                <p className="text-[10px] text-slate-400 mt-1">Admin may adjust at disbursement</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Requested Duration</label>
                                <select value={formData.requestedDuration}
                                    onChange={(e) => setFormData({ ...formData, requestedDuration: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                                    {DURATION_OPTIONS.map(d => <option key={d} value={d}>{d} Months</option>)}
                                </select>
                                <p className="text-[10px] text-slate-400 mt-1">Admin may adjust at disbursement</p>
                            </div>
                        </div>

                        {formData.amount && (
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 grid grid-cols-3 gap-3 text-center">
                                <div><p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">Amount</p><p className="font-bold text-blue-700 text-sm">₹{parseFloat(formData.amount || 0).toLocaleString()}</p></div>
                                <div><p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">Rate</p><p className="font-bold text-blue-700 text-sm">{formData.requestedInterestRate}%</p></div>
                                <div><p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">Duration</p><p className="font-bold text-blue-700 text-sm">{formData.requestedDuration} Months</p></div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-1">
                            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-md">
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                            <button type="button" onClick={() => { setShowRequestForm(false); setFormError('') }} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-slate-200 transition-all">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                {isAdmin && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>}
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Purpose</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Req. Terms</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{isAdmin ? 'Actions' : 'Details'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loanRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center text-slate-400 font-medium italic text-sm">No loan requests found.</td>
                                </tr>
                            ) : loanRequests.map((req) => (
                                <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5 text-sm text-slate-600 font-medium whitespace-nowrap">{req.requestDate}</td>

                                    {isAdmin && (
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-900 text-sm">{req.memberName}</p>
                                            <p className="text-xs text-slate-400">{req.memberEmail}</p>
                                        </td>
                                    )}

                                    <td className="px-6 py-5 font-bold text-slate-900">₹{req.amount.toLocaleString()}</td>
                                    <td className="px-6 py-5 text-sm text-slate-600 max-w-[120px] truncate">{req.purpose}</td>

                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase">Rate</span>
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{req.requestedInterestRate ?? 2}%</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase">Dur.</span>
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">{req.requestedDuration ?? 12}m</span>
                                        </div>
                                        {req.status === 'paid' && req.interestRate != null && (req.interestRate !== req.requestedInterestRate || req.duration !== req.requestedDuration) && (
                                            <p className="text-[9px] text-orange-500 font-bold mt-1">Admin modified</p>
                                        )}
                                    </td>

                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge(req.status)}`}>
                                            {req.status}
                                        </span>
                                        {req.adminRemarks && <p className="text-[10px] text-slate-400 mt-1 italic max-w-[110px] truncate">"{req.adminRemarks}"</p>}
                                    </td>

                                    <td className="px-6 py-5">
                                        {isAdmin ? (
                                            <>
                                                {req.status === 'pending' && (
                                                    <div className="flex flex-col gap-2 min-w-[180px]">
                                                        <input type="text" placeholder="Remarks (optional)"
                                                            value={processingRequestId === req._id ? adminRemarks : ''}
                                                            onChange={(e) => { setProcessingRequestId(req._id); setAdminRemarks(e.target.value) }}
                                                            className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50" />
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleUpdateStatus(req._id, 'approved')} disabled={processingRequestId === req._id && processingType === 'status'}
                                                                className="flex-1 bg-emerald-600 text-white px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-emerald-700 transition-all disabled:opacity-50">✓ Approve</button>
                                                            <button onClick={() => handleUpdateStatus(req._id, 'rejected')} disabled={processingRequestId === req._id && processingType === 'status'}
                                                                className="flex-1 bg-rose-600 text-white px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-rose-700 transition-all disabled:opacity-50">✗ Reject</button>
                                                        </div>
                                                    </div>
                                                )}

                                                {req.status === 'approved' && (
                                                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-3 min-w-[190px]">
                                                        <p className="text-[9px] font-bold text-blue-600 uppercase tracking-wide">
                                                            Req: {req.requestedInterestRate}% / {req.requestedDuration}m
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Final Rate %</label>
                                                                <select value={rowPayDetails[req._id]?.interestRate ?? req.requestedInterestRate ?? '2'}
                                                                    onChange={(e) => updateRowPayDetails(req._id, 'interestRate', e.target.value)}
                                                                    className="w-full text-xs p-1.5 border border-slate-200 rounded-lg outline-none bg-white">
                                                                    {RATE_OPTIONS.map(r => <option key={r} value={r}>{r}%</option>)}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Final Months</label>
                                                                <select value={rowPayDetails[req._id]?.duration ?? req.requestedDuration ?? '12'}
                                                                    onChange={(e) => updateRowPayDetails(req._id, 'duration', e.target.value)}
                                                                    className="w-full text-xs p-1.5 border border-slate-200 rounded-lg outline-none bg-white">
                                                                    {DURATION_OPTIONS.map(d => <option key={d} value={d}>{d}m</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handlePayLoan(req._id)} disabled={processingRequestId === req._id && processingType === 'pay'}
                                                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase hover:bg-blue-700 transition-all shadow-md disabled:opacity-50">
                                                            {processingRequestId === req._id && processingType === 'pay' ? 'Processing...' : '💸 Pay Amount'}
                                                        </button>
                                                    </div>
                                                )}

                                                {req.status === 'rejected' && <span className="text-[10px] text-rose-500 font-bold">Rejected</span>}

                                                {req.status === 'paid' && (
                                                    <button onClick={() => setViewingDetails(req)}
                                                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wide hover:bg-blue-600 transition-all shadow-sm">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                        View Details
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            req.status === 'paid' ? (
                                                <button onClick={() => setViewingDetails(req)}
                                                    className="flex items-center gap-1.5 text-blue-600 font-bold text-xs hover:text-blue-700 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    View Details
                                                </button>
                                            ) : <span className="text-xs text-slate-300">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
