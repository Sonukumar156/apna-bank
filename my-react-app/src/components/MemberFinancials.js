import { useState } from 'react'

import { useLanguage } from '../contexts/LanguageContext'

export default function MemberFinancials({ user, onPay, isSubmitting }) {
    const { t } = useLanguage()
    const fin = user.financials || { collection: { status: 'due' }, loan: { active: false } };
    const loan = fin.loan || { active: false, amount: 0, remaining: 0, interestRate: 0, duration: 12, loanDate: 'N/A' };
    const monthlyInterest = (loan.active && parseFloat(loan.remaining) > 0)
        ? (parseFloat(loan.remaining) * (parseFloat(loan.interestRate) / 100))
        : 0;
    const totalOutstanding = parseFloat(loan.remaining || 0) + monthlyInterest;
    const isProfileComplete = user.panCard && user.aadharCard && user.accountNumber;

    const [payAmount, setPayAmount] = useState('');

    const handleLoanPay = (e) => {
        e.preventDefault();
        const amt = parseFloat(payAmount);
        if (amt > 0 && amt <= totalOutstanding) {
            onPay('loan', amt); // Changed from onPay to onRefresh based on diff
            setPayAmount('');
        }
    };

    return (
        <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700">
            {!isProfileComplete && (
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] flex items-center gap-4 animate-bounce">
                    <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl shrink-0">⚠️</div>
                    <div>
                        <h4 className="font-bold text-rose-900">{t('profile.incompleteProfile')}</h4>
                        <p className="text-xs text-rose-600 font-medium mt-1">{t('profile.completeProfileMessage')}</p>
                    </div>
                </div>
            )}
            {/* Quick Actions Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 lg:p-8 rounded-3xl lg:rounded-[32px] border border-slate-100 shadow-sm">
                <div>
                    <h3 className="text-xl lg:text-3xl font-bold text-slate-900 leading-tight">{t('financials.title')}</h3>
                    <p className="text-xs lg:text-sm font-medium text-slate-400 mt-2">{t('financials.subtitle')}</p>
                </div>
                <div className="flex w-full md:w-auto">
                    <div className="px-5 lg:px-6 py-2.5 lg:py-3 bg-slate-50 rounded-xl lg:rounded-2xl border border-slate-100 w-full text-center md:text-left">
                        <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t('financials.societyStatus')}</p>
                        <p className={`text-xs lg:text-sm font-bold ${fin.collection?.status === 'paid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {fin.collection?.status === 'paid' ? t('financials.noDues') : t('financials.dueFound')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Financial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* Monthly Society Fund */}
                <div className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-center mb-8 lg:mb-10">
                        <div>
                            <h4 className="text-lg lg:text-xl font-bold text-slate-900">{t('financials.fundStatus')}</h4>
                            <p className="text-xs lg:text-sm font-medium text-slate-400 mt-1">{t('financials.monthlyContribution')}</p>
                        </div>
                        <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl ${fin.collection?.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" />
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-6 lg:space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                            <div className="min-w-0">
                                <p className="text-xs lg:text-sm font-bold text-slate-400 mb-1 lg:mb-2 lowercase">{t('financials.amountDue')}</p>
                                <p className={`text-2xl lg:text-4xl font-bold tracking-tight truncate ${fin.collection?.status === 'paid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {fin.collection?.status === 'paid' ? t('financials.paid') : `₹${(user.planAmount || 1000).toLocaleString()}`}
                                </p>
                            </div>
                            {fin.collection?.status !== 'paid' && (
                                <button
                                    onClick={() => isProfileComplete ? onPay('society') : alert(t('profile.completeProfileAlert'))} // Changed from onPay to onRefresh
                                    disabled={isSubmitting || !isProfileComplete}
                                    className={`w-full sm:w-auto px-6 lg:px-8 py-3 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${isSubmitting || !isProfileComplete ? 'bg-slate-300 cursor-not-allowed opacity-50' : 'bg-slate-900 text-white hover:scale-105'}`}
                                >
                                    {isSubmitting ? t('common.processing') : t('financials.payNow', { amount: (user.planAmount || 1000).toLocaleString() })}
                                </button>
                            )}
                        </div>
                        <div className="h-3 lg:h-4 bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${fin.collection?.status === 'paid' ? 'w-full bg-emerald-500' : 'w-0'}`}></div>
                        </div>
                    </div>
                </div>

                {/* Combined Loan Card */}
                <div className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-center mb-8 lg:mb-10">
                        <div>
                            <h4 className="text-lg lg:text-xl font-bold text-slate-900">{t('financials.loanBalance')}</h4>
                            <p className="text-xs lg:text-sm font-medium text-slate-400 mt-1 text-slate-400">{t('financials.principalInterest')}</p>
                        </div>
                        <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl ${loan.active ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                            <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-6 lg:space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                            <div>
                                <p className="text-[10px] lg:text-xs font-bold text-slate-400 mb-1 lg:mb-2 uppercase tracking-widest">{t('financials.totalPayable')}</p>
                                <p className="text-2xl lg:text-4xl font-bold text-slate-900 tracking-tight truncate">
                                    ₹{totalOutstanding.toLocaleString()}
                                </p>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                                <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-1">{t('financials.dueDetails')}</p>
                                <p className="text-[10px] lg:text-xs font-bold text-slate-400">{t('financials.principal')}: ₹{parseFloat(loan.remaining || 0).toLocaleString()}</p>
                                <p className="text-[10px] lg:text-xs font-bold text-blue-500">{t('financials.interest')}: ₹{monthlyInterest.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${loan.status === 'paid' ? 'bg-emerald-500' : 'bg-blue-500'} ${loan.active ? 'animate-pulse' : ''}`}></span>
                            <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {loan.active ? (loan.status === 'paid' ? 'Loan fully cleared' : `Monthly interest ${loan.interestRate}% applied`) : 'No active loan balance'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Loan Breakdown & Payment */}
            {loan.active ? (
                <div className="bg-[#0f172a] rounded-[32px] lg:rounded-[48px] p-6 lg:p-12 text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-10 mb-10 lg:mb-16">
                            <div>
                                <h3 className="text-2xl lg:text-4xl font-bold tracking-tight mb-2 lg:mb-3">Loan Summary</h3>
                                <p className="text-slate-400 font-medium max-w-lg leading-relaxed text-sm lg:text-base">Clear your outstanding principal or pay monthly dues.</p>
                            </div>
                            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4 lg:gap-6 bg-white/5 p-5 lg:p-6 rounded-2xl lg:rounded-[32px] border border-white/10 backdrop-blur-md">
                                <div className="w-full sm:w-auto sm:px-6 sm:border-r border-white/10 text-center sm:text-left mb-4 sm:mb-0">
                                    <p className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Payable</p>
                                    <p className="text-xl lg:text-3xl font-bold text-white tracking-tight">₹{totalOutstanding.toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => isProfileComplete ? onPay('loan', totalOutstanding) : alert('Please complete your profile first!')}
                                    disabled={isSubmitting || !isProfileComplete}
                                    className={`w-full sm:w-auto px-8 lg:px-12 py-4 lg:py-5 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${isSubmitting || !isProfileComplete ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-emerald-500 text-white hover:bg-emerald-400'}`}
                                >
                                    {isSubmitting ? 'Processing...' : 'Pay Total Now'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
                            <div className="space-y-1.5 lg:space-y-3">
                                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest">Principal</p>
                                <p className="text-lg lg:text-4xl font-bold tracking-tight truncate">₹{parseFloat(loan.remaining || 0).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1.5 lg:space-y-3">
                                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest">Interest</p>
                                <p className="text-lg lg:text-4xl font-bold tracking-tight text-emerald-400 truncate">₹{monthlyInterest.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1.5 lg:space-y-3">
                                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest">Rate</p>
                                <p className="text-lg lg:text-4xl font-bold tracking-tight text-blue-400">{loan?.interestRate || 0}%</p>
                            </div>
                            <div className="space-y-1.5 lg:space-y-3">
                                <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Status</p>
                                <span className={`inline-block px-3 lg:px-5 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-[9px] lg:text-xs font-black uppercase tracking-widest bg-white/10 border border-white/10 ${loan.status === 'overdue' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {loan.status}
                                </span>
                            </div>
                        </div>

                        <div className="mt-10 lg:mt-16 pt-8 lg:pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 lg:gap-8">
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 lg:gap-4">
                                <div className="px-4 lg:px-6 py-2.5 lg:py-3 bg-white/5 rounded-xl lg:rounded-2xl border border-white/5 text-[9px] lg:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    Released: {loan.loanDate}
                                </div>
                            </div>
                            <div className="text-slate-500 font-bold text-[10px]">Verified Secure Transaction System</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-12 lg:p-24 border-2 border-dashed border-slate-200 rounded-3xl lg:rounded-[48px] text-center bg-slate-50/30">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8 text-slate-300 shadow-sm border border-slate-100">
                        <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h5 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">No Active Loans</h5>
                    <p className="text-slate-400 font-bold text-[10px] lg:text-sm mt-3 italic uppercase tracking-[0.15em]">Your credit history is healthy</p>
                </div>
            )}
        </div>
    );
}
