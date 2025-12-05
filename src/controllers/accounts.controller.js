const AccountModel = require('../models/account.model');
const CustomerModel = require('../models/customer.model');
const DepositoTypeModel = require('../models/depositoType.model');
const { successResponse } = require('../utils/apiResponse');
const createHttpError = require('../utils/httpError');

const parseIdParam = (value, resourceName = 'id') => {
  const id = Number(value);
  if (Number.isNaN(id) || id <= 0) {
    throw createHttpError(400, `Invalid ${resourceName}`);
  }
  return id;
};

const getAccounts = async (req, res, next) => {
  try {
    const accounts = await AccountModel.getAllAccounts();
    res.json(successResponse(accounts));
  } catch (error) {
    next(error);
  }
};

const getAccount = async (req, res, next) => {
  try {
    const id = parseIdParam(req.params.id, 'account id');
    const account = await AccountModel.getAccountById(id);
    if (!account) {
      throw createHttpError(404, 'Account not found');
    }
    res.json(successResponse(account));
  } catch (error) {
    next(error);
  }
};

const createAccount = async (req, res, next) => {
  try {
    const { customer_id: customerId, deposito_type_id: depositoTypeId, balance = 0 } = req.body || {};

    const parsedCustomerId = parseIdParam(customerId, 'customer_id');
    const parsedDepositoTypeId = parseIdParam(depositoTypeId, 'deposito_type_id');
    const initialBalance = Number(balance || 0);
    if (Number.isNaN(initialBalance) || initialBalance < 0) {
      throw createHttpError(400, 'Balance must be a non-negative number');
    }

    const customer = await CustomerModel.getCustomerById(parsedCustomerId);
    if (!customer) {
      throw createHttpError(404, 'Customer not found');
    }

    const depositoType = await DepositoTypeModel.getDepositoTypeById(parsedDepositoTypeId);
    if (!depositoType) {
      throw createHttpError(404, 'Deposito type not found');
    }

    const account = await AccountModel.createAccount({
      customerId: parsedCustomerId,
      depositoTypeId: parsedDepositoTypeId,
      balance: initialBalance,
    });

    res.status(201).json(successResponse(account));
  } catch (error) {
    next(error);
  }
};

const updateAccountDepositoType = async (req, res, next) => {
  try {
    const id = parseIdParam(req.params.id, 'account id');
    const { deposito_type_id: depositoTypeId } = req.body || {};
    const parsedDepositoTypeId = parseIdParam(depositoTypeId, 'deposito_type_id');

    const account = await AccountModel.getAccountById(id);
    if (!account) {
      throw createHttpError(404, 'Account not found');
    }

    const depositoType = await DepositoTypeModel.getDepositoTypeById(parsedDepositoTypeId);
    if (!depositoType) {
      throw createHttpError(404, 'Deposito type not found');
    }

    await AccountModel.updateDepositoType(id, parsedDepositoTypeId);
    const updatedAccount = await AccountModel.getAccountById(id);
    res.json(successResponse(updatedAccount));
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const id = parseIdParam(req.params.id, 'account id');
    const account = await AccountModel.getAccountById(id);
    if (!account) {
      throw createHttpError(404, 'Account not found');
    }

    const hasTransactions = await AccountModel.accountHasTransactions(id);
    if (hasTransactions) {
      // Simplicity choice: keep history by preventing deletion when transactions exist.
      throw createHttpError(400, 'Cannot delete account with existing transactions');
    }

    await AccountModel.deleteAccount(id);
    res.json(successResponse({ id }, 'Account deleted'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAccounts,
  getAccount,
  createAccount,
  updateAccountDepositoType,
  deleteAccount,
};
