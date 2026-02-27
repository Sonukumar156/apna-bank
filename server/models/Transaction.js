const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    memberName: { type: String, required: true },
    memberEmail: { type: String, required: true },
    type: { type: String, required: true }, // e.g., 'Collection', 'Loan Issued', 'Loan Payment', 'Bonus Received'
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: String, default: () => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
    transactionId: { type: String, unique: true, default: () => `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}` }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
