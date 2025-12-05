const calculateEndingBalance = ({ startingBalance, yearlyReturn, months = 12 }) => {
  const monthlyReturn = (Number(yearlyReturn) || 0) / 12 / 100;
  let endingBalance = Number(startingBalance) || 0;

  for (let i = 0; i < months; i += 1) {
    endingBalance += endingBalance * monthlyReturn;
  }

  return {
    months,
    monthlyReturn,
    endingBalance,
  };
};

module.exports = calculateEndingBalance;
