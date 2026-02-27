import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'

export default function App() {
  const [view, setView] = useState('landing')
  const [user, setUser] = useState(null)
  const [initialMessage, setInitialMessage] = useState(null)
  const isDark = true // Permanent Dark Mode as requested

  useEffect(() => {
    // Scroll to top on view change
    window.scrollTo(0, 0)
  }, [view])

  useEffect(() => {
    // SESSION PERSISTENCE: Check if a user was already logged in
    const cachedUser = localStorage.getItem('currentUser')
    if (cachedUser) {
      setUser(JSON.parse(cachedUser))
      setView('dashboard')
    }
  }, [])

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData))
    setUser(userData)
    setView('dashboard')
  }

  const handleRegisterSuccess = (msg) => {
    setInitialMessage({ type: 'success', text: msg })
    setView('login')
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    setView('landing')
    setInitialMessage(null)
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDark ? 'bg-[#0a0a0b]' : 'bg-[#f8fafc]'}`}>
      {/* Global Navigation - Persistent across landing and info pages */}
      {(view === 'landing' || ['about', 'services', 'offers', 'contact', 'guides', 'privacy', 'terms'].includes(view)) && (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 lg:px-24 py-6 flex justify-between items-center bg-transparent border-b ${isDark ? 'border-white/5' : 'border-slate-100'
          } backdrop-blur-3xl`}>
          <div className="flex items-center gap-4 group cursor-pointer transition-transform hover:scale-105" onClick={() => setView('landing')}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-2xl transition-all ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'
              }`}>A</div>
            <span className={`text-xl font-black tracking-tighter italic transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
              APNA <span className="text-blue-500">SOCIETY</span>
            </span>
          </div>

          <div className={`hidden xl:flex items-center gap-10 font-black text-[10px] uppercase tracking-[0.2em] transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
            <button onClick={() => setView('about')} className={`transition-colors border-b-2 ${view === 'about' ? 'text-blue-500 border-blue-500' : 'hover:text-blue-500 border-transparent'}`}>About Us</button>
            <button onClick={() => setView('services')} className={`transition-colors border-b-2 ${view === 'services' ? 'text-blue-500 border-blue-500' : 'hover:text-blue-500 border-transparent'}`}>Services</button>
            <button onClick={() => setView('offers')} className={`transition-colors border-b-2 ${view === 'offers' ? 'text-blue-500 border-blue-500' : 'hover:text-blue-500 border-transparent'}`}>What We Offer</button>
            <button onClick={() => setView('contact')} className={`transition-colors border-b-2 ${view === 'contact' ? 'text-blue-500 border-blue-500' : 'hover:text-blue-500 border-transparent'}`}>Contact Us</button>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button onClick={() => setView('register')} className="hidden sm:block px-6 py-2.5 rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">Join Society</button>
            <button onClick={() => setView('login')} className="px-6 py-2.5 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">Login</button>
          </div>
        </nav>
      )}

      {view === 'landing' && (
        <LandingPage
          onLogin={() => setView('login')}
          onRegister={() => setView('register')}
          onNavigate={(target) => setView(target)}
          isDark={isDark}
        />
      )}

      {view === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={() => setView('register')}
          onBackToHome={() => setView('landing')}
          initialMessage={initialMessage}
        />
      )}

      {view === 'register' && (
        <Register
          onBackToLogin={() => setView('login')}
          onBackToHome={() => setView('landing')}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {view === 'about' && <AboutUs onBack={() => setView('landing')} isDark={isDark} />}
      {view === 'services' && <Services onBack={() => setView('landing')} isDark={isDark} />}
      {view === 'offers' && <Offers onBack={() => setView('landing')} isDark={isDark} />}
      {view === 'guides' && <Guides onBack={() => setView('landing')} isDark={isDark} />}
      {view === 'privacy' && <Privacy onBack={() => setView('landing')} isDark={isDark} />}
      {view === 'terms' && <Terms onBack={() => setView('landing')} isDark={isDark} />}
      {view === 'contact' && <ContactUs onBack={() => setView('landing')} isDark={isDark} />}

      {view === 'dashboard' && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

// Detailed Components for Society Sections
function AboutUs({ onBack, isDark }) {
  return (
    <PageContainer title="Our Mission" onBack={onBack} isDark={isDark}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left mt-16 relative">
        <div className="lg:col-span-7 space-y-12">
          <div className="relative">
            <div className="absolute -left-10 top-0 w-1 h-full bg-gradient-to-b from-blue-600 to-transparent"></div>
            <h2 className="text-3xl lg:text-5xl font-black italic leading-[1] tracking-tighter text-white mb-8">
              We Code <span className="text-blue-500">Trust</span> <br />
              Into Every Rupees.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium max-w-2xl">
              APNA SOCIETY was founded with a single vision: to bring absolute transparency to local society funds. We believe that every member deserves to know where their contributions go and how the community grows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { label: "Transparency", val: "100%", desc: "Open ledger policy" },
              { label: "Verification", val: "Instant", desc: "Automated email mirrors" },
              { label: "Auditing", val: "24/7", desc: "Real-time fund tracking" },
              { label: "Security", val: "AES-256", desc: "Military grade encryption" }
            ].map((stat, i) => (
              <div key={i} className="group p-6 border border-white/5 rounded-[32px] bg-white/5 hover:bg-blue-600 transition-all duration-500">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 group-hover:text-white mb-2">{stat.label}</p>
                <p className="text-3xl font-black italic tracking-tighter text-white transition-transform group-hover:scale-110">{stat.val}</p>
                <p className="text-[10px] font-bold text-slate-500 group-hover:text-white/80 mt-1">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full"></div>
          <div className="relative p-10 border border-white/10 rounded-[60px] bg-white/5 backdrop-blur-3xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl group-hover:bg-blue-600/40 transition-all"></div>
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-10">Cyber Audit Protocol</div>
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl">🛡️</div>
                <h3 className="text-2xl font-black italic text-white tracking-tight">Zero Tamper Mirroring</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Our system doesn't just store data in a database. It mirrors every movement to your email. Even if the main server is compromised, your personal inbox holds the immutable truth of every transaction.
                </p>
              </div>
              <div className="pt-10 border-t border-white/5 flex items-center gap-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">SMTP Verified Audit Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

function Services({ onBack, isDark }) {
  return (
    <PageContainer title="Society Services" onBack={onBack} isDark={isDark}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
        {[
          { title: "Fund Collection", icon: "💰", accent: "blue", desc: "Automated monthly subscription tracking. Every payment triggers a permanent PDF receipt to your email." },
          { title: "Loan Management", icon: "🏦", accent: "emerald", desc: "Low-interest loans with flexible repayment plans. Track your loan lifecycle from request to closure via email." },
          { title: "Dividend Payouts", icon: "📈", accent: "purple", desc: "Fair distribution of society profits. Get a detailed breakdown of your annual bonuses delivered to your inbox." }
        ].map((s, i) => (
          <div key={i} className="group relative overflow-hidden p-10 border border-white/5 rounded-[50px] bg-white/5 text-left transition-all duration-500 hover:-translate-y-4 hover:bg-white/[0.08] hover:border-white/20">
            <div className={`absolute -top-10 -right-10 w-40 h-40 bg-${s.accent}-600/10 blur-[60px] group-hover:bg-${s.accent}-600/20 transition-all`}></div>
            <div className="text-6xl mb-10 transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_10px_10px_rgba(37,99,235,0.3)]">{s.icon}</div>
            <h3 className="text-2xl font-black mb-4 italic text-white tracking-tighter">{s.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400 font-medium">{s.desc}</p>
            <div className="mt-10 flex items-center gap-3">
              <span className={`w-10 h-[1px] bg-${s.accent}-600`}></span>
              <span className={`text-[10px] font-black uppercase tracking-widest text-${s.accent}-500 group-hover:translate-x-2 transition-transform`}>Explore Protocol</span>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}

function Offers({ onBack, isDark }) {
  return (
    <PageContainer title="What We Offer" onBack={onBack} isDark={isDark}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-20 text-left">
        {/* Massive Email Tracking Section */}
        <div className="lg:col-span-8 p-1 relative overflow-hidden rounded-[60px] bg-gradient-to-br from-blue-600 to-emerald-400 group">
          <div className="relative p-12 lg:p-16 h-full bg-[#0a0a0b] rounded-[58px] space-y-12">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-500">Industry First</div>
              <h3 className="text-4xl lg:text-5xl font-black italic tracking-tighter text-white leading-none">
                The Email <br /> Advantage.
              </h3>
              <p className="text-xl text-slate-400 italic font-medium max-w-xl">
                "Every transaction, every approval, every paisa... mirrored in your private inbox."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-8 border border-white/5 bg-white/5 rounded-[40px] hover:border-blue-500/50 transition-colors">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-600/20">📄</div>
                <h4 className="text-xl font-black italic text-white mb-3">Live Ledger Mirroring</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Instantly receive PDF receipts for every monthly contribution. A permanent digital vault.</p>
              </div>
              <div className="p-8 border border-white/5 bg-white/5 rounded-[40px] hover:border-emerald-500/50 transition-colors">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-600/20">🔑</div>
                <h4 className="text-xl font-black italic text-white mb-3">Lifecycle Tracking</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Follow your loans from 'Processing' to 'Disbursement' with cryptographically linked email logs.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="p-10 border border-white/10 bg-white/5 rounded-[50px] backdrop-blur-2xl">
            <h3 className="text-3xl font-black italic text-white mb-8 tracking-tighter">Premium Perks</h3>
            <div className="space-y-6">
              {[
                { t: "Emergency Loans", d: "Zero-interest relief funds." },
                { t: "24/7 Dashboard", d: "Live Society health analytics." },
                { t: "Annual Bonuses", d: "Fair distribution distributions." }
              ].map((p, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="w-6 h-6 rounded-full bg-blue-600 group-hover:bg-blue-400 transition-colors flex items-center justify-center text-[10px] text-white font-black italic shrink-0">✓</div>
                  <div>
                    <p className="text-sm font-black text-white italic tracking-tight">{p.t}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 border border-white/10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-[50px] group cursor-pointer transition-transform hover:scale-[1.02]">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-2">Live Scheme</p>
            <h4 className="text-2xl font-black italic text-white leading-tight">Annual Bonus <br />Distribution '26</h4>
            <div className="h-1 w-full bg-white/20 mt-6 rounded-full overflow-hidden">
              <div className="h-full bg-white w-2/3 animate-pulse"></div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white mt-4">Audit Finalizing...</p>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

function ContactUs({ onBack, isDark }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setStatus({ loading: false, success: 'Message sent successfully! We will get back to you soon.', error: null });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ loading: false, success: null, error: data.message || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ loading: false, success: null, error: 'Database connection failed. Please try again later.' });
    }
  };

  return (
    <PageContainer title="Get In Touch" onBack={onBack} isDark={isDark}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 mt-16">
        <div className="text-left space-y-12">
          <div className="relative">
            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.6em] mb-4">Communication Hub</h4>
            <p className="text-4xl lg:text-5xl font-black italic text-white tracking-tighter leading-[1]">
              Connect With <br /> <span className="text-blue-500">The Future.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="group flex items-center gap-6 p-8 border border-white/5 bg-white/5 rounded-[40px] transition-all hover:bg-white/10">
              <div className="w-16 h-16 bg-blue-600/20 rounded-3xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110">📧</div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Direct Support</p>
                <p className="text-xl font-black italic text-white tracking-tight">tsonukumar715@gmail.com</p>
              </div>
            </div>
            <div className="group flex items-center gap-6 p-8 border border-white/5 bg-white/5 rounded-[40px] transition-all hover:bg-white/10">
              <div className="w-16 h-16 bg-emerald-600/20 rounded-3xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110">📍</div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Official Base</p>
                <p className="text-xl font-black italic text-white tracking-tight">Sector 45, Society HQ, DL</p>
              </div>
            </div>
          </div>
        </div>

        <form className="relative p-12 lg:p-16 rounded-[60px] border border-white/10 bg-white/5 backdrop-blur-3xl space-y-8" onSubmit={handleSubmit}>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-600/10 blur-3xl animate-pulse"></div>

          {status.success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              {status.success}
            </div>
          )}

          {status.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest">
              {status.error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-blue-500 uppercase ml-4 tracking-widest">Identify</p>
              <input
                type="text"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-blue-500 uppercase ml-4 tracking-widest">Connect</p>
              <input
                type="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-blue-500 uppercase ml-4 tracking-widest">Message</p>
            <textarea
              rows="5"
              placeholder="Transmission details..."
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all resize-none"
            ></textarea>
          </div>
          <button
            disabled={status.loading}
            className={`w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:shadow-blue-600/50 active:scale-95 transition-all ${status.loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
          >
            {status.loading ? 'Transmitting...' : 'Establish Contact'}
          </button>
        </form>
      </div>
    </PageContainer>
  )
}

