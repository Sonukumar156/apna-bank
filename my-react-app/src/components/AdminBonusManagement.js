import { useState } from 'react'
import { sendSMS } from '../utils/smsService'
import { distributeBonus } from '../api'

export default function AdminBonusManagement({ members = [], onRefresh }) {
    const [bonusAmount, setBonusAmount] = useState('')
    const [bonusDescription, setBonusDescription] = useState('Annual Dividend / Bonus')
    const [isProcessing, setIsProcessing] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleDistributeBonus = async () => {
        if (!bonusAmount || parseFloat(bonusAmount) <= 0) return

        setIsProcessing(true)
        try {
            await distributeBonus({
                amount: parseFloat(bonusAmount),
                description: bonusDescription
            })

            onRefresh()
            setShowConfirm(false)
            setBonusAmount('')
            alert(`Bonus distributed successfully!`)
        } catch (err) {
            alert('Distribution failed: ' + err.message)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="bg-[#1e293b] p-8 lg:p-12 rounded-3xl lg:rounded-[48px] text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <h3 className="text-2xl lg:text-4xl font-black tracking-tighter italic mb-4">Bonus Distribution</h3>
                    <p className="text-slate-400 font-bold text-[10px] lg:text-sm uppercase tracking-[0.2em] max-w-lg leading-relaxed">
                        Share the society profits. Distribute a fixed bonus amount to all registered members simultaneously.
                    </p>
                </div>
                <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                {/* Distribution Form */}
                <div className="lg:col-span-5 space-y-6 lg:space-y-8">
                    <div className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[40px] border border-slate-100 shadow-xl space-y-6 lg:space-y-8">
                        <div>
                            <h4 className="text-lg lg:text-xl font-extrabold text-slate-900 tracking-tight mb-2">Configure Bonus</h4>
                            <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Settings will apply to all {members.length} members</p>
                        </div>

                        <div className="space-y-5 lg:space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Bonus Amount per Member (₹)</label>
                                <input
                                    type="number"
                                    value={bonusAmount}
                                    onChange={(e) => setBonusAmount(e.target.value)}
                                    placeholder="Amount (e.g. 500)"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-[24px] px-6 lg:px-8 py-4 lg:py-5 text-lg lg:text-xl font-black text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Bonus Label / Reason</label>
                                <input
                                    type="text"
                                    value={bonusDescription}
                                    onChange={(e) => setBonusDescription(e.target.value)}
                                    placeholder="e.g. Annual Dividend 2024"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-[24px] px-6 lg:px-8 py-4 lg:py-5 text-xs lg:text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div className="pt-2 lg:pt-4">
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    disabled={!bonusAmount || isProcessing}
                                    className={`w-full py-5 lg:py-6 rounded-xl lg:rounded-[24px] font-black text-[10px] lg:text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${!bonusAmount
                                        ? 'bg-slate-100 text-slate-300'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
                                        }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Distribute Bonus Now'}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 p-6 lg:p-8 rounded-3xl lg:rounded-[40px] border border-emerald-100 flex items-center gap-4 lg:gap-6">
                        <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-xl lg:rounded-2xl flex-shrink-0 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100 font-black text-lg lg:text-xl">
                            !
                        </div>
                        <div>
                            <p className="text-[9px] lg:text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Safety Lock Active</p>
                            <p className="text-xs lg:text-sm font-medium text-emerald-800 leading-relaxed">This action cannot be undone. Bonuses are immediately reflected in ledgers.</p>
                        </div>
                    </div>
                </div>

                {/* Member Preview List */}
                <div className="lg:col-span-7 bg-white rounded-3xl lg:rounded-[40px] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-6 lg:p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h4 className="text-lg lg:text-xl font-extrabold text-slate-900 tracking-tight">Receiving Members</h4>
                            <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Preview list of recipients</p>
                        </div>
                        <span className="px-4 lg:px-5 py-2 bg-white rounded-full border border-slate-200 text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">{members.length} Members</span>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[400px] lg:max-h-[600px] p-4 lg:p-6 space-y-2 lg:space-y-3 scrollbar-hide">
                        {members.map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-4 lg:p-5 rounded-2xl lg:rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-900 text-white rounded-lg lg:rounded-xl flex items-center justify-center font-bold text-[10px] lg:text-xs flex-shrink-0">
                                        {m?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs lg:text-sm font-black text-slate-800 leading-none truncate">{m.name}</p>
                                        <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1 truncate">{m.email}</p>
                                    </div>
                                </div>
                                <div className="text-right ml-2">
                                    <p className="text-[10px] lg:text-xs font-black text-emerald-600 uppercase tracking-widest whitespace-nowrap">+₹{parseFloat(bonusAmount || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl lg:rounded-[48px] p-8 lg:p-12 shadow-2xl text-center space-y-6 lg:space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                            <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight mb-2">Confirm Distribution?</h3>
                            <p className="text-xs lg:text-sm font-medium text-slate-500 leading-relaxed px-2">
                                You are about to distribute <span className="text-slate-900 font-bold">₹{parseFloat(bonusAmount).toLocaleString()}</span> to each of the <span className="text-slate-900 font-bold">{members.length} members</span>.
                                <br /><br />
                                Total Impact: <span className="text-emerald-600 font-black text-lg lg:text-xl italic">₹{(parseFloat(bonusAmount) * members.length).toLocaleString()}</span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 lg:gap-3">
                            <button
                                onClick={handleDistributeBonus}
                                className="w-full bg-slate-900 text-white font-black py-4 lg:py-5 rounded-xl lg:rounded-[24px] text-xs lg:text-sm hover:bg-black transition-all shadow-xl active:scale-95"
                            >
                                YES, EXECUTE NOW
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="w-full bg-slate-100 text-slate-500 font-bold py-3 lg:py-4 rounded-xl lg:rounded-[24px] hover:bg-slate-200 transition-all text-[10px] lg:text-xs"
                            >
                                NO, CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
