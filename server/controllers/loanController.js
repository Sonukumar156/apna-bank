const LoanRequest = require('../models/LoanRequest');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Receipt = require('../models/Receipt');
const { sendEmail } = require('../utils/emailService');
const { generateReceiptPDF } = require('../utils/pdfGenerator');

// Member requests a loan
exports.requestLoan = async (req, res) => {
    try {
        const { userId, amount, purpose, requestedInterestRate, requestedDuration } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const existingRequest = await LoanRequest.findOne({ userId, status: { $in: ['pending', 'approved'] } });
        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending or approved loan request.' });
        }

        if (user.financials.loan && user.financials.loan.active) {
            return res.status(400).json({ message: 'You already have an active loan. Please clear it first.' });
        }

        const newRequest = new LoanRequest({
            userId,
            memberName: user.name,
            memberEmail: user.email,
            amount,
            purpose,
            requestedInterestRate: parseFloat(requestedInterestRate || 2),
            requestedDuration: parseInt(requestedDuration || 12)
        });

        await newRequest.save();
        res.status(201).json({ message: 'Loan request submitted successfully', request: newRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin gets all loan requests
exports.getAllLoanRequests = async (req, res) => {
    try {
        const requests = await LoanRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin updates loan status (Approve/Reject)
exports.updateLoanStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, adminRemarks } = req.body;

        const request = await LoanRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Loan request not found' });

        request.status = status;
        request.adminRemarks = adminRemarks;
        if (status === 'approved') {
            request.approvalDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        }

        await request.save();

        // Send email notification to member
        const user = await User.findById(request.userId);
        if (user) {
            await sendEmail({
                to: user.email,
                subject: `Loan Request Status updated: ${status.toUpperCase()}`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2>Loan Request Update</h2>
                        <p>Hi ${user.name},</p>
                        <p>Your loan request for <strong>₹${request.amount.toLocaleString()}</strong> has been <strong>${status}</strong>.</p>
                        ${adminRemarks ? `<p><strong>Admin Remarks:</strong> ${adminRemarks}</p>` : ''}
                        <p>Status: ${status}</p>
                        <br>
                        <p>Best Regards,<br>APNA SOCIETY Management</p>
                    </div>
                `
            });
        }

        res.json({ message: `Loan request ${status} successfully`, request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin pays the loan (Triggers transaction and receipt)
exports.payLoan = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { interestRate, duration } = req.body;

        const request = await LoanRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Loan request not found' });

        if (request.status !== 'approved') {
            return res.status(400).json({ message: 'Loan must be approved before payment.' });
        }

        const user = await User.findById(request.userId);
        if (!user) return res.status(404).json({ message: 'Member not found' });

        // 1. Create Transaction
        const newTransaction = new Transaction({
            userId: user._id,
            memberName: user.name,
            memberEmail: user.email,
            type: 'Loan Issued',
            amount: request.amount,
            description: `Loan disbursed for request: ${request.purpose}`
        });

        // 2. Update User Financials
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + parseInt(duration || 12));

        user.financials.loan = {
            active: true,
            loanId: `LOAN-${Math.floor(100000 + Math.random() * 899999)}`,
            amount: request.amount,
            interestRate: parseFloat(interestRate || 2),
            loanDate: new Date().toLocaleDateString('en-GB'),
            dueDate: dueDate.toLocaleDateString('en-GB'),
            remaining: request.amount,
            status: 'active'
        };

        // 3. Update Loan Request Status
        request.status = 'paid';
        request.paymentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        request.transactionId = newTransaction.transactionId;
        request.interestRate = parseFloat(interestRate || 2);
        request.duration = parseInt(duration || 12);

        await newTransaction.save();
        await user.save();
        await request.save();

        // 4. Generate Receipt and Send Email
        const pdfBuffer = await generateReceiptPDF(newTransaction, user);
        
        // Save to Receipt model for future reference
        const receipt = new Receipt({
            userId: user._id,
            transactionId: newTransaction.transactionId,
            generatedBy: 'admin',
            memberName: user.name,
            amount: request.amount,
            type: 'Loan Issued',
            date: new Date().toLocaleDateString('en-IN'),
            pdfData: pdfBuffer.toString('base64')
        });
        await receipt.save();

        await sendEmail({
            to: user.email,
            subject: 'Loan Disbursed - Receipt Attached',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #2563eb;">Loan Disbursment Successful</h2>
                    <p>Hi ${user.name},</p>
                    <p>Your loan request for <strong>₹${request.amount.toLocaleString()}</strong> has been processed and amount has been paid.</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <p style="margin: 5px 0;"><strong>Loan Amount:</strong> ₹${request.amount.toLocaleString()}</p>
                        <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${newTransaction.transactionId}</p>
                        <p style="margin: 5px 0;"><strong>Repayment Due Date:</strong> ${user.financials.loan.dueDate}</p>
                    </div>
                    <p>Please find the official receipt attached to this email.</p>
                    <br>
                    <p>Best Regards,<br>APNA SOCIETY Management</p>
                </div>
            `,
            attachments: [
                {
                    filename: `loan_receipt_${newTransaction.transactionId}.pdf`,
                    content: pdfBuffer
                }
            ]
        });

        res.json({ message: 'Loan paid and receipt sent successfully', request });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User gets their own loan requests
exports.getUserLoanRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await LoanRequest.find({ userId }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