function PageContainer({ title, children, onBack }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-32 lg:pt-48 pb-24 px-6 lg:px-24 text-center font-['Inter',_sans-serif] bg-[#0a0a0b] text-white overflow-hidden relative selection:bg-blue-600">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[180px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl w-full relative z-10">
        <div className="flex items-center justify-between mb-24">
          <button
            onClick={onBack}
            className="group px-8 py-4 border border-white/10 bg-white/5 backdrop-blur-3xl rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center gap-4 hover:bg-white hover:text-black hover:border-white active:scale-95"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </button>
          <div className="flex items-center gap-4 text-slate-600">
            <div className="w-12 h-[1px] bg-white/10"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Society OS 2.0</span>
          </div>
        </div>

        <div className="relative inline-block mb-10">
          <div className="absolute -inset-2 bg-blue-600/20 blur-2xl rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
          <h1 className="text-4xl lg:text-[80px] font-black italic tracking-tighter text-white leading-none uppercase animate-in fade-in slide-in-from-top-10 duration-1000">
            {title.split(' ')[0]} <span className="text-blue-500">{title.split(' ')[1] || ''}</span>
          </h1>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-24"></div>

        <div className="animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-300">
          {children}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-auto pt-24 pb-12 w-full flex justify-center border-t border-white/5 opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.6em]">Encrypted System Architecture</p>
      </div>
    </div>
  )
}

