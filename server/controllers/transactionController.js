const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Receipt = require('../models/Receipt');
const { sendEmail } = require('../utils/emailService');
const { generateReceiptPDF } = require('../utils/pdfGenerator');

exports.addTransaction = async (req, res) => {
    try {
        const { userId, type, amount, description } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Validations and Preparation
        if (type === 'Loan Issued') {
            if (user.financials.loan && user.financials.loan.active && user.financials.loan.remaining > 0) {
                return res.status(400).json({ message: 'User already has an active loan. Please clear it first.' });
            }
        }

        const newTransaction = new Transaction({
            userId,
            memberName: user.name,
            memberEmail: user.email,
            type,
            amount,
            description
        });

        // Update user financials based on transaction type
        if (type === 'Society Fund') {
            user.financials.collection.amount = (user.financials.collection.amount || 0) + amount;
            user.financials.collection.status = 'paid';
            user.financials.collection.date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        } else if (type === 'Loan Payment') {
            user.financials.loan.remaining = Math.max(0, user.financials.loan.remaining - amount);
            if (user.financials.loan.remaining <= 0) {
                user.financials.loan.status = 'paid';
                user.financials.loan.active = false; // Mark inactive when fully paid
            }
        } else if (type === 'Loan Issued') {
            const { interestRate, duration } = req.body;
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + parseInt(duration || 12));

            user.financials.loan = {
                active: true,
                loanId: `LOAN-${Math.floor(100000 + Math.random() * 899999)}`,
                amount: amount,
                interestRate: parseFloat(interestRate || 2),
                loanDate: new Date().toLocaleDateString('en-GB'),
                dueDate: dueDate.toLocaleDateString('en-GB'),
                remaining: amount,
                status: 'active'
            };
        }

        await newTransaction.save();
        await user.save();

        // RETURN RESPONSE IMMEDIATELY TO SPEED UP UI
        res.status(201).json(newTransaction);

        // SEND EMAIL IN BACKGROUND (NON-BLOCKING)
        (async () => {
            try {
                const pdfBuffer = await generateReceiptPDF(newTransaction, user);
                await sendEmail({
                    to: user.email,
                    subject: `Transaction Alert & Receipt: ${type}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                            <h2 style="color: #2563eb;">Transaction Notification</h2>
                            <p>Hi ${user.name},</p>
                            <p>This is to notify you about a recent transaction in your account. Please find the receipt attached.</p>
                            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                <p style="margin: 5px 0;"><strong>Type:</strong> ${type}</p>
                                <p style="margin: 5px 0;"><strong>Amount:</strong> ₹${amount.toLocaleString()}</p>
                                <p style="margin: 5px 0;"><strong>Description:</strong> ${description}</p>
                                <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${newTransaction.transactionId}</p>
                            </div>
                            <p>Best Regards,<br>AW SOCIETY Management</p>
                        </div>
                    `,
                    attachments: [
                        {
                            filename: `receipt_${newTransaction.transactionId}.pdf`,
                            content: pdfBuffer
                        }
                    ]
                });
            } catch (emailErr) {
                console.error('Background Notification email failed:', emailErr);
            }
        })();
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.distributeBonus = async (req, res) => {
    try {
        const { amount, description } = req.body;
        const members = await User.find({ role: 'user' });

        if (members.length === 0) {
            return res.status(400).json({ message: 'No members found to distribute bonus' });
        }

        const bonusTransactions = members.map(member => ({
            userId: member._id,
            memberName: member.name,
            memberEmail: member.email,
            type: 'Bonus',
            amount: parseFloat(amount),
            description: description || 'Annual Dividend / Bonus',
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        }));

        await Transaction.insertMany(bonusTransactions);

        // Send Email to all members
        members.forEach(async (member) => {
            try {
                await sendEmail({
                    to: member.email,
                    subject: 'Good News: Bonus Credited!',
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                            <h2 style="color: #059669;">Bonus Credited Successfully 💰</h2>
                            <p>Hi ${member.name},</p>
                            <p>We are happy to inform you that a bonus has been credited to your account.</p>
                            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #dcfce7;">
                                <p style="margin: 5px 0;"><strong>Bonus Amount:</strong> ₹${parseFloat(amount).toLocaleString()}</p>
                                <p style="margin: 5px 0;"><strong>Reason:</strong> ${description || 'Annual Dividend / Bonus'}</p>
                            </div>
                            <p>Check your dashboard for the updated balance.</p>
                            <br>
                            <p>Best Regards,<br>AW SOCIETY Management</p>
                        </div>
                    `
                });
            } catch (err) {
                console.error(`Failed to send bonus email to ${member.email}:`, err);
            }
        });

        res.status(201).json({ message: `Bonus of ₹${amount} distributed to ${members.length} members successfully.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.saveReceipt = async (req, res) => {
    try {
        const { userId, transactionId, generatedBy, pdfData, memberName, amount, type, date } = req.body;
        console.log(`📥 Saving receipt for TXN: ${transactionId}, Member: ${memberName}, PDF Size: ${pdfData ? (pdfData.length / 1024).toFixed(2) : 0} KB`);

        if (!generatedBy) {
            return res.status(400).json({ message: 'generatedBy field is required' });
        }

        // Find if receipt for this transaction already exists
        let receipt = await Receipt.findOne({ transactionId });

        if (receipt) {
            // Update to new flat structure and refresh PDF
            receipt.pdfData = pdfData;
            receipt.memberName = memberName;
            receipt.amount = amount;
            receipt.type = type;
            receipt.date = date;

            // Remove the old metadata field if it exists (for existing records)
            receipt.set('metadata', undefined, { strict: false });

            await receipt.save();
            return res.json({ message: 'Receipt updated to flat structure', receipt });
        }

        receipt = new Receipt({
            userId,
            transactionId,
            generatedBy,
            pdfData,
            memberName,
            amount,
            type,
            date
        });

        await receipt.save();

        // Send Email with Receipt PDF
        try {
            const user = await User.findById(userId);
            if (user && user.email) {
                await sendEmail({
                    to: user.email,
                    subject: `Payment Receipt: ${receipt.transactionId}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                            <h2>Payment Successful</h2>
                            <p>Hi ${memberName},</p>
                            <p>Your payment of <strong>₹${amount}</strong> for <strong>${type}</strong> has been received successfully.</p>
                            <p>Please find your official payment receipt attached to this email.</p>
                            <br>
                            <p>Best Regards,<br>Management Team</p>
                        </div>
                    `,
                    attachments: [
                        {
                            filename: `receipt_${receipt.transactionId}.pdf`,
                            path: pdfData // Nodemailer handles data URIs
                        }
                    ]
                });
            }
        } catch (emailErr) {
            console.error('Failed to send receipt email:', emailErr);
        }

        res.status(201).json({ message: 'Receipt saved and emailed successfully', receipt });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReceipt = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const receipt = await Receipt.findOne({ transactionId });
        if (!receipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        res.json(receipt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
