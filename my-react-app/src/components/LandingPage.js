import { useState, useEffect } from 'react';

const FeatureCard = ({ title, desc, icon, isDark }) => (
    <div className={`group p-8 border rounded-[40px] transition-all duration-500 backdrop-blur-xl ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-white border-slate-200 shadow-sm hover:shadow-xl'
        }`}>
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 ${isDark ? 'bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
            }`}>
            {icon}
        </div>
        <h3 className={`text-2xl font-black mb-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
    </div>
);

export default function LandingPage({ onLogin, onRegister, onNavigate, isDark }) {
    return (
        <div className={`min-h-screen w-full flex flex-col font-['Inter',_sans-serif] overflow-x-hidden selection:bg-blue-600 selection:text-white transition-colors duration-500 ${isDark ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'
            }`}>
            {/* Global Nav is now in App.js */}

            {/* Immersive Hero Section */}
            <main className="relative flex-1 flex flex-col items-center justify-center min-h-[90vh] lg:min-h-screen pt-32 lg:pt-40 overflow-hidden">
                {/* Modern Animated Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[180px] animate-[pulse_8s_infinite]"></div>
                    <div className="absolute bottom-[0%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[180px] animate-[pulse_12s_infinite]"></div>
                </div>

                <div className="relative z-10 max-w-7xl w-full px-6 lg:px-24 flex flex-col items-center text-center">
                    <div className={`inline-flex items-center gap-2 px-6 py-2 border rounded-full mb-10 animate-in fade-in slide-in-from-top-12 duration-1000 ${isDark ? 'bg-white/5 border-white/10 text-blue-500' : 'bg-blue-50 border-blue-100 text-blue-600'
                        }`}>
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Next Gen Society Intelligence</span>
                    </div>

                    <h1 className="text-6xl lg:text-[140px] font-black leading-[0.85] tracking-tighter mb-10 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-200 text-white">
                        Smarter Societies.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-400">Digital Finance.</span>
                    </h1>

                    <p className={`text-xl lg:text-3xl font-medium max-w-4xl mb-16 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500 ${isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                        The definitive OS for managing committee funds, distributions, and member transparency. Built for modern communities that demand <span className="text-white italic underline decoration-blue-500 decoration-2">absolute precision.</span>
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                        <button onClick={onLogin} className="px-12 py-6 bg-blue-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all group">Get Started <svg className="inline w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></button>
                        <button onClick={() => document.getElementById('vision').scrollIntoView({ behavior: 'smooth' })} className={`px-12 py-6 border rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm'
                            }`}>Vision</button>
                    </div>

                    {/* Dashboard Teaser Visual */}
                    <div id="vision" className="mt-24 lg:mt-32 w-full relative group animate-in zoom-in duration-1000 delay-700">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-[64px] blur opacity-20 group-hover:opacity-40 transition-duration-500"></div>
                        <div className={`relative rounded-[60px] border-8 overflow-hidden shadow-2xl transition-all ${isDark ? 'border-white/5 bg-[#0a0a0b]' : 'border-white bg-[#f8fafc]'
                            }`}>
                            <img src="/society_hero.png" alt="Society Management Interface" className="w-full h-auto object-cover opacity-90 transition-transform duration-[10s] group-hover:scale-110" />
                            <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t transition-colors duration-1000 ${isDark ? 'from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent' : 'from-[#f8fafc] via-[#f8fafc]/40 to-transparent'
                                }`}></div>

                            {/* Floating Analytics Card */}
                            <div className={`absolute bottom-6 left-6 lg:bottom-10 lg:left-20 backdrop-blur-3xl p-6 lg:p-8 rounded-[40px] border text-left space-y-2 animate-bounce duration-[4000ms] transition-all ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-slate-200 shadow-2xl'
                                }`}>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Total Society Fund</p>
                                <p className={`text-3xl lg:text-4xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>₹24,50,000</p>
                                <div className="flex items-center gap-2 pt-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-[10px] font-black text-emerald-500">↑ 12.5% Growth</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Core Features */}
            <section className={`py-32 lg:py-48 px-6 lg:px-24 transition-colors duration-1000 ${isDark ? 'bg-[#0a0a0b]' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        <FeatureCard isDark={isDark} title="Zero Ledger Loss" desc="Every rupee is tracked with cryptographically secure logging. No more manual errors or missing receipts." icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
                        <FeatureCard isDark={isDark} title="Instant Loan Hub" desc="Members can request and manage loans with transparent interest calculations and automated reminders." icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
                        <FeatureCard isDark={isDark} title="Real-time Stats" desc="View collection progress, distributed dividends, and society health in beautiful real-time analytics." icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
                    </div>
                </div>
            </section>

            {/* Live Analytics Pulse Section */}
            <section className={`py-40 px-6 lg:px-24 transition-all duration-1000 relative overflow-hidden ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
                {/* Background Artifacts */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
                    <div className="absolute top-0 left-0 w-full h-px bg-white/5"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-white/5"></div>
                    <div className="absolute left-1/4 top-0 w-px h-full bg-white/5"></div>
                    <div className="absolute right-1/4 top-0 w-px h-full bg-white/5"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl lg:text-7xl font-black italic tracking-tighter text-white mb-6 uppercase">
                            Global <span className="text-blue-500">Society Pulse.</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.6em]">Real-time Financial Intelligence</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        {/* Custom Animated Graph Container */}
                        <div className="lg:col-span-8 p-12 lg:p-16 rounded-[60px] border border-white/10 bg-white/5 backdrop-blur-3xl relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-emerald-500/20 rounded-[61px] blur opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>

                            <div className="relative space-y-12">
                                {/* Bar 1: Total Members */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Members</p>
                                        <p className="text-2xl font-black text-white italic">150 +</p>
                                    </div>
                                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-blue-600 rounded-full animate-[slideRight_1.5s_ease-out_forwards]" style={{ width: '45%' }}></div>
                                    </div>
                                </div>

                                {/* Bar 2: Total Fund */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Society Fund</p>
                                        <p className="text-2xl font-black text-emerald-500 italic">₹42.50 L</p>
                                    </div>
                                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-emerald-500 rounded-full animate-[slideRight_2s_ease-out_forwards]" style={{ width: '85%' }}></div>
                                    </div>
                                </div>

                                {/* Bar 3: Loan Issued */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outward Loans Issued</p>
                                        <p className="text-2xl font-black text-white italic">₹18.00 L</p>
                                    </div>
                                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-slate-400 rounded-full animate-[slideRight_2.5s_ease-out_forwards]" style={{ width: '60%' }}></div>
                                    </div>
                                </div>

                                {/* Bar 4: Loan Receivable */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receivable Assets</p>
                                        <p className="text-2xl font-black text-blue-500 italic">₹5.20 L</p>
                                    </div>
                                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-blue-500 rounded-full animate-[slideRight_3s_ease-out_forwards]" style={{ width: '35%' }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative X-axis Labels */}
                            <div className="flex justify-between mt-8 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                                <span>Alpha Phase</span>
                                <span>Expansion</span>
                                <span>Optimization</span>
                                <span>Peak Capital</span>
                            </div>
                        </div>

                        {/* Analysis Content */}
                        <div className="lg:col-span-4 text-left space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black italic text-white tracking-tighter">Precision <br /> Reporting.</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    Our algorithmic tracking ensures that every variable is mirrored across our decentralized mirrors. No gaps, no lag.
                                </p>
                            </div>

                            <div className="p-8 border border-white/10 bg-white/5 rounded-[40px] space-y-4">
                                <span className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500 text-xl font-black italic">!</span>
                                <h4 className="text-base font-black text-white tracking-tight italic">Transparency Lock</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-loose">
                                    Live stats are updated every 60 seconds with 99.9% data integrity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes slideRight {
                        from { width: 0; }
                    }
                `}</style>
            </section>

            {/* Futuristic Footer */}
            <footer className={`border-t py-24 lg:py-32 px-6 lg:px-24 transition-all duration-1000 ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-3xl mb-10 shadow-2xl transition-all hover:scale-110 ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>A</div>
                    <h2 className={`text-4xl font-black italic mb-4 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>APNA SOCIETY</h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.6em] mb-16 text-center">The Future of Organized Societies</p>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-40 mb-20 text-center">
                        <div>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Explore</p>
                            <nav className="flex flex-col gap-5">
                                <button onClick={() => onNavigate('about')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>Mission</button>
                                <button onClick={() => onNavigate('services')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>Services</button>
                                <button onClick={() => onNavigate('contact')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>Support</button>
                            </nav>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Resources</p>
                            <nav className="flex flex-col gap-5">
                                <button onClick={() => onNavigate('offers')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>What We Offer</button>
                                <button onClick={() => onNavigate('guides')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>Guides</button>
                            </nav>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Legal</p>
                            <nav className="flex flex-col gap-5">
                                <button onClick={() => onNavigate('privacy')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>Privacy</button>
                                <button onClick={() => onNavigate('terms')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>Terms</button>
                            </nav>
                        </div>
                    </div>

                    <div className={`pt-12 border-t w-full flex flex-col items-center gap-10 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                        <div className={`flex items-center gap-4 py-3 px-6 rounded-full border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Encrypted & Verified Architecture</span>
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.6em] text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>© 2026 APNA SOCIETY SYSTEMS</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
