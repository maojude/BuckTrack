import React from "react";
import moment from "moment";
import { LuChevronRight, LuPencil, LuTrash2 } from "react-icons/lu";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SavingGoalInfoCard = ({
  title,
  icon,
  daysLeft,
  targetAmount,
  savedAmount,
  onExpand,
  onDelete,
  onEdit,
}) => {
  const percentage = Math.min((savedAmount / targetAmount) * 100, 100);

  return (
    <div className="group relative flex items-center gap-5 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
      {/* Circular progress with centered icon */}
      <div className="relative w-14 h-14">
        <CircularProgressbar
          value={percentage}
          strokeWidth={10}
          styles={buildStyles({
            pathColor: "#875cf5", // purple
            trailColor: "#e5e7eb", // light gray
          })}
        />
        {/* Centered Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          {icon ? <img src={icon} alt={title} className="w-5 h-5" /> : "🎯"}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 font-medium">{title}</p>
          <p className="text-xs text-gray-400 mt-1">
            ₱{savedAmount} / ₱{targetAmount} &bull; {daysLeft} days left
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Delete button*/}
        <button
          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={onDelete}
        >
          <LuTrash2 size={18} />
        </button>

        {/*Edit button*/}
        <button
          className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={onEdit}
        >
          <LuPencil size={18} />
        </button>

        <button
          className="text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={onExpand}
          title="Expand Goal"
        >
          <LuChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default SavingGoalInfoCard;
