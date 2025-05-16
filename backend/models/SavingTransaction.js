// models/SavingTransaction.js

const mongoose = require("mongoose");

const savingTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    savingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Savings",
      required: true,
    },
    type: {
      type: String,
      enum: ["add", "withdraw"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavingTransaction", savingTransactionSchema);
