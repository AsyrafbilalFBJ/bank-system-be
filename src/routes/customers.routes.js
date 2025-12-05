const express = require('express');
const CustomersController = require('../controllers/customers.controller');

const router = express.Router();

router.get('/', CustomersController.getCustomers);
router.get('/:id', CustomersController.getCustomer);
router.post('/', CustomersController.createCustomer);
router.put('/:id', CustomersController.updateCustomer);
router.delete('/:id', CustomersController.deleteCustomer);

module.exports = router;
