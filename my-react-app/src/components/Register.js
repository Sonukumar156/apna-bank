import { useState, useEffect } from 'react'
import { registerUser } from '../api'
import { sendSMS } from '../utils/smsService'

export default function Register({ onBackToLogin, onBackToHome, onRegisterSuccess }) {
    const [formData, setFormData] = useState({
        name: '', email: '', mobile: '', address: '', pincode: '', password: '', confirmPassword: '', planDuration: '1',
        panCard: null, aadharCard: null
    })
    const [selectedPlan, setSelectedPlan] = useState('1000')
    const [customAmount, setCustomAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [notification, setNotification] = useState({ show: false, message: '', type: 'error' })
    const [progress, setProgress] = useState(100)

    const plans = ['1000', '2000', '5000', '10000', 'Custom']
    const durations = ['1', '2', '3', '5', '10']

    // Unified Toast Function
    const showToast = (message, type = 'error') => {
        setNotification({ show: true, message, type })
    }

    // Handle Toast Progress and Dismissal
    useEffect(() => {
        if (notification.show) {
            setProgress(100)
            const duration = 3000
            const interval = 10
            const step = (interval / duration) * 100

            const progressTimer = setInterval(() => {
                setProgress(prev => {
                    if (prev <= 0) {
                        clearInterval(progressTimer)
                        return 0
                    }
                    return prev - step
                })
            }, interval)

            const dismissTimer = setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }))
            }, duration)

            return () => {
                clearInterval(progressTimer)
                clearTimeout(dismissTimer)
            }
        }
    }, [notification.show])

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            showToast('File size must be less than 2MB')
            return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev, [type]: reader.result
            }))
        }
        reader.readAsDataURL(file)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        // Name validation: Allow only letters and spaces
        if (name === 'name') {
            const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '')
            setFormData(prev => ({ ...prev, [name]: lettersOnly }))
            return
        }
        // Mobile & Pincode: Allow only numbers
        if (name === 'mobile' || name === 'pincode') {
            const numbersOnly = value.replace(/\D/g, '')
            if (name === 'mobile') {
                if (numbersOnly.length > 10) {
                    showToast('Mobile number must be exactly 10 digits')
                    return
                } else if (numbersOnly.length > 0 && !/^[789]/.test(numbersOnly)) {
                    showToast('Mobile number must start with 7, 8, or 9')
                } else if (numbersOnly.length === 10) {
                    setNotification(prev => ({ ...prev, show: false }))
                }
            }
            if (name === 'pincode' && numbersOnly.length > 6) return
            setFormData(prev => ({ ...prev, [name]: numbersOnly }))
            return
        }
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        const { name, email, mobile, address, pincode, password, confirmPassword } = formData
        const finalPlanAmount = selectedPlan === 'Custom' ? customAmount : selectedPlan

        if (!name || !email || !mobile || !address || !pincode || !password || !confirmPassword || !finalPlanAmount) {
            showToast('All fields are strictly mandatory')
            return
        }
        if (mobile.length !== 10) {
            showToast('Mobile number must be exactly 10 digits')
            return
        }
        if (!/^[789]/.test(mobile)) {
            showToast('Mobile number must start with 7, 8, or 9')
            return
        }
        if (pincode.length !== 6) {
            showToast('Pincode must be exactly 6 digits')
            return
        }
        if (password !== confirmPassword) {
            showToast('Passwords do not match')
            return
        }
        if (!formData.panCard || !formData.aadharCard) {
            showToast('PAN and Aadhar cards are mandatory')
            return
        }

        setLoading(true)
        try {
            const res = await registerUser({
                ...formData,
                planAmount: parseFloat(finalPlanAmount),
                planDuration: formData.planDuration
            })

            showToast(res.message, 'success')
            setTimeout(() => onRegisterSuccess(res.message), 1500)
        } catch (err) {
            showToast(err.message, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] p-4 lg:p-6 font-['Inter',_sans-serif]">

            {/* Premium Floating Toast with Progress Bar */}
            {notification.show && (
                <div className="fixed top-10 right-10 z-[300] min-w-[350px] bg-white rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-in slide-in-from-right-10 fade-in duration-300">
                    <div className="p-5 flex items-center gap-4">
                        {notification.type === 'success' ? (
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-600 leading-tight">
                                {notification.message}
                            </p>
                        </div>
                        <button
                            onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                            className="text-slate-300 hover:text-slate-500 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="h-1.5 bg-slate-100 w-full">
                        <div
                            className={`h-full transition-all duration-10 linear ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[800px]">

                {/* Visual Sidebar */}
                <div className="w-full md:w-[350px] bg-slate-900 p-10 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-blue-500/20">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-4 italic">Join the <br />Community</h2>

                        <button
                            onClick={onBackToHome}
                            className="mt-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 group w-fit"
                        >
                            <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Home
                        </button>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">
                            Complete your registration to access society funds and financial reports.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Verified System</p>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                            <p className="text-[10px] text-slate-500 font-black mb-2 uppercase tracking-widest">Official Support</p>
                            <p className="text-sm font-black italic text-blue-400 tracking-tight">tsonukumar715@gmail.com</p>
                        </div>
                    </div>

                    {/* Shapes */}
                    <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                </div>

                {/* Form Area */}
                <div className="flex-1 p-8 lg:p-16 bg-white overflow-y-auto">
                    <div className="mb-10 text-center md:text-left">
                        <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter mb-2 italic">Create Account</h3>
                        <p className="text-slate-400 font-bold text-[10px] lg:text-xs uppercase tracking-[0.2em] leading-relaxed">Fill in the details precisely to register.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-8 lg:space-y-10">
                        {/* Plan Selection UI */}
                        <div className="p-6 lg:p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Monthly Subscription Plan *</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                {plans.map(plan => (
                                    <button
                                        key={plan}
                                        type="button"
                                        onClick={() => setSelectedPlan(plan)}
                                        className={`py-4 px-2 rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest transition-all border-2 ${selectedPlan === plan
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl'
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                                    >
                                        {plan === 'Custom' ? plan : `₹${parseInt(plan).toLocaleString()}`}
                                    </button>
                                ))}
                            </div>
                            {selectedPlan === 'Custom' && (
                                <div className="animate-in slide-in-from-top-4 duration-300">
                                    <input
                                        type="number"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        placeholder="Enter Custom Amount (₹)"
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-sm"
                                    />
                                </div>
                            )}

                            {/* Plan Duration Selection */}
                            <div className="pt-4 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">How many years are you choosing this plan? *</h4>
                                <div className="grid grid-cols-5 gap-3">
                                    {durations.map(year => (
                                        <button
                                            key={year}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, planDuration: year }))}
                                            className={`py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${formData.planDuration === year
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                                        >
                                            {year} {parseInt(year) === 1 ? 'Year' : 'Years'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="Rahul Sharma" className="w-full bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl px-5 lg:px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number *</label>
                                <input name="mobile" value={formData.mobile} onChange={handleInputChange} required placeholder="Enter 10 Digits" className="w-full bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl px-5 lg:px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
                                <input name="address" value={formData.address} onChange={handleInputChange} required placeholder="Sector, Area, Building..." className="w-full bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl px-5 lg:px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pin Code</label>
                                <input name="pincode" value={formData.pincode} onChange={handleInputChange} required placeholder="110001" className="w-full bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl px-5 lg:px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email ID *</label>
                                <input name="email" value={formData.email} type="email" onChange={handleInputChange} required placeholder="member@email.com" className="w-full bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl px-5 lg:px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Set Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        value={formData.password}
                                        type={showPassword ? "text" : "password"}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl px-5 lg:px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        type={showConfirmPassword ? "text" : "password"}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl px-5 lg:px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Document Upload Section */}
                        <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xs">🗂️</div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identify Verification Documents *</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* PAN Card */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Upload PAN Card (Photo/PDF)</label>
                                    <div className={`relative border-2 border-dashed rounded-3xl p-6 transition-all ${formData.panCard ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:border-blue-400 bg-white'}`}>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'panCard')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        {formData.panCard ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">✓</div>
                                                <p className="text-[10px] font-black text-emerald-600 uppercase">Attached Successfully</p>
                                            </div>
                                        ) : (
                                            <div className="text-center space-y-2">
                                                <p className="text-2xl">📸</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click to Upload PAN</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Aadhar Card */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Upload Aadhar Card (Photo/PDF)</label>
                                    <div className={`relative border-2 border-dashed rounded-3xl p-6 transition-all ${formData.aadharCard ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:border-blue-400 bg-white'}`}>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'aadharCard')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        {formData.aadharCard ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">✓</div>
                                                <p className="text-[10px] font-black text-emerald-600 uppercase">Attached Successfully</p>
                                            </div>
                                        ) : (
                                            <div className="text-center space-y-2">
                                                <p className="text-2xl">📸</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click to Upload Aadhar</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col items-center gap-5">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${loading ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'}`}
                            >
                                {loading ? 'Registering...' : 'Register as Official Member'}
                            </button>
                            <button type="button" onClick={onBackToLogin} className="text-[10px] lg:text-xs font-black text-slate-400 hover:text-blue-600 transition-all uppercase tracking-widest">
                                Back to Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
