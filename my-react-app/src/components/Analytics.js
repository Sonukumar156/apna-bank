
export default function Analytics() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Analytics Overview</h2>
                    <p className="text-gray-500 font-medium">Track your performance and usage statistics.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">Download CSV</button>
                    <button className="px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Update Live</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Views', value: '45,231', trend: '+12.5%', color: 'text-indigo-600' },
                    { label: 'Active Users', value: '2,842', trend: '+5.2%', color: 'text-purple-600' },
                    { label: 'Conversion', value: '4.2%', trend: '-0.4%', color: 'text-emerald-600' },
                    { label: 'Avg. Session', value: '12m 4s', trend: '+2.1%', color: 'text-amber-600' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-gray-100 rounded-[40px] p-10 h-[400px] flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-transparent"></div>
                <div className="relative text-center">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                        <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Chart Ready</h3>
                    <p className="text-gray-500 max-w-xs mx-auto text-sm">Visualizing your data in real-time. Connect your data source to see the magic happen.</p>
                </div>
            </div>
        </div>
    )
}
