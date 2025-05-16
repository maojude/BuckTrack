const express = require("express");

const {
  addSavingGoal,
  addSavingFunds,
  getAllSavingGoals,
  deleteSavingGoal,
  removeSavingFunds,
  getSavingTransactions,
  updateSavingGoal,
} = require("../controllers/savingsController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/addSavingGoal", protect, addSavingGoal);
router.post("/addSavingFunds/:savingId", protect, addSavingFunds);
router.post("/removeSavingFunds/:savingId", protect, removeSavingFunds);
router.get("/getAllSavingGoals", protect, getAllSavingGoals);
router.get("/getSavingTransactions/:savingId", protect, getSavingTransactions);
router.delete("/deleteSavingGoal/:savingId", protect, deleteSavingGoal); // Delete route for savings
router.put("/updateSavingGoal/:savingId", protect, updateSavingGoal);

module.exports = router;
