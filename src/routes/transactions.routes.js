const express = require('express');
const TransactionsController = require('../controllers/transactions.controller');

const router = express.Router();

router.post('/:id/deposit', TransactionsController.deposit);
router.post('/:id/withdraw', TransactionsController.withdraw);
router.get('/:id/calculate-ending-balance', TransactionsController.calculateAccountEndingBalance);

module.exports = router;
