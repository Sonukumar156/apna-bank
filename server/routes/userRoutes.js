const express = require('express');
const router = express.Router();
const { getMembers, getAllStats, updateMemberFinancials, updateProfile, deleteMember } = require('../controllers/userController');

router.get('/get-members-list', getMembers);
router.get('/get-dashboard-stats', getAllStats);
router.put('/members/:id/financials', updateMemberFinancials);
router.put('/profile/:id', updateProfile);
router.delete('/members/:id', deleteMember);

module.exports = router;
