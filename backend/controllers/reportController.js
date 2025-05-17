const User = require("../models/User");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const SavingGoal = require("../models/SavingGoal");
const SavingTransaction = require("../models/SavingTransaction");

const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const get7DaysAgo = () => {
  const now = new Date();
  return new Date(now.setDate(now.getDate() - 7));
};

const getToday = () => new Date();

const summarizeTransactions = (arr, key) => {
  const summary = {};
  arr.forEach((item) => {
    const k = item[key];
    summary[k] = (summary[k] || 0) + item.amount;
  });
  return Object.entries(summary).map(([name, amount]) => ({ name, amount }));
};

const getFinancialReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const weeklyStart = get7DaysAgo();
    const monthStart = getStartOfMonth();
    const today = getToday();

    const [weeklyIncome, monthlyIncome] = await Promise.all([
      Income.find({ userId, date: { $gte: weeklyStart, $lte: today } }),
      Income.find({ userId, date: { $gte: monthStart, $lte: today } }),
    ]);

    const [weeklyExpense, monthlyExpense] = await Promise.all([
      Expense.find({ userId, date: { $gte: weeklyStart, $lte: today } }),
      Expense.find({ userId, date: { $gte: monthStart, $lte: today } }),
    ]);

    const [weeklySavings, monthlySavings] = await Promise.all([
      SavingTransaction.find({
        userId,
        date: { $gte: weeklyStart, $lte: today },
      }),
      SavingTransaction.find({
        userId,
        date: { $gte: monthStart, $lte: today },
      }),
    ]);

    const processData = async (income, expense, savings) => {
      const incomeSources = summarizeTransactions(income, "source");
      const expenseCategories = summarizeTransactions(expense, "category");

      const uniqueSavingIds = [
        ...new Set(savings.map((tx) => tx.savingId.toString())),
      ];
      const goals = await SavingGoal.find({
        _id: { $in: uniqueSavingIds },
      }).lean();
      const goalMap = {};
      goals.forEach((goal) => {
        goalMap[goal._id.toString()] = goal.title;
      });

      const savingsSummary = {};
      savings.forEach((tx) => {
        if (tx.type !== "add") return;
        const title = goalMap[tx.savingId.toString()] || "Unknown";
        if (!savingsSummary[title]) {
          savingsSummary[title] = 0;
        }
        savingsSummary[title] += tx.amount;
      });

      const savingsBreakdown = Object.entries(savingsSummary).map(
        ([title, amount]) => ({
          name: title,
          amount,
        })
      );

      return {
        totalIncome: income.reduce((a, b) => a + b.amount, 0),
        totalExpense: expense.reduce((a, b) => a + b.amount, 0),
        totalSavingsAdded: savings
          .filter((s) => s.type === "add")
          .reduce((a, b) => a + b.amount, 0),
        totalSavingsRemoved: savings
          .filter((s) => s.type === "withdraw")
          .reduce((a, b) => a + b.amount, 0),
        incomeSources,
        expenseCategories,
        savingsActivity: savingsBreakdown,
        topIncomeSource:
          incomeSources.sort((a, b) => b.amount - a.amount)[0]?.name || null,
        topExpenseCategory:
          expenseCategories.sort((a, b) => b.amount - a.amount)[0]?.name ||
          null,
      };
    };

    const [weekly, monthly] = await Promise.all([
      processData(weeklyIncome, weeklyExpense, weeklySavings),
      processData(monthlyIncome, monthlyExpense, monthlySavings),
    ]);

    res.status(200).json({
      weekly,
      monthly,
    });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ message: "Failed to generate report" });
  }
};

module.exports = { getFinancialReport };
