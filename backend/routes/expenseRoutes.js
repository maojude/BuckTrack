const express = require("express");
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  updateExpense,
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.delete("/delete/:id", protect, deleteExpense);
router.put("/update/:id", protect, updateExpense); // Update route for expenses

module.exports = router;
