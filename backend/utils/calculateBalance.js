const Income = require("../models/Income");
const Expense = require("../models/Expense");
const Savings = require("../models/Savings");
const { Types } = require("mongoose");

const calculateBalance = async (userId) => {
  const userObjectId = new Types.ObjectId(String(userId)); // String() to ensure it's a valid string, and then convert into proper MongoDB ObjectId

  const totalIncome = await Income.aggregate([
    { $match: { userId: userObjectId } }, // match userId
    { $group: { _id: null, total: { $sum: "$amount" } } }, //using null to group all documents together
  ]);

  const totalExpense = await Expense.aggregate([
    { $match: { userId: userObjectId } }, // match userId
    { $group: { _id: null, total: { $sum: "$amount" } } }, //using null to group all documents together
  ]);

  return (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0);
};

module.exports = calculateBalance;
