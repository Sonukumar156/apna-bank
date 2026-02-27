const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.getMembers = async (req, res) => {
    try {
        const members = await User.find({ role: 'user' });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMemberFinancials = async (req, res) => {
    try {
        const { id } = req.params;
        const { financials } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { financials }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        // Also delete their transactions
        await Transaction.deleteMany({ userId: id });
        res.json({ message: 'Member and related transactions deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllStats = async (req, res) => {
    try {
        const members = await User.find({ role: 'user' }).lean();
        const transactions = await Transaction.find().sort({ createdAt: -1 }).lean();

        // Attach history to each member for backward compatibility with frontend components
        const membersWithHistory = members.map(m => ({
            ...m,
            history: transactions.filter(t => t.userId.toString() === m._id.toString())
        }));

        const totalCollection = members.reduce((sum, m) => sum + (m.financials.collection.amount || 0), 0);
        const pendingAmount = members.reduce((sum, m) => sum + (m.financials.collection.status === 'due' ? (m.planAmount || 1000) : 0), 0);
        const outstandingLoan = members.reduce((sum, m) => sum + (m.financials.loan.remaining || 0), 0);
        const activeLoans = members.filter(m => m.financials.loan.active).length;

        const stats = {
            totalMembers: members.length,
            totalCollection,
            pendingAmount,
            outstandingLoan: outstandingLoan.toFixed(0),
            activeLoans,
            totalInterest: transactions.filter(t => t.type === 'Loan Payment').reduce((sum, t) => sum + (t.amount * 0.05), 0) // Example calculation
        };
        res.json({ members: membersWithHistory, stats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
