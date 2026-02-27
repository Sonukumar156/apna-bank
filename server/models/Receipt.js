const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    transactionId: { type: String, required: true },
    generatedBy: { type: String, enum: ['admin', 'user'], required: true },
    receiptNo: { type: String, unique: true, default: () => `RCPT${Date.now()}${Math.floor(1000 + Math.random() * 9000)}` },
    generatedAt: { type: String, default: () => new Date().toLocaleString('en-IN') },
    memberName: { type: String },
    amount: { type: Number },
    type: { type: String },
    date: { type: String },
    pdfData: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Receipt', ReceiptSchema);
