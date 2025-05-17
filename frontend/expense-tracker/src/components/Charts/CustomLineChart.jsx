import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { getCurrencySymbol } from "../../utils/helper";
import { useTheme } from "../../context/ThemeContext";

const CustomLineChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    const { currency } = useTheme();
    const currencySymbol = getCurrencySymbol(currency);
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300 dark:border-[#1c1c24] dark:bg-[#0a0a11]">
          <p className="text-xs front-semibold text-purple-800 mb-1 dark:text-[var(--primary)]">
            {payload[0].payload.category}
          </p>
          <p className="text-sm text-gray-600 dark:text-[#fcfbfc]">
            Amount:{" "}
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {currencySymbol}
              {payload[0].payload.amount}
            </span>
          </p>
        </div>
      );
    }

    return null;
  };
  return (
    <div className="bg-white dark:bg-[#0a0a11]">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            {/* Gradient for the area fill */}
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="month" // maps x-axis to month
            tick={{ fontSize: 12, fill: "var(--chartColor)" }}
            stroke="none"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--chartColor)" }}
            stroke="none"
          />
          <Tooltip content={<CustomTooltip />} />

          <Area // draws the actual filled line
            type="monotone" // smoothes the curve instead of sharp angles
            dataKey="amount" // plot this property from each data point
            stroke="#875cf5" //line color (purple)
            fill="url(#incomeGradient)" // uses the gradient defined earlier
            strokeWidth={3} // makes the width bolder
            dot={{ r: 3, fill: "#ab8df8" }} // adds dot on each point
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;

// 3:54:57
