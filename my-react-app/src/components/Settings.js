
export default function Settings({ user }) {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">System Settings</h2>
                <p className="text-gray-500 font-medium">Manage your account preferences and profile.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm space-y-8">
                        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Profile Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Display Name</label>
                                <input disabled value={user.name} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-500 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input disabled value={user.email} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-500 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                <input defaultValue={user.mobile} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address</label>
                                <input defaultValue={user.address} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="pt-4">
                            <button className="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Save Changes</button>
                        </div>
                    </section>

                    <section className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4 mb-8">Security</h3>
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <div>
                                <p className="font-bold text-gray-900">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-400 font-medium">Add an extra layer of security to your account.</p>
                            </div>
                            <div className="w-14 h-8 bg-gray-200 rounded-full cursor-not-allowed"></div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-[40px] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h4 className="text-lg font-black mb-2 italic">APNA SOCIETY Pro</h4>
                        <p className="text-white/70 text-sm font-medium mb-6">Upgrade to unlock advanced features and unlimited reports.</p>
                        <button className="w-full bg-white text-indigo-600 font-black py-3 rounded-2xl text-sm shadow-xl">Upgrade Now</button>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-4">Quick Help</h4>
                        <div className="space-y-4">
                            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-500 transition-colors">Documentation</button>
                            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-500 transition-colors">Community Support</button>
                            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-500 transition-colors">Safety Center</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