function Guides({ onBack, isDark }) {
  return (
    <PageContainer title="System Guides" onBack={onBack} isDark={isDark}>
      <div className="max-w-4xl mx-auto text-left space-y-16 mt-16">
        <section className="space-y-6">
          <h3 className="text-2xl font-black italic text-white tracking-tight">1. Registration Protocol</h3>
          <p className="text-slate-400 leading-relaxed font-medium">To join APNA SOCIETY, navigate to the "Join Society" page. You must choose a monthly subscription plan (₹1,000 to ₹10,000) and specify your commitment duration. Once registered, our AI will assign you a permanent Society ID.</p>
        </section>
        <section className="space-y-6 p-10 bg-white/5 border border-white/10 rounded-[40px]">
          <h3 className="text-2xl font-black italic text-blue-500 tracking-tight">2. Mastering the Ledger</h3>
          <p className="text-slate-400 leading-relaxed font-medium">Every time you contribute your monthly fund, the system generates an encrypted receipt. You can view these in your 'Payment History'. We recommend double-checking your email as well—every transaction is mirrored there for absolute transparency.</p>
        </section>
        <section className="space-y-6">
          <h3 className="text-2xl font-black italic text-white tracking-tight">3. Requesting Financial Aid</h3>
          <p className="text-slate-400 leading-relaxed font-medium">Members are eligible for society loans. Navigate to 'My Financials' in your dashboard. Enter the amount and duration—the system will automatically calculate the interest based on official committee rates.</p>
        </section>
      </div>
    </PageContainer>
  )
}

