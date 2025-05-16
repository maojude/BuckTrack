import React from "react";
import moment from "moment";
import SavingGoalInfoCard from "../Cards/SavingGoalInfoCard";

const GoalsList = ({ goals, onExpand }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold text-gray-800">Goals List</h5>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals?.map((savingGoal) => {
          const daysLeft = moment(savingGoal.targetDate).diff(moment(), "days");

          return (
            <SavingGoalInfoCard
              key={savingGoal._id}
              title={savingGoal.title}
              icon={savingGoal.icon}
              targetAmount={savingGoal.targetAmount}
              savedAmount={savingGoal.savedAmount}
              daysLeft={daysLeft}
              onExpand={() => onExpand(savingGoal)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GoalsList;
