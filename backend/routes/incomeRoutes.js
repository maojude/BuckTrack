const express = require("express");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  updateIncome,
} = require("../controllers/incomeController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.delete("/delete/:id", protect, deleteIncome);
router.put("/update/:id", protect, updateIncome);

module.exports = router;
