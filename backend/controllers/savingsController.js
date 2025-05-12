const User = require("../models/User");
const Savings = require("../models/Savings"); //load Savings model to interact with database

// Add Savings Source
exports.addSavings = async (req, res) => {
  const userId = req.user.id;

  try {
    const { title, targetAmount, savedAmount, date } = req.body;

    // Validation: Check for missing fields
    if (!title || !targetAmount || !savedAmount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSavings = new Savings({
      userId,
      title,
      targetAmount,
      savedAmount,
      date: new Date(date),
    });

    await newSavings.save(); // Save the new savings to the database
    res.status(200).json(newSavings);
  } catch (error) {
    console.error("Error adding savings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllSavings = async (req, res) => {
  const userId = req.user.id;

  try {
    const savings = await Savings.find({ userId });
    res.json(savings); // Return the savings data as JSON
  } catch (error) {
    console.error("Error fetching savings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Savings Source
exports.deleteSavings = async (req, res) => {
  try {
    await Savings.findByIdAndDelete(req.params.id); // Find and delete the savings by ID and userId
    res.json({ message: "Savings deleted successfully" }); // Respond with success message
  } catch (error) {
    console.error("Error deleting savings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
