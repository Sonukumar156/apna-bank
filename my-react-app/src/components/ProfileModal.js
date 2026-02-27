import { useState } from 'react'
import { updateProfile } from '../api'

export default function ProfileModal({ user, currentUserRole, onClose, onUpdate }) {
    const isAdminViewingMember = currentUserRole === 'admin' && user.role === 'user'

    const [bankDetails, setBankDetails] = useState({
        accountHolder: user.accountHolder || '',
        bankName: user.bankName || '',
        accountNumber: user.accountNumber || '',
        ifscCode: user.ifscCode || ''
    })
    const [editData, setEditData] = useState({
        name: user.name,
        mobile: user.mobile,
        address: user.address,
        planAmount: user.planAmount || 1000
    })
    const [documents, setDocuments] = useState({
        panCard: user.panCard || null,
        aadharCard: user.aadharCard || null
    })
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleDocUpload = (e, type) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => {
            setDocuments(prev => ({ ...prev, [type]: reader.result }))
        }
        reader.readAsDataURL(file)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const updatedUser = await updateProfile(user._id, {
                ...bankDetails,
                ...editData,
                ...documents
            })
            onUpdate(updatedUser)
            setIsEditing(false)
        } catch (err) {
            alert('Failed to update details: ' + err.message)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-0 md:p-10 animate-in fade-in duration-300">
            {/* Main Container */}
            <div className="bg-white w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] md:rounded-[40px] shadow-2xl flex flex-col md:flex-row overflow-hidden relative animate-in slide-in-from-bottom-5">

                {/* Mobile Header (Close & Title) */}
                <div className="md:hidden flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-[130]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xs">AS</div>
                        <h4 className="font-black text-slate-900 uppercase tracking-tighter italic">Profile Dossier</h4>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 shadow-sm transition-active hover:bg-rose-500 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Left Panel: Identity Sidebar */}
                <div className="w-full md:w-[320px] bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between shrink-0 relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full"></div>

                    <div className="relative z-10">
                        <div className="hidden md:flex items-center gap-3 mb-10">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">AS</div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Secure Access</span>
                        </div>

                        <div className="text-center md:text-left space-y-6">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 border border-white/10 rounded-3xl p-1 mx-auto md:mx-0 shadow-2xl">
                                <div className="w-full h-full bg-slate-800 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-black text-white italic">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black tracking-tight">{user.name}</h3>
                                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status: Verified {user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-10 space-y-4">
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Registration ID</p>
                            <p className="text-xs font-bold text-blue-400 tracking-widest">#{user.regNo || 'PENDING'}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="hidden md:block w-full py-4 mt-6 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-xl"
                        >
                            Close Account View
                        </button>
                    </div>
                </div>

                {/* Right Panel: Content with Internal Scroll */}
                <div className="flex-1 overflow-y-auto bg-white flex flex-col custom-scrollbar">
                    {/* Sticky Desktop Header */}
                    <div className="hidden md:flex sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-50 px-12 py-8 justify-between items-center">
                        <div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight italic">Records Summary</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Official Personal & Financial Dossier</p>
                        </div>
                        {!isEditing && !isAdminViewingMember && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2 md:px-6 md:py-2.5 bg-slate-900 text-white rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md"
                            >
                                Edit Records
                            </button>
                        )}
                    </div>

                    <div className="p-6 md:p-12 space-y-12">
                        {isEditing ? (
                            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Edit Fields */}
                                    <div className="space-y-6">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-l-4 border-slate-900 pl-3">Personal Data</h5>
                                        <div className="space-y-4">
                                            {[{ L: 'Legal Name', V: 'name' }, { L: 'Mobile', V: 'mobile' }, { L: 'Address', V: 'address' }].map(f => (
                                                <div key={f.V}>
                                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">{f.L}</label>
                                                    <input type="text" value={editData[f.V]} onChange={e => setEditData({ ...editData, [f.V]: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900/5 outline-none" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-l-4 border-emerald-500 pl-3">Banking Terminal</h5>
                                        <div className="space-y-4">
                                            {[{ L: 'Account Holder', V: 'accountHolder' }, { L: 'Bank Name', V: 'bankName' }, { L: 'Account Number', V: 'accountNumber' }].map(f => (
                                                <div key={f.V}>
                                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">{f.L}</label>
                                                    <input type="text" value={bankDetails[f.V]} onChange={e => setBankDetails({ ...bankDetails, [f.V]: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900/5 outline-none" />
                                                </div>
                                            ))}
                                            <div>
                                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">IFSC Code</label>
                                                <input type="text" value={bankDetails.ifscCode} onChange={e => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900/5 outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-100">
                                    <button onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200">Cancel</button>
                                    <button onClick={handleSave} disabled={isSaving} className="flex-[2] py-4 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95">{isSaving ? 'Synching...' : 'Commit Changes'}</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                {/* Stats Row */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { L: 'Subscription', V: `₹${(user.planAmount || 0).toLocaleString()}`, C: 'text-blue-600' },
                                        { L: 'Committed Term', V: `${user.planDuration || '1'} Year(s)`, C: 'text-emerald-600' },
                                        { L: 'Joined On', V: user.regDate || 'Jan 2024', C: 'text-slate-600' },
                                        { L: 'Compliance', V: 'VERIFIED', C: 'text-indigo-600' }
                                    ].map((s, i) => (
                                        <div key={i} className="bg-slate-50 p-5 rounded-[24px] border border-slate-100">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{s.L}</p>
                                            <p className={`text-xs md:text-sm font-black ${s.C} truncate`}>{s.V}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Identity Documents (Visible to Members Only) */}
                                {user.role !== 'admin' && (
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Verified Identity Proofs</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {['panCard', 'aadharCard'].map(type => (
                                                <div key={type} className="group overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-xl">
                                                    <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                                                        <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{type === 'panCard' ? 'PAN Identifier' : 'Aadhar ID'}</p>
                                                        <span className="px-3 py-1 bg-white border border-slate-200 text-[8px] font-black text-blue-600 rounded-full">SECURE VIEW</span>
                                                    </div>
                                                    <div className="aspect-video relative bg-slate-50 flex items-center justify-center overflow-hidden">
                                                        {user[type] ? (
                                                            <>
                                                                <img src={user[type]} alt={type} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                                                <a href={user[type]} target="_blank" rel="noreferrer" className="absolute opacity-0 group-hover:opacity-100 bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[8px] font-black text-black uppercase tracking-widest shadow-2xl transition-all">View Full Artifact</a>
                                                            </>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2 opacity-30">
                                                                <div className="text-3xl">⚠</div>
                                                                <p className="text-[10px] font-black uppercase italic">No Record Found</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Admin/User Edit Permission */}
                                                    {!isAdminViewingMember && (
                                                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                                                            <label htmlFor={`edit-${type}`} className="cursor-pointer text-[9px] font-black text-slate-500 hover:text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                                                Update {type === 'panCard' ? 'PAN' : 'Aadhar'}
                                                            </label>
                                                            <input id={`edit-${type}`} type="file" accept="image/*" className="hidden" onChange={(e) => handleDocUpload(e, type)} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Payout Terminal */}
                                {user.role !== 'admin' && (
                                    <section className="space-y-6 pb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Settlement Infrastructure</h4>
                                        </div>
                                        {user.accountNumber ? (
                                            <div className="bg-[#1e293b] rounded-[32px] md:rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden ring-1 ring-white/5 shadow-2xl group">
                                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] group-hover:bg-blue-500/20 transition-all underline decoration-blue-500/20"></div>
                                                <div className="relative z-10 space-y-12">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Official Payout Card</p>
                                                        <p className="text-lg font-black italic text-blue-400">{user.bankName.toUpperCase()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4 opacity-50">Account ID</p>
                                                        <p className="text-2xl md:text-5xl font-black italic tracking-tighter family-mono">
                                                            {currentUserRole === 'admin'
                                                                ? user.accountNumber.split('').join('  ')
                                                                : user.accountNumber.replace(/\d(?=\d{4})/g, "• ").match(/.{1,4}/g).join('  ')}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-end border-t border-white/5 pt-8">
                                                        <div>
                                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Entity Name</p>
                                                            <p className="text-xs md:text-sm font-black text-slate-200 uppercase">{user.accountHolder}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Pass-Code</p>
                                                            <p className="text-xs md:text-sm font-black text-emerald-400 tracking-widest italic">{user.ifscCode}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-16 border-2 border-dashed border-slate-100 rounded-[40px] text-center bg-slate-50/50">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Payout Node Offline</p>
                                            </div>
                                        )}
                                    </section>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Branding */}
                    <div className="p-8 text-center border-t border-slate-50 bg-white">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">Apna Society Verified Secure Protocol</p>
                    </div>
                </div>

                {/* Mobile Close Fab (In Header now, but safe to keep one subtle at bottom if needed) */}
                {!isEditing && (
                    <div className="md:hidden fixed bottom-6 right-6 z-[130]">
                        <button onClick={onClose} className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center translate-y-0 active:scale-90 transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .family-mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
            `}</style>
        </div>
    )
}
