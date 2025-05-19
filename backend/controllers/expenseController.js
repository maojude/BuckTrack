const User = require("../models/User");
const Expense = require("../models/Expense"); //load Expense model to interact with database

// Add Expense Source
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    // Validation: Check for missing fields
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (user.totalBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { totalBalance: -amount },
    });
    const updatedUser = await User.findById(userId).select("totalBalance");
    console.log(`[AddExpense] New totalBalance: ₱${updatedUser.totalBalance}`);

    await newExpense.save(); // Save the new expense to the database
    res.status(200).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get ALL Expense Source
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 }); // Sort by date in descending order
    res.json(expense); // Return the expense data as JSON
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Expense Source
exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expense = await Expense.findByIdAndDelete(req.params.id); // Find and delete the expense by ID and userId

    if (!expense) {
      return res.status(404).json({ message: "Expense not found " });
    }

    // Find user and update totalBalance
    await User.findByIdAndUpdate(userId, {
      $inc: { totalBalance: expense.amount },
    });
    const updatedUser = await User.findById(userId).select("totalBalance");
    console.log(
      `[DeleteExpense] New totalBalance: ₱${updatedUser.totalBalance}`
    );

    res.json({ message: "Expense deleted successfully" }); // Respond with success message
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// for updating the expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingExpense = await Expense.findOne({ _id: id, userId });

    if (!existingExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const newAmount = req.body.amount;
    const oldAmount = existingExpense.amount;
    const difference = newAmount - oldAmount;

    // Get user's current balance
    const user = await User.findById(userId);

    // If user is increasing the expense, check balance
    if (difference > 0 && user.totalBalance < difference) {
      return res.status(400).json({
        message: "Insufficient balance to increase this expense",
      });
    }

    const updated = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // looks for record that matches the id and userId
      { ...req.body },
      { new: true, runValidators: true } // return the updated record and run validators
    );

    await User.findByIdAndUpdate(userId, {
      $inc: { totalBalance: -difference },
    });

    const updatedUser = await User.findById(userId).select("totalBalance");
    console.log(
      `[UpdateExpense] New totalBalance: ₱${updatedUser.totalBalance}`
    );

    res.status(200).json(updated); // Return the updated expense as JSON
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(500).json({ message: "Server error" });
  }
};
