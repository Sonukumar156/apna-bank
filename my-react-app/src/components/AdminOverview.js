import { useLanguage } from '../contexts/LanguageContext'

export default function AdminOverview({ stats, members = [], onViewReceipt }) {
    const { t } = useLanguage()
    const cardData = [
        {
            label: t('overview.totalMembers'),
            value: stats.totalMembers,
            sub: t('overview.allMembers'),
            theme: 'blue',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197'
        },
        {
            label: t('overview.amountPaid'),
            value: `₹${stats.totalCollection.toLocaleString()}`,
            sub: t('overview.totalCollection'),
            theme: 'emerald',
            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
        },
        {
            label: t('overview.amountDue'),
            value: `₹${stats.pendingAmount.toLocaleString()}`,
            sub: t('overview.pendingDues'),
            theme: 'rose',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        {
            label: t('overview.totalLoan'),
            value: `₹${parseFloat(stats.outstandingLoan).toLocaleString()}`,
            sub: `${stats.activeLoans} ${t('overview.activeLoans')}`,
            theme: 'indigo',
            icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
        },
    ]

    const themes = {
        blue: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: 'text-blue-500' },
        emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'text-emerald-500' },
        rose: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: 'text-rose-500' },
        indigo: { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: 'text-indigo-500' }
    }

    // Aggregate payment history from all members
    const allHistory = members.reduce((acc, member) => {
        const memberHistory = (member.history || []).map(item => ({
            ...item,
            userId: member._id || member.id,
            memberName: member.name,
            memberEmail: member.email,
            memberRegNo: member.regNo,
            memberAddress: member.address
        }));
        return [...acc, ...memberHistory];
    }, []).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2 md:px-0">
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 italic tracking-tight">{t('overview.title')}</h3>
                    <p className="text-slate-500 font-bold text-[10px] md:text-sm uppercase tracking-widest">{t('overview.subtitle')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 md:px-5 py-1.5 md:py-2.5 bg-slate-100 text-slate-600 text-[8px] md:text-xs font-black uppercase tracking-widest rounded-full border border-slate-200">System Active</span>
                    <span className="px-3 md:px-5 py-1.5 md:py-2.5 bg-emerald-50 text-emerald-600 text-[8px] md:text-xs font-black uppercase tracking-widest rounded-full border border-emerald-100 italic">Verified System</span>
                </div>
            </div>

            {/* Premium Flat-Design Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                {cardData.map((stat, i) => (
                    <div key={i} className={`bg-white p-6 lg:p-8 rounded-2xl lg:rounded-[32px] border ${themes[stat.theme].border} shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-500 group`}>
                        <div className="flex justify-between items-center mb-4 lg:mb-8">
                            <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl ${themes[stat.theme].bg} ${themes[stat.theme].icon} transition-transform group-hover:scale-110 duration-500`}>
                                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 lg:mb-2.5">{stat.label}</p>
                            <h3 className={`text-2xl lg:text-4xl font-bold ${themes[stat.theme].text} mb-1 lg:mb-2`}>{stat.value}</h3>
                            <p className="text-xs lg:text-sm font-medium text-slate-500">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Large Analytics Card */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[32px] md:rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 md:p-10">
                    <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8 md:mb-12">
                        <div>
                            <h4 className="text-lg md:text-2xl font-black text-slate-900 italic">{t('overview.fundOverview')}</h4>
                            <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">{t('overview.totalCollection')}</p>
                        </div>
                        <div className="flex items-end gap-4 px-6 md:px-8 py-4 md:py-6 bg-blue-600 rounded-2xl md:rounded-[24px] shadow-xl shadow-blue-500/20">
                            <div className="text-left">
                                <p className="text-[9px] md:text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">{t('overview.totalExpected')}</p>
                                <p className="text-2xl md:text-4xl font-black text-white italic">₹{(stats.totalCollection + stats.pendingAmount).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Collection Progress */}
                        <div className="space-y-6 md:space-y-8">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t('overview.collected')}</p>
                                    <p className="text-[9px] md:text-[10px] font-black text-slate-400">{(stats.totalCollection / (stats.totalCollection + stats.pendingAmount) * 100 || 0).toFixed(1)}%</p>
                                </div>
                                <div className="h-3 md:h-4 bg-slate-50 rounded-full border border-slate-100 overflow-hidden group">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                        style={{ width: `${(stats.totalCollection / (stats.totalCollection + stats.pendingAmount) * 100 || 0)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="bg-emerald-50/50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-emerald-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t('overview.totalReceived')}</p>
                                    <p className="text-xl md:text-2xl font-black text-emerald-800 tracking-tight italic">₹{stats.totalCollection.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Debt Progress */}
                        <div className="space-y-6 md:space-y-8">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-[9px] md:text-[10px] font-black text-rose-600 uppercase tracking-widest">{t('overview.pending')}</p>
                                    <p className="text-[9px] md:text-[10px] font-black text-rose-600">{t('overview.actionRequired')}</p>
                                </div>
                                <div className="h-3 md:h-4 bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                                    <div
                                        className="h-full bg-rose-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                                        style={{ width: `${(stats.pendingAmount / (stats.totalCollection + stats.pendingAmount) * 100 || 0)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="bg-rose-50/50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-rose-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] md:text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">{t('overview.remaining')}</p>
                                    <p className="text-xl md:text-2xl font-black text-rose-800 tracking-tight italic">₹{stats.pendingAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Column */}
                <div className="lg:col-span-4 space-y-6 lg:space-y-8">
                    <div className="bg-[#1e293b] rounded-3xl lg:rounded-[40px] p-6 lg:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[220px] lg:h-full border border-slate-700">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4 lg:mb-6">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20">A</div>
                                <h5 className="font-bold tracking-tight text-slate-300">{t('overview.systemStatus')}</h5>
                            </div>
                            <h4 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4">{t('overview.online')}</h4>
                            <p className="text-slate-500 font-medium text-[10px] lg:text-xs mb-6 lg:mb-8">{t('overview.subtitle')}</p>
                        </div>

                        <div className="relative z-10 space-y-3 lg:space-y-4 pt-6 lg:pt-8 border-t border-slate-800">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>{t('overview.lastUpdate')}</span>
                                <span>{t('overview.justNow')}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>{t('nav.about')}</span>
                                <span className="text-emerald-500">{t('overview.online')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Payment History Section */}
            <div className="bg-white border border-slate-100 rounded-3xl lg:rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="p-6 lg:p-10 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h4 className="text-lg lg:text-xl font-bold text-slate-900">{t('overview.recentTransactions')}</h4>
                        <p className="text-xs lg:text-sm font-medium text-slate-400">{t('overview.liveFeed')}</p>
                    </div>
                    <div className="px-4 lg:px-5 py-1.5 lg:py-2 bg-slate-50 rounded-full border border-slate-100">
                        <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('overview.totalTransactions')} {allHistory.length}</span>
                    </div>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                {[t('history.member'), t('history.type'), t('history.amount'), t('history.date'), t('history.action')].map((h) => (
                                    <th key={h} className="px-6 lg:px-10 py-4 lg:py-5 text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {allHistory.length > 0 ? (
                                allHistory.slice(0, 10).map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 lg:px-10 py-5 lg:py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-xs flex-shrink-0">
                                                    {item?.memberName?.charAt(0) || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 truncate">{item.memberName}</p>
                                                    <p className="text-[9px] lg:text-[10px] text-slate-400 font-medium truncate">{item.memberEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6">
                                            <span className={`px-2.5 py-1 rounded-lg text-[8px] lg:text-[9px] font-bold uppercase tracking-wider inline-block whitespace-nowrap ${item.type === 'Loan Payment' || item.type === 'Loan Issued'
                                                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                                : item.type === 'Bonus Received'
                                                    ? 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6">
                                            <p className="text-sm font-bold text-slate-900 whitespace-nowrap">₹{item.amount.toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6 text-xs lg:text-sm font-bold text-slate-500 whitespace-nowrap">
                                            {item.date}
                                        </td>
                                        <td className="px-6 lg:px-10 py-5 lg:py-6">
                                            <button
                                                onClick={() => onViewReceipt(item, {
                                                    _id: item.userId,
                                                    name: item.memberName,
                                                    email: item.memberEmail,
                                                    regNo: item.memberRegNo,
                                                    address: item.memberAddress || 'Community Member'
                                                })}
                                                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-black transition-all whitespace-nowrap"
                                            >
                                                {t('history.receipt')}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-16 lg:py-20 text-center text-xs lg:text-sm font-medium text-slate-400 uppercase tracking-widest">
                                        {t('history.noTransactions')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {allHistory.length > 10 && (
                    <div className="p-4 lg:p-6 bg-slate-50/50 border-t border-slate-50 text-center">
                        <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('history.showingLatest')}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
