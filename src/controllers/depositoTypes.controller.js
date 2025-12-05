const DepositoTypeModel = require('../models/depositoType.model');
const AccountModel = require('../models/account.model');
const { successResponse } = require('../utils/apiResponse');
const createHttpError = require('../utils/httpError');

const parseIdParam = (value) => {
  const id = Number(value);
  if (Number.isNaN(id) || id <= 0) {
    throw createHttpError(400, 'Invalid deposito type id');
  }
  return id;
};

const validatePayload = ({ name, yearly_return: yearlyReturn }) => {
  if (!name || !String(name).trim()) {
    throw createHttpError(400, 'Deposito type name is required');
  }
  const numericReturn = Number(yearlyReturn);
  if (Number.isNaN(numericReturn)) {
    throw createHttpError(400, 'yearly_return must be a number');
  }
  return { name: String(name).trim(), yearlyReturn: numericReturn };
};

const getDepositoTypes = async (req, res, next) => {
  try {
    const depositoTypes = await DepositoTypeModel.getAllDepositoTypes();
    res.json(successResponse(depositoTypes));
  } catch (error) {
    next(error);
  }
};

const getDepositoType = async (req, res, next) => {
  try {
    const id = parseIdParam(req.params.id);
    const depositoType = await DepositoTypeModel.getDepositoTypeById(id);
    if (!depositoType) {
      throw createHttpError(404, 'Deposito type not found');
    }
    res.json(successResponse(depositoType));
  } catch (error) {
    next(error);
  }
};

const createDepositoType = async (req, res, next) => {
  try {
    const payload = validatePayload(req.body || {});
    const depositoType = await DepositoTypeModel.createDepositoType(payload);
    res.status(201).json(successResponse(depositoType));
  } catch (error) {
    next(error);
  }
};

const updateDepositoType = async (req, res, next) => {
  try {
    const id = parseIdParam(req.params.id);
    const payload = validatePayload(req.body || {});

    const existing = await DepositoTypeModel.getDepositoTypeById(id);
    if (!existing) {
      throw createHttpError(404, 'Deposito type not found');
    }

    await DepositoTypeModel.updateDepositoType(id, payload);
    const updated = await DepositoTypeModel.getDepositoTypeById(id);
    res.json(successResponse(updated));
  } catch (error) {
    next(error);
  }
};

const deleteDepositoType = async (req, res, next) => {
  try {
    const id = parseIdParam(req.params.id);
    const existing = await DepositoTypeModel.getDepositoTypeById(id);
    if (!existing) {
      throw createHttpError(404, 'Deposito type not found');
    }

    const isUsed = await AccountModel.isDepositoTypeUsed(id);
    if (isUsed) {
      throw createHttpError(400, 'Cannot delete deposito type that is used by existing accounts');
    }

    await DepositoTypeModel.deleteDepositoType(id);
    res.json(successResponse({ id }, 'Deposito type deleted'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDepositoTypes,
  getDepositoType,
  createDepositoType,
  updateDepositoType,
  deleteDepositoType,
};
