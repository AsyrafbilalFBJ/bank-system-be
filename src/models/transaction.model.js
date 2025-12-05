const { getConnection } = require("../config/db");

const getAccountForUpdate = async (connection, accountId) => {
  const [rows] = await connection.execute(
    `
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
      WHERE a.id = ?
      FOR UPDATE
    `,
    [accountId]
  );
  return rows[0];
};

const applyTransaction = async ({ accountId, amount, type }) => {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    const account = await getAccountForUpdate(connection, accountId);
    if (!account) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }

    const numericBalance = Number(account.balance);
    const numericAmount = Number(amount);

    if (type === "withdraw" && numericBalance < numericAmount) {
      const error = new Error("Insufficient balance");
      error.status = 400;
      throw error;
    }

    const newBalance =
      type === "deposit"
        ? numericBalance + numericAmount
        : numericBalance - numericAmount;

    const [transactionResult] = await connection.execute(
      "INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)",
      [accountId, type, numericAmount]
    );

    await connection.execute("UPDATE accounts SET balance = ? WHERE id = ?", [
      newBalance,
      accountId,
    ]);

    await connection.commit();

    return {
      account: {
        ...account,
        balance: newBalance,
      },
      transaction: {
        id: transactionResult.insertId,
        account_id: accountId,
        type,
        amount: numericAmount,
      },
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const depositToAccount = (accountId, amount) =>
  applyTransaction({ accountId, amount, type: "deposit" });

const withdrawFromAccount = (accountId, amount) =>
  applyTransaction({ accountId, amount, type: "withdraw" });

module.exports = {
  depositToAccount,
  withdrawFromAccount,
};
