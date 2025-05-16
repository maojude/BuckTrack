import React, { act } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomBarChart = ({ data }) => {
  //Function to alternate colors
  const getBarColor = (index) => {
    return index % 2 === 0 ? "#875cf5" : "#cfbefb";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300 dark:border-[#1c1c24] dark:bg-[#0a0a11]">
          <p className="text-xs font-semibold text-purple-800 mb-1 dark:text-[var(--primary)]">
            {payload[0].payload.category}
          </p>
          <p className="text-sm text-gray-600 dark:text-[#fcfbfc]">
            Amount:{" "}
            <span className="text-sm text-gray-600 dark:text-white">
              ₱{payload[0].value}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6 dark:bg-[#0a0a11]">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "var(--chartColor)" }}
            stroke="none"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--chartSecondary)" }}
            stroke="none"
          />

          <Tooltip content={CustomTooltip} />

          <Bar
            dataKey="amount"
            fill="#FF8402"
            radius={[10, 10, 0, 0]}
            activeDot={{ r: 8, fill: "yellow" }}
            activeStyle={{ fill: "green" }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