function Privacy({ onBack, isDark }) {
  return (
    <PageContainer title="Privacy Policy" onBack={onBack} isDark={isDark}>
      <div className="max-w-4xl mx-auto text-left space-y-10 mt-16 text-slate-400 font-medium leading-loose">
        <p className="text-xl text-white font-black italic">Your data is your legacy. We protect it with mathematical certainty.</p>
        <div className="space-y-4">
          <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Data Collection</h4>
          <p>We only collect essential identifies (Name, Email, Mobile) necessary for society verification and financial reporting. No third-party trackers are utilized within our core architecture.</p>
        </div>
        <div className="space-y-4 p-8 border border-white/5 bg-white/5 rounded-3xl">
          <h4 className="text-blue-500 font-black uppercase tracking-widest text-[10px]">Email Mirroring</h4>
          <p>By using APNA SOCIETY, you acknowledge that financial records are mirrored to your registered email address. This is a security feature to ensure you hold an immutable copy of your records outside our central database.</p>
        </div>
      </div>
    </PageContainer>
  )
}

function Terms({ onBack, isDark }) {
  return (
    <PageContainer title="Terms of Service" onBack={onBack} isDark={isDark}>
      <div className="max-w-4xl mx-auto text-left space-y-10 mt-16 text-slate-400 font-medium leading-loose">
        <div className="space-y-4">
          <h4 className="text-white font-black uppercase tracking-widest text-[10px]">1. Membership Binding</h4>
          <p>Registration as an official member constitutes a binding agreement to adhere to the society's monthly contribution schedules. Failure to maintain contributions may result in limited access to loan facilities.</p>
        </div>
        <div className="space-y-4">
          <h4 className="text-white font-black uppercase tracking-widest text-[10px]">2. Financial Integrity</h4>
          <p>Users agree that all data recorded via the APNA SOCIETY platform is the official record of truth. Committee decisions regarding dividend distributions and loan interests are final and processed algorithmically.</p>
        </div>
        <div className="p-1 w-full bg-gradient-to-r from-blue-600 to-emerald-400 rounded-2xl mt-12">
          <p className="bg-black p-6 rounded-[14px] text-center text-white font-black italic tracking-tighter">"Transparency is not a feature; it is our foundation."</p>
        </div>
      </div>
    </PageContainer>
  )
}
