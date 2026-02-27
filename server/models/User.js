const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    address: { type: String },
    pincode: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    regNo: { type: String, unique: true },
    planAmount: { type: Number, default: 0 },
    planDuration: { type: String, default: '1' },
    regDate: { type: String, default: () => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
    panCard: { type: String, default: null },
    aadharCard: { type: String, default: null },
    accountHolder: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    financials: {
        collection: {
            status: { type: String, default: 'due' },
            amount: { type: Number, default: 0 },
            date: { type: String, default: null }
        },
        loan: {
            active: { type: Boolean, default: false },
            loanId: { type: String },
            amount: { type: Number, default: 0 },
            interestRate: { type: Number, default: 0 },
            loanDate: { type: String },
            dueDate: { type: String },
            remaining: { type: Number, default: 0 },
            status: { type: String, default: 'active' }
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
