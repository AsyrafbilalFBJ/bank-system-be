const { query } = require('../config/db');

const getAllCustomers = () =>
  query('SELECT id, name FROM customers ORDER BY id');

const getCustomerById = async (id) => {
  const rows = await query('SELECT id, name FROM customers WHERE id = ?', [id]);
  return rows[0];
};

const createCustomer = async (name) => {
  const result = await query('INSERT INTO customers (name) VALUES (?)', [name]);
  return getCustomerById(result.insertId);
};

const updateCustomer = async (id, name) => {
  const result = await query('UPDATE customers SET name = ? WHERE id = ?', [name, id]);
  return result.affectedRows;
};

const deleteCustomer = async (id) => {
  const result = await query('DELETE FROM customers WHERE id = ?', [id]);
  return result.affectedRows;
};

const customerHasAccounts = async (customerId) => {
  const rows = await query('SELECT COUNT(*) AS total FROM accounts WHERE customer_id = ?', [customerId]);
  return rows[0]?.total > 0;
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  customerHasAccounts,
};
