const mongoose = require('mongoose');

const LoanRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    memberName: { type: String, required: true },
    memberEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },
    requestDate: { type: String, default: () => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
    approvalDate: { type: String },
    paymentDate: { type: String },
    adminRemarks: { type: String },
    transactionId: { type: String },
    requestedInterestRate: { type: Number, default: 2 }, // Member's requested rate
    requestedDuration: { type: Number, default: 12 },     // Member's requested months
    interestRate: { type: Number },                        // Final rate set by admin
    duration: { type: Number }                             // Final months set by admin
}, { timestamps: true });

module.exports = mongoose.model('LoanRequest', LoanRequestSchema);
