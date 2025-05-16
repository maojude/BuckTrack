import React from "react";
import { LuPlus } from "react-icons/lu";

const SavingsOverview = ({ totalSavingsAmount, onAddSavingGoal }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Total Savings: ₱ {totalSavingsAmount} </h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your savings goals and progress over time.
          </p>
        </div>

        <button className="add-btn" onClick={onAddSavingGoal}>
          <LuPlus className="text-lg" />
          Add Saving Goal
        </button>
      </div>
    </div>
  );
};

export default SavingsOverview;
