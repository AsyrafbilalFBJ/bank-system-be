const express = require('express');
const AccountsController = require('../controllers/accounts.controller');

const router = express.Router();

router.get('/', AccountsController.getAccounts);
router.get('/:id', AccountsController.getAccount);
router.post('/', AccountsController.createAccount);
router.put('/:id', AccountsController.updateAccountDepositoType);
router.delete('/:id', AccountsController.deleteAccount);

module.exports = router;
