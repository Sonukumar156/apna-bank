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
        console.log(`🛠️ Updating profile for ID: ${id} | Fields: ${Object.keys(req.body).join(', ')}`);
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
        // Parallel fetching for performance
        const [members, transactions, aggStats] = await Promise.all([
            User.find({ role: 'user' }).select('-password').lean(),
            Transaction.find().sort({ createdAt: -1 }).limit(100).lean(), // Limit to latest 100 for dashboard
            User.aggregate([
                { $match: { role: 'user' } },
                {
                    $group: {
                        _id: null,
                        totalCollection: { $sum: { $ifNull: ["$financials.collection.amount", 0] } },
                        pendingAmount: { 
                            $sum: { 
                                $cond: [
                                    { $eq: ["$financials.collection.status", "due"] },
                                    { $ifNull: ["$planAmount", 1000] },
                                    0
                                ] 
                            } 
                        },
                        outstandingLoan: { $sum: { $ifNull: ["$financials.loan.remaining", 0] } },
                        activeLoans: { $sum: { $cond: ["$financials.loan.active", 1, 0] } }
                    }
                }
            ])
        ]);

        const statsResult = aggStats[0] || { totalCollection: 0, pendingAmount: 0, outstandingLoan: 0, activeLoans: 0 };

        // Efficient Transaction Map for O(N+M) history attachment
        const txnMap = new Map();
        transactions.forEach(t => {
            const userId = t.userId.toString();
            if (!txnMap.has(userId)) txnMap.set(userId, []);
            txnMap.get(userId).push(t);
        });

        const membersWithHistory = members.map(m => ({
            ...m,
            history: txnMap.get(m._id.toString()) || []
        }));

        const stats = {
            totalMembers: members.length,
            totalCollection: statsResult.totalCollection,
            pendingAmount: statsResult.pendingAmount,
            outstandingLoan: statsResult.outstandingLoan.toFixed(0),
            activeLoans: statsResult.activeLoans,
            totalInterest: transactions.reduce((sum, t) => 
                t.type === 'Loan Payment' ? sum + (t.amount * 0.05) : sum, 0)
        };
        
        res.json({ members: membersWithHistory, stats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
