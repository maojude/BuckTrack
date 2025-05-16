const express = require("express");

const {
  addSavingGoal,
  addSavingFunds,
  getAllSavingGoals,
  deleteSavingGoal,
  removeSavingFunds,
  getSavingTransactions,
} = require("../controllers/savingsController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/addSavingGoal", protect, addSavingGoal);
router.post("/addSavingFunds/:savingId", protect, addSavingFunds);
router.post("/removeSavingFunds/:savingId", protect, removeSavingFunds);
router.get("/getAllSavingGoals", protect, getAllSavingGoals);
router.get("/getSavingTransactions/:id", protect, getSavingTransactions);
router.delete("/deleteSavingGoal/:id", protect, deleteSavingGoal); // Delete route for savings

module.exports = router;
