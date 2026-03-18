const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// All members routes
router.post('/request', loanController.requestLoan);
router.get('/user/:userId', loanController.getUserLoanRequests);

// Admin routes
router.get('/all', loanController.getAllLoanRequests);
router.put('/status/:requestId', loanController.updateLoanStatus);
router.post('/pay/:requestId', loanController.payLoan);

module.exports = router;
