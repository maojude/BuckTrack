import React from "react";
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
  LuPencil,
} from "react-icons/lu";
import { getCurrencySymbol } from "../../utils/helper";
import { useTheme } from "../../context/ThemeContext";

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
  hideEditBtn,
  onEdit,
}) => {
  const { currency } = useTheme();
  const currencySymbol = getCurrencySymbol(currency);

  const getAmountStyles = () =>
    type === "income"
      ? "bg-green-50 text-green-500 dark:bg-green-900 dark:text-green-300"
      : "bg-red-50 text-red-500 dark:bg-red-900 dark:text-red-300";

  return (
    <div className=" group relative flex items-center gap-5 mt-2 p-3 rounded-lg hover:bg-gray-100/60 dark:hover:bg-[#202032]">
      <div className="flex items-center justify-center w-12 h-12 text-xl text-gray-800 bg-gray-100 rounded-full dark:bg-purple-950/30">
        {icon ? (
          <img src={icon} alt={title} className="w-6 h-6" />
        ) : (
          <LuUtensils />
        )}
      </div>

      <div className="flex items-center justify-between flex-1">
        <div>
          <p className="text-sm text-gray-700 font-medium dark:text-[var(--text)]">
            {title}
          </p>
          <p className="mt-1 text-xs text-gray-400">{date}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!hideEditBtn && (
          <button
            className="text-gray-400 transition-opacity opacity-0 cursor-pointer hover:text-blue-500 group-hover:opacity-100"
            onClick={onEdit}
          >
            <LuPencil size={18} />
          </button>
        )}

        {!hideDeleteBtn && (
          <button
            className="text-gray-400 transition-opacity opacity-0 cursor-pointer hover:text-red-500 group-hover:opacity-100"
            onClick={onDelete}
          >
            <LuTrash2 size={18} />
          </button>
        )}

        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
        >
          <h6 className="text-xs font-medium ">
            {type === "income" ? "+" : "-"} {currencySymbol}
            {amount}
          </h6>
          {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;
