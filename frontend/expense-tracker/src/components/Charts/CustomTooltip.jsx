import React from "react";
import { getCurrencySymbol } from "../../utils/helper";
import { useTheme } from "../../context/ThemeContext";

const CustomTooltip = ({ active, payload }) => {
  const { currency } = useTheme();
  const currencySymbol = getCurrencySymbol(currency);

  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300 dark:border-[#1c1c24] dark:bg-[#0a0a11]">
        <p className="text-xs font-semibold text-purple-800 mb-1 dark:text-[var(--primary)]">
          {payload[0].name}
        </p>
        <p className="text-sm text-gray-600 dark:text-[#fcfbfc]">
          Amount:{" "}
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {currencySymbol}
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
