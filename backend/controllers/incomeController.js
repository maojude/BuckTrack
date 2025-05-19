const User = require("../models/User");
const Income = require("../models/Income"); //load Income model to interact with database

// Add Income Source
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    // Validation: Check for missing fields
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { totalBalance: amount },
    });

    const updatedUser = await User.findById(userId).select("totalBalance");
    console.log(`[AddIncome] New totalBalance: ₱${updatedUser.totalBalance}`);

    await newIncome.save(); // Save the new income to the database
    res.status(200).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get ALL Income Source
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 }); // Sort by date in descending order
    res.json(income); // Return the income data as JSON
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Income Source
exports.deleteIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!income) {
      return res
        .status(404)
        .json({ message: "Income not found or not authorized" });
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { totalBalance: -income.amount },
    });

    const updatedUser = await User.findById(userId).select("totalBalance");
    console.log(
      `[DeleteIncome] New totalBalance: ₱${updatedUser.totalBalance}`
    );

    res.json({ message: "Income deleted successfully" }); // Respond with success message
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Step 1: Get the existing income record
    const existingIncome = await Income.findOne({ _id: id, userId });

    if (!existingIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    const newAmount = req.body.amount;
    const oldAmount = existingIncome.amount;
    const difference = newAmount - oldAmount;

    // Step 2: Update the income record
    const updated = await Income.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    // Step 3: Adjust the user's totalBalance
    await User.findByIdAndUpdate(userId, {
      $inc: { totalBalance: difference },
    });

    const updatedUser = await User.findById(userId).select("totalBalance");
    console.log(
      `[UpdateIncome] New totalBalance: ₱${updatedUser.totalBalance}`
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(500).json({ message: "Server error" });
  }
};
