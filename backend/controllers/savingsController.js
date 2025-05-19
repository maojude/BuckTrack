const User = require("../models/User");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const SavingGoal = require("../models/SavingGoal"); //load Savings model to interact with database
const SavingTransaction = require("../models/SavingTransaction");

exports.addSavingGoal = async (req, res) => {
  const userId = req.user.id;

  try {
    const { title, targetAmount, targetDate, icon } = req.body;

    // Validation: Check for missing fields
    if (!title || !targetAmount || !targetDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSavingGoal = new SavingGoal({
      userId,
      icon,
      title,
      targetAmount,
      savedAmount: 0,
      targetDate: new Date(targetDate),
    });

    await newSavingGoal.save(); // Save the new saving goal to the database
    res.status(200).json(newSavingGoal);
  } catch (error) {
    console.error("Error adding saving goal:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all saving goals for selection
exports.getAllSavingGoals = async (req, res) => {
  const userId = req.user.id;

  try {
    const savingGoals = await SavingGoal.find({ userId }).sort({ date: -1 }); // Sort by date in descending order
    res.json(savingGoals); // Return the saving goals data as JSON
  } catch (error) {
    console.error("Error fetching saving goals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSavingTransactions = async (req, res) => {
  try {
    const userId = req.user.id; // passed by protect middleware
    const { savingId } = req.params; // Get the savingId from the request parameters

    const transactions = await SavingTransaction.find({
      userId,
      savingId,
    }).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching saving transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addSavingFunds = async (req, res) => {
  try {
    const userId = req.user.id; // passed by protect middleware
    const { savingId } = req.params; // Get the savingId from the request parameters
    const { amount } = req.body; // Get the amount from the request body

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const savingGoal = await SavingGoal.findOne({ _id: savingId, userId }); // Find the saving goal by ID and userId
    if (!savingGoal) {
      return res.status(404).json({ message: "Saving goal not found" });
    }

    // Check if user has enough balance to add the funds
    const user = await User.findById(userId);
    if (user.totalBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Increase the saved amount in the saving goal
    savingGoal.savedAmount += amount;
    await savingGoal.save();

    // Log the saving transaction
    await SavingTransaction.create({
      userId,
      savingId,
      type: "add",
      amount,
      date: new Date(),
    });

    //Log as expense
    await Expense.create({
      userId,
      category: `Move funds to savings: ${savingGoal.title}`,
      amount,
      date: new Date(),
      icon: savingGoal.icon,
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { totalBalance: -amount },
    });
    const updatedUser = await User.findById(userId).select("totalBalance");
    console.log(
      `[AddSavingFunds] New totalBalance: ₱${updatedUser.totalBalance}`
    );

    res
      .status(201)
      .json({ message: "Funds added to savings successfully", savingGoal });
  } catch (error) {
    console.error("Error adding saving transaction:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSavingGoal = async (req, res) => {
  try {
    const userId = req.user.id; // passed by protect middleware
    const { savingId } = req.params; // Get the savingId from the request parameters

    const saving = await SavingGoal.findOne({ _id: savingId, userId });

    if (!saving) {
      return res.status(404).json({ message: "Saving goal not found" });
    }

    if (saving.savedAmount > 0) {
      await Income.create({
        userId,
        source: `Refund from deleted goal: ${saving.title}`,
        amount: saving.savedAmount,
        date: new Date(),
        icon: saving.icon,
      });

      // Add to user's total balance the saved amount of the saving goal (Refund)
      await User.findByIdAndUpdate(userId, {
        $inc: { totalBalance: saving.savedAmount },
      });
      const updatedUser = await User.findById(userId).select("totalBalance");
      console.log(
        `[DeleteSavingGoal] New totalBalance: ₱${updatedUser.totalBalance}`
      );
    }

    // Delete related saving transactions
    await SavingTransaction.deleteMany({ savingId, userId });

    // Delete the saving goal
    await SavingGoal.deleteOne({ _id: savingId, userId });

    res.status(200).json({ message: "Saving goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting saving goal:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeSavingFunds = async (req, res) => {
  try {
    const userId = req.user.id; // passed by protect middleware
    const { savingId } = req.params; // Get the savingId from the request parameters
    const { amount } = req.body; // Get the amount from the request body

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const savingGoal = await SavingGoal.findOne({ _id: savingId, userId }); // Find the saving goal by ID and userId
    if (!savingGoal) {
      return res.status(404).json({ message: "Saving goal not found" });
    }

    // If amount to be withdrawn is less than the stored saved amount, show error
    if (savingGoal.savedAmount < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient funds in saving to withdraw" });
    }

    // Subtract the amount from the saved amount
    savingGoal.savedAmount -= amount;
    await savingGoal.save();

    // Log the saving transaction
    await SavingTransaction.create({
      userId,
      savingId,
      type: "withdraw",
      amount,
      date: new Date(),
    });

    //Log as income
    await Income.create({
      userId,
      source: `Moved from savings: ${savingGoal.title}`,
      amount,
      date: new Date(),
      icon: savingGoal.icon,
    });

    // Update user's totalBalance
    await User.findByIdAndUpdate(userId, {
      $inc: { totalBalance: amount },
    });
    const updatedUser = await User.findById(userId).select("totalBalance");
    console.log(`[RemoveFunds] New totalBalance: ₱${updatedUser.totalBalance}`);

    res
      .status(201)
      .json({ message: "Funds removed from savings successfully", savingGoal });
  } catch (error) {
    console.error("Error removing funds from savings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update saving goal
exports.updateSavingGoal = async (req, res) => {
  try {
    const { savingId } = req.params;

    const updated = await SavingGoal.findOneAndUpdate(
      { _id: savingId, userId: req.user.id }, // looks for the record
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating income: ", error);
    res.status(500).json({ message: "Server error" });
  }
};
