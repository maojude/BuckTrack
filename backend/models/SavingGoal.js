const mongoose = require("mongoose");

const SavingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    savedAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    date: { type: Date, default: Date.now },
    milestonesReached: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavingGoal", SavingsSchema);
