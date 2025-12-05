const CustomerModel = require('../models/customer.model');
const { successResponse } = require('../utils/apiResponse');
const createHttpError = require('../utils/httpError');

const parseIdParam = (value) => {
  const id = Number(value);
  if (Number.isNaN(id) || id <= 0) {
    throw createHttpError(400, 'Invalid customer id');
  }
  return id;
};

const getCustomers = async (req, res, next) => {
  try {
    const customers = await CustomerModel.getAllCustomers();
    res.json(successResponse(customers));
  } catch (error) {
    next(error);
  }
};

const getCustomer = async (req, res, next) => {
  try {
    const id = parseIdParam(req.params.id);
    const customer = await CustomerModel.getCustomerById(id);
    if (!customer) {
      throw createHttpError(404, 'Customer not found');
    }
    res.json(successResponse(customer));
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const { name } = req.body || {};
    if (!name || !String(name).trim()) {
      throw createHttpError(400, 'Customer name is required');
    }

    const customer = await CustomerModel.createCustomer(String(name).trim());
    res.status(201).json(successResponse(customer));
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const id = parseIdParam(req.params.id);
    const { name } = req.body || {};
    if (!name || !String(name).trim()) {
      throw createHttpError(400, 'Customer name is required');
    }

    const affected = await CustomerModel.updateCustomer(id, String(name).trim());
    if (!affected) {
      throw createHttpError(404, 'Customer not found');
    }

    const customer = await CustomerModel.getCustomerById(id);
    res.json(successResponse(customer));
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const id = parseIdParam(req.params.id);

    const hasAccounts = await CustomerModel.customerHasAccounts(id);
    if (hasAccounts) {
      throw createHttpError(400, 'Cannot delete customer with existing accounts');
    }

    const affected = await CustomerModel.deleteCustomer(id);
    if (!affected) {
      throw createHttpError(404, 'Customer not found');
    }

    res.json(successResponse({ id }, 'Customer deleted'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
