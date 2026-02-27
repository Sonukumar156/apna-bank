import { useState } from 'react'
import { loginUser } from '../api'

export default function Login({ onLoginSuccess, onGoToRegister, onBackToHome, initialMessage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(initialMessage || { type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      const user = await loginUser(email, password)
      onLoginSuccess(user)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] p-6 font-['Inter',_sans-serif]">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Left Side: Modern Visual */}
        <div className="w-full md:w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black tracking-tight italic text-white uppercase">APNA SOCIETY</h1>
            </div>

            <button
              onClick={onBackToHome}
              className="mb-8 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 group w-fit"
            >
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Home
            </button>

            <h2 className="text-4xl font-black leading-tight mb-6 italic">
              Official Committee <br />Management Portal
            </h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest max-w-md leading-relaxed">
              A secure platform for managing member collections, loan distributions, and financial tracking.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Verified Secure System
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h3 className="text-3xl font-black text-slate-900 mb-2 italic">Member Login</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">Enter your credentials to access the portal.</p>
          </div>

          {message.text && (
            <div className={`mb-8 p-5 rounded-2xl text-[10px] uppercase font-black tracking-widest flex items-center gap-3 border animate-in slide-in-from-top-2 duration-300 ${message.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@email.com"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-900 font-bold placeholder:text-slate-300"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Password</label>
                <a href="#" className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-900 font-bold placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-4 uppercase text-[10px] tracking-widest"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
              {!loading && (
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </button>
          </form>

          <p className="text-center mt-12 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            Not registered yet? {' '}
            <button onClick={onGoToRegister} className="text-blue-600 font-black hover:underline underline-offset-4 decoration-blue-100">Apply for Membership</button>
          </p>
        </div>
      </div>
    </div>
  )
}
