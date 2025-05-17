const express = require("express");
const { getFinancialReport } = require("../controllers/reportController.js");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/overview", protect, getFinancialReport);
module.exports = router;
