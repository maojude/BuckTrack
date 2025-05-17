import React from "react";
import moment from "moment";
import { LuChevronRight, LuPencil, LuTrash2 } from "react-icons/lu";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getCurrencySymbol } from "../../utils/helper";
import { useTheme } from "../../context/ThemeContext";

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

  const { currency } = useTheme();
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="group relative flex items-center gap-5 mt-2 p-3 rounded-lg hover:bg-gray-100/6 dark:hover:bg-[#202032]">
      {/* Circular progress with centered icon */}
      <div className="relative w-14 h-14">
        <CircularProgressbar
          value={percentage}
          strokeWidth={10}
          styles={buildStyles({
            pathColor: "#875cf5", // purple
            trailColor: "var(--trailColor)", // light gray
          })}
        />
        {/* Centered Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          {icon ? <img src={icon} alt={title} className="w-5 h-5" /> : "🎯"}
        </div>
      </div>

      <div className="flex items-center justify-between flex-1">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-white">
            {title}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {currencySymbol}
            {savedAmount} / {currencySymbol}
            {targetAmount} &bull; {daysLeft} days left
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Delete button*/}
        <button
          className="text-gray-400 transition-opacity opacity-0 cursor-pointer hover:text-red-500 group-hover:opacity-100"
          onClick={onDelete}
        >
          <LuTrash2 size={18} />
        </button>

        {/*Edit button*/}
        <button
          className="text-gray-400 transition-opacity opacity-0 cursor-pointer hover:text-blue-500 group-hover:opacity-100"
          onClick={onEdit}
        >
          <LuPencil size={18} />
        </button>

        <button
          className="text-gray-400 transition-opacity opacity-0 cursor-pointer hover:text-primary group-hover:opacity-100"
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
