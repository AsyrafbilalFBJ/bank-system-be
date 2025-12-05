const { query } = require('../config/db');

const getAllDepositoTypes = () =>
  query('SELECT id, name, yearly_return FROM deposito_types ORDER BY id');

const getDepositoTypeById = async (id) => {
  const rows = await query('SELECT id, name, yearly_return FROM deposito_types WHERE id = ?', [id]);
  return rows[0];
};

const createDepositoType = async ({ name, yearlyReturn }) => {
  const result = await query(
    'INSERT INTO deposito_types (name, yearly_return) VALUES (?, ?)',
    [name, yearlyReturn],
  );
  return getDepositoTypeById(result.insertId);
};

const updateDepositoType = async (id, { name, yearlyReturn }) => {
  const result = await query(
    'UPDATE deposito_types SET name = ?, yearly_return = ? WHERE id = ?',
    [name, yearlyReturn, id],
  );
  return result.affectedRows;
};

const deleteDepositoType = async (id) => {
  const result = await query('DELETE FROM deposito_types WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = {
  getAllDepositoTypes,
  getDepositoTypeById,
  createDepositoType,
  updateDepositoType,
  deleteDepositoType,
};
