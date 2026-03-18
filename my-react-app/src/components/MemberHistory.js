import { useLanguage } from '../contexts/LanguageContext'

export default function MemberHistory({ user, onViewReceipt }) {
    const { t } = useLanguage()
    const history = user.history || [];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{t('history.title')}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-2 lowercase">{t('history.subtitle')}</p>
                </div>
            </div>

            {/* History Table/List */}
            <div className="bg-white rounded-[48px] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                {[t('history.date'), t('history.type'), t('history.description'), t('history.amount'), t('history.status')].map((h) => (
                                    <th key={h} className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {history.length > 0 ? (
                                history.map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300 group">
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-black text-slate-900 mb-1">{item.date}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Process Instant</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${item.type === 'Loan Payment' || item.type === 'Loan Issued'
                                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                : item.type === 'Bonus Received'
                                                    ? 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-bold text-slate-600">{item.description}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-lg font-black text-slate-900 tracking-tight italic">₹{item.amount.toLocaleString()}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-2 text-emerald-500">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                    <span className="text-[11px] font-black uppercase tracking-widest">Completed</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => onViewReceipt(item)}
                                                        className="px-3 py-1 bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        {t('history.receipt')}
                                                    </button>
                                                    {item.transactionId && (
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">ID: {item.transactionId}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 tracking-tight italic">{t('history.noTransactions')}</h4>
                                            <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest leading-relaxed">{t('history.subtitle')}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Visual Footer */}
            <div className="p-12 bg-[#0f172a] rounded-[48px] text-white relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h4 className="text-2xl font-bold tracking-tight mb-2">Verified Records</h4>
                        <p className="text-slate-400 font-medium max-w-sm text-sm">All transactions are verified through our secure system.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" style={{ color: '#94a3b8' }}>Management Portal</p>
                            <p className="text-xs font-bold text-emerald-400">Audit Clear</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
}
