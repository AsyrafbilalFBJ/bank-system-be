const express = require('express');
const DepositoTypesController = require('../controllers/depositoTypes.controller');

const router = express.Router();

router.get('/', DepositoTypesController.getDepositoTypes);
router.get('/:id', DepositoTypesController.getDepositoType);
router.post('/', DepositoTypesController.createDepositoType);
router.put('/:id', DepositoTypesController.updateDepositoType);
router.delete('/:id', DepositoTypesController.deleteDepositoType);

module.exports = router;
