import { useState } from 'react'

export default function AdminPaymentHistory({ members = [], onViewReceipt }) {
    const [searchTerm, setSearchTerm] = useState('')

    // Aggregate payment history from all members
    const allHistory = members.reduce((acc, member) => {
        const memberHistory = (member.history || []).map(item => ({
            ...item,
            userId: member._id || member.id,
            memberName: member.name,
            memberEmail: member.email,
            memberMobile: member.mobile,
            memberRegNo: member.regNo,
            memberAddress: member.address
        }));
        return [...acc, ...memberHistory];
    }, []).sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter logic
    const filteredHistory = allHistory.filter(item => {
        const search = searchTerm.toLowerCase()
        return (
            item.memberName.toLowerCase().includes(search) ||
            item.memberEmail.toLowerCase().includes(search) ||
            item.memberMobile.toLowerCase().includes(search) ||
            item.date.toLowerCase().includes(search) ||
            (item.description && item.description.toLowerCase().includes(search))
        )
    })

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header & Filter Section */}
            <div className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tighter italic">Global Ledger</h3>
                    <p className="text-[10px] lg:text-xs font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">Full transaction records for all members</p>
                </div>

                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-[24px] px-6 lg:px-8 py-3 lg:py-4 font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm lg:text-base"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-3xl lg:rounded-[48px] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                {['Member Profile', 'Payment Type', 'Amount', 'Date', 'Action'].map((h) => (
                                    <th key={h} className="px-6 lg:px-10 py-5 lg:py-6 text-[9px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300 group">
                                        <td className="px-6 lg:px-10 py-5 lg:py-8">
                                            <div className="flex items-center gap-3 lg:gap-4">
                                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-900 text-white rounded-xl lg:rounded-2xl flex items-center justify-center font-bold text-base lg:text-lg shadow-lg">
                                                    {item.memberName.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm lg:text-base font-black text-slate-900 leading-tight truncate">{item.memberName}</p>
                                                    <p className="text-[9px] lg:text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-1 truncate">{item.memberEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-8">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`px-2.5 lg:px-4 py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-[8px] lg:text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${item.type === 'Loan Payment' || item.type === 'Loan Issued'
                                                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                    : item.type === 'Society Fund'
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        : 'bg-slate-50 text-slate-600 border-slate-100'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-8">
                                            <p className="text-base lg:text-lg font-black text-slate-900 tracking-tight italic">₹{item.amount.toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-8 font-bold text-slate-500 text-[11px] lg:text-sm whitespace-nowrap">
                                            {item.date}
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-8">
                                            <button
                                                onClick={() => onViewReceipt(item, {
                                                    _id: item.userId,
                                                    name: item.memberName,
                                                    email: item.memberEmail,
                                                    regNo: item.memberRegNo,
                                                    address: item.memberAddress || 'Community Member'
                                                })}
                                                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all whitespace-nowrap"
                                            >
                                                Receipt
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-24 text-center text-slate-400 font-bold uppercase tracking-widest">
                                        No matching transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Visual Analytics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="bg-[#1e293b] p-8 lg:p-10 rounded-3xl lg:rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 lg:mb-4">Total Volume</p>
                        <h4 className="text-2xl lg:text-3xl font-black italic tracking-tighter">₹{filteredHistory.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</h4>
                    </div>
                </div>
                <div className="bg-emerald-500 p-8 lg:p-10 rounded-3xl lg:rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em] mb-3 lg:mb-4">Transactions</p>
                        <h4 className="text-2xl lg:text-3xl font-black italic tracking-tighter">{filteredHistory.length} Total</h4>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 p-8 lg:p-10 rounded-3xl lg:rounded-[40px] shadow-sm sm:col-span-2 lg:col-span-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 lg:mb-4">Latest Process</p>
                    <h4 className="text-2xl lg:text-3xl font-black text-slate-900 italic tracking-tighter">Verified Active</h4>
                </div>
            </div>
        </div>
    );
}
