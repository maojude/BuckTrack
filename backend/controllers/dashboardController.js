const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

// Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // Parallel fetching using Promise.all
    const [
      totalIncomeAgg,
      totalExpenseAgg,
      incomeLast60Agg,
      expenseLast30Agg,
      last60DaysIncomeTransactions,
      last30DaysExpenseTransactions,
      recentIncome,
      recentExpenses,
    ] = await Promise.all([
      // Total Income
      Income.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // Total Expense
      Expense.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // Income in last 60 days
      Income.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // Expense in last 30 days
      Expense.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // Transactions list
      Income.find({
        userId,
        date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      }).sort({ date: -1 }),

      Expense.find({
        userId,
        date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }).sort({ date: -1 }),

      // Last 5 income
      Income.find({ userId }).sort({ date: -1 }).limit(5),

      // Last 5 expenses
      Expense.find({ userId }).sort({ date: -1 }).limit(5),
    ]);

    // Combine recent income and expenses
    const lastTransactions = [
      ...recentIncome.map((txn) => ({
        ...txn.toObject(),
        type: "income",
      })),
      ...recentExpenses.map((txn) => ({
        ...txn.toObject(),
        type: "expense",
      })),
    ].sort((a, b) => b.date - a.date);

    // Final response
    res.json({
      totalBalance:
        (totalIncomeAgg[0]?.total || 0) - (totalExpenseAgg[0]?.total || 0),
      totalIncome: totalIncomeAgg[0]?.total || 0,
      totalExpense: totalExpenseAgg[0]?.total || 0,
      last30DaysExpenses: {
        total: expenseLast30Agg[0]?.total || 0,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Agg[0]?.total || 0,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
