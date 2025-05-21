import React from "react";
import moment from "moment";
import SavingGoalInfoCard from "../Cards/SavingGoalInfoCard";

const GoalsList = ({ goals, onExpand, onEdit, onDelete }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
          Goals List
        </h5>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {goals?.map((savingGoal) => {
          const daysLeft = moment(savingGoal.targetDate)
            .startOf("day")
            .diff(moment().startOf("day"), "days");

          return (
            <SavingGoalInfoCard
              key={savingGoal._id}
              title={savingGoal.title}
              icon={savingGoal.icon}
              targetAmount={savingGoal.targetAmount}
              savedAmount={savingGoal.savedAmount}
              daysLeft={daysLeft}
              onExpand={() => onExpand(savingGoal)}
              onDelete={() => onDelete(savingGoal._id)}
              onEdit={() => onEdit(savingGoal._id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GoalsList;
