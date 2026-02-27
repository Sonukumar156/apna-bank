export default function MemberOverview({ user, onViewReceipt }) {
    const fin = user.financials || { collection: { status: 'due' }, loan: { active: false } };
    const loan = fin.loan || { active: false, amount: 0, remaining: 0 };
    const history = user.history || [];

    const monthlyFee = user.planAmount || 1000;
    const totalPaidToSociety = user.totalPaidToSociety || (fin.collection?.status === 'paid' ? monthlyFee : 0);

    const cards = [
        {
            label: 'Society Fund',
            value: `₹${monthlyFee.toLocaleString()}`,
            sub: fin.collection?.status === 'paid' ? 'Deposit Successful' : 'Payment Pending',
            theme: fin.collection?.status === 'paid' ? 'emerald' : 'rose',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        {
            label: 'EMI / Interest',
            value: loan.active ? `₹${(loan.amount * (loan.interestRate / 100)).toLocaleString()}` : '₹0',
            sub: loan.active ? `Interest: ${loan.interestRate}%` : 'No active loan',
            theme: loan.active ? 'indigo' : 'blue',
            icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
        },
        {
            label: 'Principal Taken',
            value: `₹${(loan.amount || 0).toLocaleString()}`,
            sub: loan.active ? `Released: ${loan.loanDate}` : 'No history',
            theme: 'blue',
            icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
        },
        {
            label: 'Balance Payable',
            value: `₹${(loan.remaining || 0).toLocaleString()}`,
            sub: loan.status === 'overdue' ? 'PAYMENT OVERDUE' : 'Payment Regular',
            theme: loan.status === 'overdue' ? 'rose' : 'emerald',
            icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        }
    ];

    const themes = {
        blue: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: 'text-blue-500' },
        emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'text-emerald-500' },
        rose: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: 'text-rose-500' },
        indigo: { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: 'text-indigo-500' }
    };

    return (
        <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700">
            {/* User Header */}
            <div className="bg-slate-900 rounded-3xl lg:rounded-[32px] p-6 lg:p-10 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 lg:gap-8">
                    <div className="space-y-3 lg:space-y-4">
                        <p className="text-blue-400 font-black text-[10px] lg:text-xs uppercase tracking-[0.2em]">Member Dashboard</p>
                        <h2 className="text-3xl lg:text-5xl font-black tracking-tighter italic">Namaste, {user.name}</h2>
                        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                            <span className="px-3 lg:px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-widest border border-blue-500/30">REG ID: {user.regNo}</span>
                            <span className="px-3 lg:px-4 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] lg:text-xs font-bold border border-emerald-500/30">Total Jama: ₹{totalPaidToSociety.toLocaleString()}</span>
                            <span className="px-3 lg:px-4 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-[10px] lg:text-xs font-bold border border-yellow-500/30 font-black italic">Bonus: ₹{(user.totalBonusReceived || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-[-20%] right-[-10%] w-60 h-60 lg:w-80 lg:h-80 bg-blue-600/20 rounded-full blur-[80px] lg:blur-[100px]"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                {cards.map((stat, i) => (
                    <div key={i} className={`bg-white p-6 lg:p-8 rounded-2xl lg:rounded-[32px] border ${themes[stat.theme].border} shadow-sm hover:shadow-md transition-all duration-300`}>
                        <div className="flex justify-between items-center mb-6 lg:mb-8">
                            <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl ${themes[stat.theme].bg} ${themes[stat.theme].icon}`}>
                                <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 lg:mb-2">{stat.label}</p>
                            <h3 className={`text-2xl lg:text-3xl font-black ${themes[stat.theme].text} tracking-tighter mb-1 lg:mb-2`}>{stat.value}</h3>
                            <p className="text-[11px] lg:text-sm font-bold text-slate-500">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Mini History */}
            <div className="bg-white rounded-3xl lg:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-slate-50 flex justify-between items-center">
                    <div>
                        <h4 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight italic">Recent Payments</h4>
                        <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Direct access to your latest receipts</p>
                    </div>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left min-w-[500px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                {['Date', 'Type', 'Amount', 'Action'].map((h) => (
                                    <th key={h} className="px-6 lg:px-8 py-4 lg:py-5 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {history.length > 0 ? (
                                history.slice(0, 5).map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 lg:px-8 py-4 lg:py-6 text-sm font-bold text-slate-900 whitespace-nowrap">{item.date}</td>
                                        <td className="px-6 lg:px-8 py-4 lg:py-6">
                                            <span className={`px-2.5 py-1 rounded-lg text-[8px] lg:text-[9px] font-black uppercase tracking-widest border whitespace-nowrap ${item.type === 'Loan Payment' || item.type === 'Loan Issued'
                                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 lg:px-8 py-4 lg:py-6 text-sm font-black text-slate-900 italic whitespace-nowrap">₹{item.amount.toLocaleString()}</td>
                                        <td className="px-6 lg:px-8 py-4 lg:py-6">
                                            <button
                                                onClick={() => onViewReceipt(item)}
                                                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all font-bold whitespace-nowrap"
                                            >
                                                Receipt
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-10 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">No transactions yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[40px] border border-slate-100 shadow-sm">
                <h4 className="text-lg lg:text-xl font-black text-slate-900 mb-6 lg:mb-8 uppercase tracking-widest italic">Member Info</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
                    <div>
                        <p className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest mb-1 lg:mb-2">Mobile</p>
                        <p className="text-base lg:text-lg font-bold text-slate-800">{user.mobile}</p>
                    </div>
                    <div>
                        <p className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest mb-1 lg:mb-2">Email</p>
                        <p className="text-base lg:text-lg font-bold text-blue-600 truncate">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest mb-1 lg:mb-2">Bonus</p>
                        <p className="text-base lg:text-lg font-black text-emerald-600 italic">₹{(user.totalBonusReceived || 0).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest mb-1 lg:mb-2">Address</p>
                        <p className="text-sm lg:text-base font-bold text-slate-800 leading-snug">{user.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
