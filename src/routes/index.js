const express = require('express');
const customersRouter = require('./customers.routes');
const accountsRouter = require('./accounts.routes');
const depositoTypesRouter = require('./depositoTypes.routes');
const transactionsRouter = require('./transactions.routes');

const router = express.Router();

router.use('/customers', customersRouter);
router.use('/accounts', accountsRouter);
router.use('/accounts', transactionsRouter);
router.use('/deposito-types', depositoTypesRouter);

module.exports = router;
