const TransactionModel = require("../models/transaction.model");
const AccountModel = require("../models/account.model");
const calculateEndingBalance = require("../utils/calculateEndingBalance");
const { successResponse } = require("../utils/apiResponse");
const createHttpError = require("../utils/httpError");

const parseAccountId = (value) => {
  const id = Number(value);
  if (Number.isNaN(id) || id <= 0) {
    throw createHttpError(400, "Invalid account id");
  }
  return id;
};

const validateTransactionPayload = ({ amount }) => {
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    throw createHttpError(400, "Amount must be greater than zero");
  }
  return { amount: numericAmount };
};

const deposit = async (req, res, next) => {
  try {
    const accountId = parseAccountId(req.params.id);
    const payload = validateTransactionPayload(req.body || {});

    const result = await TransactionModel.depositToAccount(
      accountId,
      payload.amount
    );
    res.status(201).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

const withdraw = async (req, res, next) => {
  try {
    const accountId = parseAccountId(req.params.id);
    const payload = validateTransactionPayload(req.body || {});

    const result = await TransactionModel.withdrawFromAccount(
      accountId,
      payload.amount
    );
    res.status(201).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

const calculateAccountEndingBalance = async (req, res, next) => {
  try {
    const accountId = parseAccountId(req.params.id);
    const account = await AccountModel.getAccountById(accountId);
    if (!account) {
      throw createHttpError(404, "Account not found");
    }

    const months = 12; // TODO: calculate months based on account start/end dates when business rules are defined.
    const result = calculateEndingBalance({
      startingBalance: Number(account.balance),
      yearlyReturn: Number(account.yearly_return),
      months,
    });

    res.json(
      successResponse({
        account_id: accountId,
        starting_balance: Number(account.balance),
        months: result.months,
        monthly_return: result.monthlyReturn,
        ending_balance: result.endingBalance,
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  deposit,
  withdraw,
  calculateAccountEndingBalance,
};
