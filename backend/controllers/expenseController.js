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

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

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
    await Expense.findByIdAndDelete(req.params.id); // Find and delete the expense by ID and userId
    res.json({ message: "Expense deleted successfully" }); // Respond with success message
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// for updating the expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // looks for record that matches the id and userId
      { ...req.body },
      { new: true, runValidators: true } // return the updated record and run validators
    );

    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(updated); // Return the updated expense as JSON
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(500).json({ message: "Server error" });
  }
};
