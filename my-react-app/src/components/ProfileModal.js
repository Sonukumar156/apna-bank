import { useState } from 'react'
import { updateProfile, registerUser } from '../api'
import ChangePasswordModal from './ChangePasswordModal'
import { useLanguage } from '../contexts/LanguageContext'

export default function ProfileModal({ user, currentUserRole, onClose, onUpdate }) {
    const { t } = useLanguage()
    const isAdminViewingMember = currentUserRole === 'admin' && user.role === 'user'
    const isAdminSelf = user.role === 'admin' && currentUserRole === 'admin'

    const [bankDetails, setBankDetails] = useState({
        accountHolder: user.accountHolder || '',
        bankName: user.bankName || '',
        accountNumber: user.accountNumber || '',
        ifscCode: user.ifscCode || '',
        branchName: user.branchName || '',
        accountType: user.accountType || 'Saving'
    })
    const [isVerifyingIfsc, setIsVerifyingIfsc] = useState(false)
    const [showFullAccountNumber, setShowFullAccountNumber] = useState(false)
    const [editData, setEditData] = useState({
        name: user.name,
        mobile: user.mobile,
        address: user.address,
        planAmount: user.planAmount || 1000
    })
    const [formData, setFormData] = useState({
        name: '', email: '', mobile: '', address: '', password: '', role: 'user'
    })
    const [documents, setDocuments] = useState({
        panCard: user.panCard || null,
        aadharCard: user.aadharCard || null
    })
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [showRegistrationForm, setShowRegistrationForm] = useState(false)

    const handleDocUpload = (e, type) => {
        const file = e.target.files[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB')
            return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
            if (showRegistrationForm) {
                setFormData(prev => ({ ...prev, [type]: reader.result }))
            } else {
                setDocuments(prev => ({ ...prev, [type]: reader.result }))
            }
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
            alert('Failed to update: ' + err.message)
        } finally {
            setIsSaving(false)
        }
    }

    const handleRegister = async () => {
        setIsSaving(true)
        try {
            await registerUser({
                ...formData,
                planAmount: 1000,
                planDuration: '1',
                isFirstLogin: true,
                role: 'admin' 
            })
            alert('New Board Administrator has been successfully appointed!')
            setShowRegistrationForm(false)
            setFormData({ name: '', email: '', mobile: '', address: '', password: '', role: 'user' })
        } catch (err) {
            alert('Failed: ' + err.message)
        } finally {
            setIsSaving(false)
        }
    }

    const isMember = user.role === 'user'
    const accentColor = isMember ? 'emerald-400' : 'blue-400'
    const accentBorder = isMember ? 'border-emerald-500/20' : 'border-blue-500/20'

    if (!isEditing && !showRegistrationForm) {
        return (
            <div className="fixed inset-0 z-[120] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 lg:p-12 animate-in fade-in duration-300">
                <div className="w-full max-w-5xl h-full md:h-auto md:max-h-[85vh] md:rounded-[48px] shadow-2xl border border-white/10 flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-500 bg-slate-950">
                    <div className={`absolute top-0 left-0 w-full h-64 -z-0 bg-gradient-to-br ${isMember ? 'from-emerald-600/10 via-slate-950 to-slate-950' : 'from-blue-600/20 via-slate-950 to-slate-950'}`}></div>
                    <div className="relative z-10 px-6 md:px-8 lg:px-12 py-6 md:py-8 flex justify-between items-center">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className={`w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center border ${accentBorder} text-${accentColor}`}>
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMember ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl lg:text-2xl font-black text-white italic truncate max-w-[120px] sm:max-w-none">{isMember ? 'Member Data' : 'Admin Profile'}</h2>
                                <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest text-${accentColor}`}>{isMember ? 'Verified Society Portfolio' : 'System Administrator'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-rose-500/20 text-slate-400 rounded-xl md:rounded-2xl flex items-center justify-center transition-all">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar px-6 md:px-8 lg:px-12 pb-12">
                        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 md:gap-8 mb-12">
                            <div className="w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-slate-900 border-2 border-white/10 rounded-[32px] md:rounded-[40px] p-1 shadow-2xl relative overflow-hidden shrink-0">
                                 <div className="w-full h-full bg-slate-800 rounded-[28px] md:rounded-[36px] flex items-center justify-center text-4xl md:text-5xl lg:text-7xl font-black text-white uppercase italic">
                                    {(user.name || 'U').charAt(0)}
                                 </div>
                            </div>
                            <div className="text-center lg:text-left flex-1">
                                <span className={`px-4 py-1.5 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-white/5 inline-block mb-3 bg-white/5 text-slate-400`}>{user.role.toUpperCase()} LEVEL ACCESS</span>
                                <h3 className="text-2xl md:text-3xl lg:text-5xl font-black text-white tracking-tighter mb-2">{user.name}</h3>
                                <p className="text-slate-400 font-bold text-xs md:text-sm">{user.email} • {user.mobile}</p>
                            </div>
                            {!isAdminViewingMember && (
                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
                                    <button onClick={() => setIsEditing(true)} className="px-6 md:px-8 py-3.5 md:py-4 bg-white text-slate-950 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl hover:scale-105 active:scale-95 transition-all">Edit Records</button>
                                    {isAdminSelf && (
                                        <button onClick={() => setShowRegistrationForm(true)} className="px-6 md:px-8 py-3.5 md:py-4 bg-blue-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl shadow-lg shadow-blue-500/20">Add Board Admin</button>
                                    )}
                                </div>
                            )}
                        </div>
                        {isMember && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-12">
                                {['panCard', 'aadharCard'].map(type => (
                                    <div key={type} className="bg-slate-900/50 border border-white/5 rounded-[32px] md:rounded-[40px] p-6 md:p-8 group relative overflow-hidden transition-all hover:bg-slate-900">
                                        <div className="flex justify-between items-center mb-4 md:mb-6">
                                            <div>
                                                <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{type === 'panCard' ? 'PAN IDENTITY' : 'AADHAR RECORD'}</p>
                                                <p className="text-[10px] md:text-xs font-bold text-white italic">Status: <span className="text-emerald-400">VERIFIED</span></p>
                                            </div>
                                        </div>
                                        <div className="aspect-[16/9] md:aspect-[21/9] bg-black/40 rounded-2xl md:rounded-3xl overflow-hidden relative flex items-center justify-center border border-white/5">
                                            {(documents[type] || user[type]) ? (
                                                <img src={documents[type] || user[type]} alt={type} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                            ) : (
                                                <p className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Missing Document</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {isMember && (user.accountNumber || !isMember) && (
                            <div className="bg-slate-900 border border-white/5 rounded-[48px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl mb-12">
                                <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-600/10 blur-[120px] rounded-full"></div>
                                <div className="relative z-10 space-y-12">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Payout Node</p>
                                            <p className="text-xl md:text-2xl font-black italic tracking-tighter text-emerald-400">{(user.bankName || 'NOT REGISTERED')}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-emerald-500">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4">Secure Account Number</p>
                                        <p className="text-2xl md:text-5xl font-black italic tracking-tighter family-mono truncate">
                                            {showFullAccountNumber ? (user.accountNumber || '0000 0000 0000').split('').join(' ') : '•••• •••• ' + (user.accountNumber?.slice(-4) || '0000')}
                                        </p>
                                        <button onClick={() => setShowFullAccountNumber(!showFullAccountNumber)} className="mt-4 text-[7px] font-black text-emerald-500 uppercase px-2 py-1 border border-emerald-500/20 rounded-md hover:bg-emerald-500 hover:text-white transition-all">{showFullAccountNumber ? 'Hide Full' : 'Show Full'}</button>
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between pt-10 border-t border-white/5 gap-6">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Holder</p>
                                            <p className="text-sm font-bold text-white uppercase">{user.accountHolder || user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">IFSC Node</p>
                                            <p className="text-sm font-bold text-emerald-400 italic">{user.ifscCode || 'PENDING'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Branch</p>
                                            <p className="text-sm font-bold text-white uppercase">{user.branchName || 'GLOBAL SOCIETY'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="p-6 bg-black/40 border border-white/5 rounded-3xl family-mono opacity-60">
                            <p className="text-[10px] text-slate-500 font-bold italic">
                                &gt; Session authenticated for ID: {user.regNo || '#SYS-99'} <br />
                                &gt; Encryption: AES-256 GCM ACTIVE <br />
                                &gt; Core node status: OPTIMAL
                            </p>
                        </div>
                    </div>
                </div>
                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                    .family-mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
                `}</style>
                {showChangePassword && (
                    <ChangePasswordModal
                        user={user}
                        onPasswordChanged={onUpdate}
                        onLogout={() => setShowChangePassword(false)}
                    />
                )}
            </div>
        )
    }

    if (isEditing) {
        return (
            <div className="fixed inset-0 z-[120] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 lg:p-12 animate-in fade-in duration-300">
                <div className="w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] md:rounded-[48px] bg-slate-950 border border-white/10 flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-500">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-10 lg:p-16">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h3 className="text-3xl lg:text-4xl font-black text-white italic tracking-tighter uppercase">Modify Portfolio</h3>
                                <p className={`text-[10px] font-black uppercase tracking-widest text-${accentColor}`}>Level: Secure Records Amendment</p>
                            </div>
                            <button onClick={() => setIsEditing(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-rose-500 transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                             <div className="space-y-8">
                                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-l-4 border-white/20 pl-4 mb-2">Primary Identity</h5>
                                {[{L: 'Legal Entity Name', V: 'name'}, {L: 'Mobile Node', V: 'mobile'}, {L: 'Registered Address', V: 'address'}].map(f => (
                                    <div key={f.V}>
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{f.L}</label>
                                        <input type="text" value={editData[f.V]} onChange={e => setEditData({...editData, [f.V]: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-white/20 transition-all" />
                                    </div>
                                ))}
                             </div>
                             {isMember && (
                                <div className="space-y-8">
                                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-l-4 border-emerald-500 pl-4 mb-2">Payout Configuration</h5>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Account Holder</label>
                                        <input type="text" value={bankDetails.accountHolder} onChange={e => setBankDetails({...bankDetails, accountHolder: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-white/20" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Account Number</label>
                                        <input type="text" value={bankDetails.accountNumber} onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-white/20" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">IFSC Node</label>
                                            <input type="text" value={bankDetails.ifscCode} onChange={e => setBankDetails({...bankDetails, ifscCode: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-white/20" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Account Type</label>
                                            <select value={bankDetails.accountType} onChange={e => setBankDetails({...bankDetails, accountType: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-2 h-[54px] text-sm font-bold text-white outline-none">
                                                <option value="Saving">Saving</option>
                                                <option value="Current">Current</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                             )}
                        </div>

                        {/* Documents Section in Edit Mode */}
                        {isMember && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 border-t border-white/5 pt-12">
                                {['panCard', 'aadharCard'].map(type => (
                                    <div key={type} className="space-y-4">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{type === 'panCard' ? 'Update PAN Proof' : 'Update Aadhar Proof'}</p>
                                        <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 relative group overflow-hidden h-40 flex items-center justify-center">
                                            {(documents[type] || user[type]) ? (
                                                <img src={documents[type] || user[type]} alt={type} className="w-full h-full object-cover opacity-60" />
                                            ) : (
                                                <div className="text-center opacity-30">
                                                    <p className="text-2xl mb-2">📄</p>
                                                    <p className="text-[9px] font-black tracking-widest uppercase">No Document</p>
                                                </div>
                                            )}
                                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                                                <span className="bg-white text-slate-950 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">New Upload</span>
                                                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleDocUpload(e, type)} />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-6 mt-16">
                            <button onClick={() => setIsEditing(false)} className="flex-1 py-5 bg-white/5 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Discard Amendments</button>
                            <button onClick={handleSave} disabled={isSaving} className="flex-[2] py-5 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">{isSaving ? 'Processing...' : 'Commit Secure Changes'}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (showRegistrationForm) {
        return (
            <div className="fixed inset-0 z-[120] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 lg:p-12">
                <div className="w-full max-w-4xl bg-slate-950 rounded-[48px] shadow-2xl border border-white/10 flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-500">
                    <div className="p-10 lg:p-16">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Board Delegation</h3>
                            <button onClick={() => setShowRegistrationForm(false)} className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-rose-500 transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                {[{L: 'Sub Admin Name', V: 'name'}, {L: 'Email Access', V: 'email'}, {L: 'Mobile Node', V: 'mobile'}].map(f => (
                                    <div key={f.V}>
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{f.L}</label>
                                        <input type="text" value={formData[f.V]} onChange={e => setFormData({...formData, [f.V]: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all" />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Set Master Password</label>
                                    <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all" />
                                </div>
                                <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 italic">Notice</p>
                                    <p className="text-xs text-blue-300 font-bold leading-relaxed italic">Registered admins will have full control over society data. Authenticate responsibility.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-6 mt-12">
                            <button onClick={() => setShowRegistrationForm(false)} className="flex-1 py-5 bg-white/5 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                            <button onClick={handleRegister} disabled={isSaving} className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">{isSaving ? 'Registering...' : 'Assign Secure Role'}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
