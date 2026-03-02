import { useState, useEffect } from 'react'
import AdminOverview from './AdminOverview'
import MemberOverview from './MemberOverview'
import MemberFinancials from './MemberFinancials'
import MemberHistory from './MemberHistory'
import AdminPaymentHistory from './AdminPaymentHistory'
import AdminBonusManagement from './AdminBonusManagement'
import ProfileModal from './ProfileModal'
import ReceiptModal from './ReceiptModal'
import { sendSMS } from '../utils/smsService'
import { getStats, addTransaction } from '../api'

export default function Dashboard({ user, onLogout }) {
    const isAdmin = user.role === 'admin'
    const [activeTab, setActiveTab] = useState(isAdmin ? 'Overview' : 'My Profile')
    const [members, setMembers] = useState([])
    const [currentUser, setCurrentUser] = useState(user)
    const [showLoanModal, setShowLoanModal] = useState(false)
    const [selectedMemberForLoan, setSelectedMemberForLoan] = useState(null)
    const [loanForm, setLoanForm] = useState({ amount: '', interestRate: '2', duration: '12' })
    const [showProfile, setShowProfile] = useState(false)
    const [selectedMemberForView, setSelectedMemberForView] = useState(null)
    const [viewingReceipt, setViewingReceipt] = useState(null)
    const [stats, setStats] = useState({
        totalMembers: 0, totalCollection: 0, pendingAmount: 0, activeLoans: 0,
        outstandingLoan: 0, paidLoans: 0, dueLoans: 0, totalInterest: 0
    })

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loanError, setLoanError] = useState('')

    useEffect(() => { refreshData() }, [])

    // Close sidebar on tab change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false)
    }, [activeTab])

    const refreshData = async () => {
        try {
            const { members: memberList, stats: systemStats } = await getStats()
            setMembers(memberList)
            setStats({
                ...systemStats,
                totalInterest: systemStats.totalInterest || 0
            })

            // Update currentUser from the list
            const updatedSelf = memberList.find(m => m.email === user.email) || user
            setCurrentUser(updatedSelf)
        } catch (err) {
            console.error('Failed to refresh data:', err)
        }
    }

    const handleMemberPayment = async (type, amount = 0) => {
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
            let txnType = type === 'society' ? 'Society Fund' : 'Loan Payment'
            let description = type === 'society'
                ? `Monthly contribution for ${new Date().toLocaleString('default', { month: 'long' })}`
                : `Loan repayment towards principal + interest`

            const txn = await addTransaction({
                userId: currentUser._id,
                type: txnType,
                amount: type === 'society' ? (currentUser.planAmount || 1000) : amount,
                description
            })

            await refreshData()
        } catch (err) {
            alert('Payment failed: ' + err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleCollection = async (memberEmail) => {
        if (isSubmitting) return
        const m = members.find(mem => mem.email === memberEmail)
        if (!m) return

        setIsSubmitting(true)
        try {
            const planAmount = m.planAmount || 1000
            const txn = await addTransaction({
                userId: m._id,
                type: 'Society Fund',
                amount: planAmount,
                description: `Monthly contribution collected by Admin for ${new Date().toLocaleString('default', { month: 'long' })}`
            })

            await refreshData()
        } catch (err) {
            alert('Collection failed: ' + err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteMember = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this member and all their records?')) return
        try {
            const { deleteMember } = await import('../api')
            await deleteMember(userId)
            await refreshData()
        } catch (err) {
            alert('Delete failed: ' + err.message)
        }
    }

    const issueLoan = async (e) => {
        e.preventDefault()
        if (!selectedMemberForLoan || isSubmitting) return
        setLoanError('')

        // Frontend check for active loan
        if (selectedMemberForLoan.financials?.loan?.active && selectedMemberForLoan.financials?.loan?.remaining > 0) {
            setLoanError('User already has an active loan. Please clear it first.')
            return
        }

        setIsSubmitting(true)
        try {
            const amount = parseFloat(loanForm.amount)
            const txn = await addTransaction({
                userId: selectedMemberForLoan._id,
                type: 'Loan Issued',
                amount: amount,
                interestRate: parseFloat(loanForm.interestRate),
                duration: loanForm.duration,
                description: `Loan of ₹${amount.toLocaleString()} approved with ${loanForm.interestRate}% interest`
            })

            setShowLoanModal(false)
            setLoanForm({ amount: '', interestRate: '2', duration: '12' })
            setSelectedMemberForLoan(null)
            await refreshData()
        } catch (err) {
            setLoanError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleViewReceipt = (transaction, member = null) => {
        setViewingReceipt({ transaction, user: member || currentUser })
    }

    const navItems = isAdmin
        ? ['Overview', 'Member List', 'Monthly Collection', 'Loan Management', 'Payment History', 'Bonus Distribution']
        : ['My Profile', 'My Financials', 'Payment History']

    return (
        <div className="h-screen w-full bg-[#f8fafc] flex font-['Inter',_sans-serif] overflow-hidden text-slate-900 relative">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-[280px] bg-slate-900 flex flex-col z-[70] transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex-shrink-0`}>
                <div className="p-8 lg:p-10 mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-bold text-xl lg:text-2xl shadow-xl">A</div>
                        <div>
                            <p className="text-lg lg:text-xl font-bold text-white tracking-tight uppercase">APNA SOCIETY</p>
                        </div>
                    </div>
                    {/* Close mobile nav */}
                    <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((name) => (
                        <button
                            key={name}
                            onClick={() => setActiveTab(name)}
                            className={`w-full text-left px-5 py-3.5 rounded-xl lg:rounded-2xl text-[15px] lg:text-[16px] font-bold transition-all duration-200 flex items-center gap-4 ${activeTab === name
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${activeTab === name ? 'bg-white' : 'bg-slate-800'}`}></div>
                            {name}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button onClick={onLogout} className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-bold text-xs uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-all">
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col overflow-hidden bg-white">
                <header className="px-6 lg:px-12 py-6 lg:py-8 flex justify-between items-center bg-white border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div>
                            <h2 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tight leading-none">{activeTab}</h2>
                            <p className="hidden sm:block text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">System Analysis Active</p>
                        </div>
                    </div>
                    <div
                        className="flex items-center gap-3 lg:gap-6 cursor-pointer hover:bg-slate-50 p-2 lg:p-3 rounded-2xl transition-all group"
                        onClick={() => setShowProfile(true)}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm lg:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{currentUser.name}</p>
                            <p className="text-[10px] lg:text-xs font-black text-blue-600 uppercase tracking-wider">{currentUser.role}</p>
                        </div>
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-900 text-white rounded-xl lg:rounded-2xl flex items-center justify-center font-bold text-lg lg:text-xl shadow-xl group-hover:scale-105 transition-all">
                            {currentUser?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-4 lg:px-10 py-6 lg:py-8 custom-scrollbar">
                    {isAdmin ? (
                        <div className="animate-in fade-in duration-500">
                            {activeTab === 'Overview' && <AdminOverview stats={stats} members={members} onViewReceipt={handleViewReceipt} />}

                            {activeTab === 'Member List' && (
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/50 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">Member List</h3>
                                            <p className="text-sm font-medium text-slate-500">Registered members in the committee.</p>
                                        </div>
                                        <div className="px-8 py-4 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Members</p>
                                            <p className="text-2xl font-black text-slate-900">{members.length}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    {['Name', 'Mobile & Address', 'Monthly Plan', 'Duration', 'Join Date', 'Actions'].map(h => (
                                                        <th key={h} className="px-8 py-5 text-xs font-black uppercase text-slate-500 tracking-[0.15em]">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {members.map((m, i) => (
                                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <p className="font-bold text-slate-800 text-base">{m.name}</p>
                                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">ID: {m.regNo}</p>
                                                            <p className="text-xs text-slate-400 mt-1">{m.email}</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <p className="text-base font-bold text-slate-800">{m.mobile}</p>
                                                            <p className="text-xs font-medium text-slate-500 truncate max-w-[250px] mt-1">{m.address}</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                                <p className="text-base font-black text-slate-900 tracking-tight">₹{(m.planAmount || 1000).toLocaleString()}</p>
                                                            </div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Monthly Deposit</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                                <p className="text-base font-black text-slate-900 tracking-tight">{m.planDuration || '1'} Year(s)</p>
                                                            </div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Commitment</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                                                                {m.regDate}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => setSelectedMemberForView(m)}
                                                                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                                                >
                                                                    View Profile
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteMember(m._id)}
                                                                    className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                                                                    title="Delete Member"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Monthly Collection' && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-emerald-50 p-10 rounded-[32px] border border-emerald-100 flex items-center justify-between shadow-sm">
                                            <div>
                                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-[0.15em] mb-2">Total Amount Paid</p>
                                                <h4 className="text-5xl font-black text-emerald-900 tracking-tighter">₹{stats.totalCollection.toLocaleString()}</h4>
                                            </div>
                                            <div className="w-16 h-16 bg-white rounded-[20px] flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                            </div>
                                        </div>
                                        <div className="bg-rose-50 p-10 rounded-[32px] border border-rose-100 flex items-center justify-between shadow-sm">
                                            <div>
                                                <p className="text-xs font-bold text-rose-600 uppercase tracking-[0.15em] mb-2">Total Amount Due</p>
                                                <h4 className="text-5xl font-black text-rose-900 tracking-tighter">₹{stats.pendingAmount.toLocaleString()}</h4>
                                            </div>
                                            <div className="w-16 h-16 bg-white rounded-[20px] flex items-center justify-center text-rose-600 shadow-sm border border-rose-100">
                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                                        <div className="divide-y divide-slate-100">
                                            {members.map((m, i) => (
                                                <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 text-lg">
                                                            {m?.name?.charAt(0) || '?'}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-xl leading-tight mb-1">{m.name}</p>
                                                            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg border mt-1 inline-block ${m.financials?.collection?.status === 'paid' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-rose-600 border-rose-100 bg-rose-50'
                                                                }`}>
                                                                {m.financials?.collection?.status === 'paid' ? 'Paid' : 'Due'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold text-slate-800">₹{(m.planAmount || 1000).toLocaleString()}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => toggleCollection(m.email)}
                                                            disabled={isSubmitting || m.financials?.collection?.status === 'paid'}
                                                            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase transition-all ${m.financials?.collection?.status === 'paid'
                                                                ? 'bg-emerald-600 text-white shadow-md'
                                                                : (isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-slate-900 active:scale-95')
                                                                }`}
                                                        >
                                                            {isSubmitting ? '...' : (m.financials?.collection?.status === 'paid' ? 'Paid' : 'Collect')}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Loan Management' && (
                                <div className="space-y-6 lg:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-slate-900 px-6 lg:px-10 py-6 lg:py-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h3 className="text-xl lg:text-3xl font-black italic tracking-tighter">Loan Administration</h3>
                                            <p className="text-slate-400 font-bold text-[10px] lg:text-sm mt-1 uppercase tracking-widest leading-none">Credit monitoring system</p>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedMemberForLoan(null); setLoanError(''); setShowLoanModal(true); }}
                                            className="relative z-10 w-full sm:w-auto bg-blue-600 px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm uppercase tracking-widest hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
                                        >
                                            + New Loan
                                        </button>
                                    </div>

                                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                                        <div className="overflow-x-auto scrollbar-hide">
                                            <table className="w-full text-left min-w-[700px]">
                                                <thead className="bg-slate-50 border-b border-slate-200">
                                                    <tr>
                                                        {['Member Name', 'Loan Details', 'Current Balance', 'Status'].map(h => (
                                                            <th key={h} className="px-6 lg:px-10 py-5 text-[9px] lg:text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {members.filter(m => m.financials?.loan?.active).map((m, i) => (
                                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                                            <td className="px-6 lg:px-10 py-5 lg:py-6">
                                                                <p className="font-black text-slate-900 text-lg lg:text-xl leading-none mb-1">{m.name}</p>
                                                                <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.financials.loan.loanId}</p>
                                                            </td>
                                                            <td className="px-6 lg:px-10 py-5 lg:py-6">
                                                                <p className="text-base lg:text-lg font-black text-slate-900">₹{parseFloat(m.financials.loan.amount).toLocaleString()}</p>
                                                                <p className="text-[9px] lg:text-[10px] font-black text-blue-600 uppercase mt-1 tracking-widest">At {m.financials?.loan?.interestRate || 0}% Interest</p>
                                                            </td>
                                                            <td className="px-6 lg:px-10 py-5 lg:py-6">
                                                                <p className="text-lg lg:text-2xl font-black text-rose-600 tracking-tight">₹{parseFloat(m.financials.loan.remaining).toLocaleString()}</p>
                                                            </td>
                                                            <td className="px-6 lg:px-10 py-5 lg:py-6">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${m.financials?.loan?.status === 'overdue' ? 'bg-rose-500 animate-pulse' :
                                                                        m.financials?.loan?.status === 'paid' ? 'bg-emerald-500' : 'bg-blue-500'
                                                                        }`}></span>
                                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${m.financials?.loan?.status === 'overdue' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                                        m.financials?.loan?.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                            'bg-blue-50 text-blue-600 border-blue-100'
                                                                        }`}>
                                                                        {m.financials?.loan?.status || 'Active'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {members.filter(m => m.financials?.loan?.active).length === 0 && (
                                            <div className="p-16 lg:p-24 text-center">
                                                <p className="text-[10px] lg:text-xs font-black text-slate-300 uppercase tracking-[0.25em]">No active loans found in directory</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Payment History' && (
                                <AdminPaymentHistory members={members} onViewReceipt={handleViewReceipt} />
                            )}

                            {activeTab === 'Bonus Distribution' && (
                                <AdminBonusManagement members={members} onRefresh={refreshData} />
                            )}
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-500">
                            {activeTab === 'My Profile' && <MemberOverview user={currentUser} onViewReceipt={handleViewReceipt} />}
                            {activeTab === 'My Financials' && <MemberFinancials user={currentUser} onPay={handleMemberPayment} isSubmitting={isSubmitting} />}
                            {activeTab === 'Payment History' && <MemberHistory user={currentUser} onViewReceipt={handleViewReceipt} />}
                        </div>
                    )}
                </div>
            </main>

            {showProfile && (
                <ProfileModal
                    user={currentUser}
                    currentUserRole={user.role}
                    onClose={() => setShowProfile(false)}
                    onUpdate={async (updatedUser) => {
                        // In a real app, call update API here
                        await refreshData()
                        setShowProfile(false)
                    }}
                />
            )}

            {selectedMemberForView && (
                <ProfileModal
                    user={selectedMemberForView}
                    currentUserRole={user.role}
                    onClose={() => setSelectedMemberForView(null)}
                    onUpdate={async () => {
                        await refreshData()
                        setSelectedMemberForView(null)
                    }}
                />
            )}

            {viewingReceipt && (
                <ReceiptModal
                    transaction={viewingReceipt.transaction}
                    user={viewingReceipt.user}
                    onClose={() => setViewingReceipt(null)}
                    currentRole={user.role}
                />
            )}

            {/* Loan Modal (Normal) */}
            {showLoanModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-3xl p-10 shadow-2xl">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Issue New Loan</h3>
                        <p className="text-sm text-slate-400 mb-6 font-medium">Please enter loan details correctly.</p>

                        {loanError && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <p className="text-sm font-bold text-rose-600">{loanError}</p>
                            </div>
                        )}

                        <form onSubmit={issueLoan} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">Select Member</label>
                                <select
                                    value={selectedMemberForLoan?._id || ''}
                                    onChange={(e) => {
                                        const member = members.find(m => m._id === e.target.value);
                                        setSelectedMemberForLoan(member || null);
                                        setLoanError('');
                                    }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 font-bold text-slate-800 outline-none"
                                >
                                    <option value="">-- Select a Member --</option>
                                    {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.regNo})</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">Loan Amount (₹)</label>
                                <input type="number" required value={loanForm.amount} onChange={(e) => setLoanForm({ ...loanForm, amount: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 font-bold text-slate-800 outline-none" placeholder="Enter amount" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Interest Rate %</label>
                                    <input type="number" value={loanForm.interestRate} onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 font-bold text-slate-800 outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Months</label>
                                    <input type="number" value={loanForm.duration} onChange={(e) => setLoanForm({ ...loanForm, duration: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 font-bold text-slate-800 outline-none" />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => {
                                    setShowLoanModal(false)
                                    setLoanForm({ amount: '', interestRate: '2', duration: '12' })
                                    setSelectedMemberForLoan(null)
                                }} className="flex-1 bg-slate-100 text-slate-500 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all text-sm">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className={`flex-1 font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all text-sm ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white'}`}>
                                    {isSubmitting ? 'Processing...' : 'Submit Loan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 50px; }
            `}</style>
        </div>
    )
}
