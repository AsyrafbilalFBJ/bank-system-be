const { query } = require('../config/db');

const baseSelect = `
  SELECT 
    a.id,
    a.customer_id,
    a.deposito_type_id,
    a.balance,
    c.name AS customer_name,
    dt.name AS deposito_type_name,
    dt.yearly_return
  FROM accounts a
  INNER JOIN customers c ON c.id = a.customer_id
  INNER JOIN deposito_types dt ON dt.id = a.deposito_type_id
`;

const getAllAccounts = () => query(`${baseSelect} ORDER BY a.id`);

const getAccountById = async (id) => {
  const rows = await query(`${baseSelect} WHERE a.id = ?`, [id]);
  return rows[0];
};

const createAccount = async ({ customerId, depositoTypeId, balance = 0 }) => {
  const result = await query(
    'INSERT INTO accounts (customer_id, deposito_type_id, balance) VALUES (?, ?, ?)',
    [customerId, depositoTypeId, balance],
  );
  return getAccountById(result.insertId);
};

const updateDepositoType = async (id, depositoTypeId) => {
  const result = await query(
    'UPDATE accounts SET deposito_type_id = ? WHERE id = ?',
    [depositoTypeId, id],
  );
  return result.affectedRows;
};

const deleteAccount = async (id) => {
  const result = await query('DELETE FROM accounts WHERE id = ?', [id]);
  return result.affectedRows;
};

const accountHasTransactions = async (accountId) => {
  const rows = await query('SELECT COUNT(*) AS total FROM transactions WHERE account_id = ?', [accountId]);
  return rows[0]?.total > 0;
};

const isDepositoTypeUsed = async (depositoTypeId) => {
  const rows = await query('SELECT COUNT(*) AS total FROM accounts WHERE deposito_type_id = ?', [depositoTypeId]);
  return rows[0]?.total > 0;
};

module.exports = {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateDepositoType,
  deleteAccount,
  accountHasTransactions,
  isDepositoTypeUsed,
};
