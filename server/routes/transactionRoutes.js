const express = require('express');
const router = express.Router();
const { addTransaction, getTransactions, getUserTransactions, distributeBonus, saveReceipt, getReceipt } = require('../controllers/transactionController');

router.post('/', addTransaction);
router.post('/distribute-bonus', distributeBonus);
router.post('/save-receipt', saveReceipt);
router.get('/receipt/:transactionId', getReceipt);
router.get('/fetch-all-history', getTransactions);
router.get('/fetch-user-history/:userId', getUserTransactions);


module.exports = router;
