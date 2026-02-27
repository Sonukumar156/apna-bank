import { useRef, useState } from 'react'
import { saveReceipt } from '../api'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export default function ReceiptModal({ transaction, user, onClose, currentRole }) {
    const receiptRef = useRef()
    const [saving, setSaving] = useState(false)

    const handlePrint = async () => {
        try {
            setSaving(true)
            // Generate PDF as string
            const element = receiptRef.current;
            const canvas = await html2canvas(element, {
                scale: 1.5,
                useCORS: true,
                logging: true,
                backgroundColor: '#ffffff',
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById('receipt-content');
                    if (el) el.style.color = '#000000';
                }
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.6);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            const pdfBase64 = pdf.output('datauristring'); // This is the string representation

            await saveReceipt({
                userId: user._id || user.id,
                transactionId: transaction.transactionId,
                generatedBy: currentRole || 'user',
                pdfData: pdfBase64,
                memberName: user.name,
                amount: transaction.amount,
                type: transaction.type,
                date: transaction.date
            })
        } catch (err) {
            console.error('Error saving receipt with PDF:', err)
        } finally {
            setSaving(false)
        }
        window.print()
    }

    if (!transaction) return null


    return (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300 print:p-0 print:bg-white">
            {/* CSS for A4 Print Formatting */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body * {
                        visibility: hidden;
                    }
                    .print-container, .print-container * {
                        visibility: visible;
                    }
                    .print-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 210mm;
                        height: 297mm;
                        margin: 0 auto !important;
                        padding: 20mm !important;
                        background: white !important;
                        box-shadow: none !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}} />

            <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col h-auto max-h-[90vh] print:max-h-none print:shadow-none print:w-full print:max-w-none print:rounded-none print-container">

                {/* Scrollable Container (Visible in UI, Hidden elements during Print) */}
                <div className="flex-1 overflow-y-auto bg-white custom-scrollbar print:overflow-visible">
                    <div ref={receiptRef} id="receipt-content" className="p-8 sm:p-12 bg-white" style={{ color: '#0f172a' }}>
                        <div className="text-center space-y-4 mb-10 border-b border-slate-100 pb-10" style={{ borderColor: '#f1f5f9' }}>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto shadow-xl mb-4 tracking-tighter" style={{ backgroundColor: '#2563eb', boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.2)' }}>AW</div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-1" style={{ color: '#0f172a' }}>AW SOCIETY</h1>
                                <h2 className="text-sm font-bold tracking-widest uppercase italic border-y py-1.5 my-3" style={{ color: '#2563eb', borderColor: '#dbeafe' }}>Official Payment Receipt</h2>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]" style={{ color: '#94a3b8' }}>Society Management Portal</p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1 text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest" style={{ color: '#94a3b8' }}>Transaction ID</p>
                                    <p className="text-sm font-black text-slate-900" style={{ color: '#0f172a' }}>{transaction.transactionId}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest" style={{ color: '#94a3b8' }}>Date</p>
                                    <p className="text-sm font-black text-slate-900" style={{ color: '#0f172a' }}>{transaction.date}</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl border space-y-4" style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }}>
                                <div className="flex justify-between items-center text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest" style={{ color: '#94a3b8' }}>Billed To</p>
                                    <p className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-lg" style={{ color: '#2563eb', backgroundColor: '#eff6ff' }}>{user.regNo}</p>
                                </div>
                                <div className="text-left">
                                    <p className="text-base font-black text-slate-900" style={{ color: '#0f172a' }}>{user.name}</p>
                                    <p className="text-xs font-bold text-slate-500 mt-0.5" style={{ color: '#64748b' }}>{user.email}</p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider" style={{ color: '#94a3b8' }}>{user.address}</p>
                                </div>
                            </div>

                            <div className="border-t border-b py-6 space-y-4" style={{ borderColor: '#f1f5f9' }}>
                                <div className="flex justify-between items-center text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest" style={{ color: '#94a3b8' }}>Description</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest" style={{ color: '#94a3b8' }}>Amount</p>
                                </div>
                                <div className="flex justify-between items-start text-left">
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-800" style={{ color: '#1e293b' }}>{transaction.type}</p>
                                        <p className="text-xs font-medium text-slate-500 max-w-[240px] leading-relaxed" style={{ color: '#64748b' }}>{transaction.description}</p>
                                    </div>
                                    <p className="text-lg font-black italic font-mono" style={{ color: '#0f172a' }}>₹{transaction.amount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <p className="text-sm font-black uppercase tracking-tighter" style={{ color: '#0f172a' }}>Total Paid</p>
                                <p className="text-3xl font-black italic" style={{ color: '#2563eb' }}>₹{transaction.amount.toLocaleString()}</p>
                            </div>

                            <div className="pt-10 flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full border" style={{ backgroundColor: '#ecfdf5', borderColor: '#d1fae5' }}>
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#059669' }}>Digitally Verified</span>
                                </div>
                                <p className="text-[9px] font-bold uppercase text-center leading-relaxed max-w-[280px]" style={{ color: '#94a3b8' }}>
                                    This is a computer generated receipt from AW SOCIETY.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer Actions (Hidden on Print) */}
                <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/50 no-print">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all font-bold"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        disabled={saving}
                        className={`flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 font-bold ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Saving to DB...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                Download as PDF (A4)
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
