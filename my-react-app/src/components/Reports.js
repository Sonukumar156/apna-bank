
export default function Reports() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Financial Reports</h2>
                <p className="text-gray-500 font-medium">Access and manage your generated documents.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Recent Documents</h3>
                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Create New Report</button>
                </div>
                <div className="divide-y divide-gray-50">
                    {[
                        { id: '#REP-2024-001', name: 'Annual Revenue Summary', date: 'Feb 12, 2024', status: 'Finalized', size: '2.4 MB' },
                        { id: '#REP-2024-002', name: 'User Growth Q1', date: 'Feb 08, 2024', status: 'Pending', size: '1.1 MB' },
                        { id: '#REP-2024-003', name: 'Marketing ROI Analysis', date: 'Jan 28, 2024', status: 'Finalized', size: '4.8 MB' },
                        { id: '#REP-2024-004', name: 'Security Audit v2', date: 'Jan 15, 2024', status: 'Draft', size: '0.9 MB' },
                    ].map((report, i) => (
                        <div key={i} className="p-6 hover:bg-gray-50 transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{report.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{report.id} • {report.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${report.status === 'Finalized' ? 'bg-emerald-50 text-emerald-600' :
                                        report.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {report.status}
                                </span>
                                <span className="text-xs font-bold text-gray-400 hidden sm:block">{report.size}</span>
                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
