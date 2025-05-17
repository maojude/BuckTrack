import React from "react";
import CustomTooltip from "./CustomTooltip";
import CustomLegend from "./CustomLegend";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomPieChart = ({
  data = [],
  label,
  totalAmount,
  colors,
  showTextAnchor,
  nameKey = "name",
  dataKey = "amount",
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%" // center the pie chart
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {(data || []).map(
            (
              entry,
              index //Create a slice in the pie for each data entry
            ) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            )
          )}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />

        {showTextAnchor && (
          <g>
            <text
              x="50%"
              y="50%"
              dy={-25}
              textAnchor="middle"
              fill="var(--chartColor)"
              fontSize="14px"
            >
              {label}
            </text>
            <text
              x="50%"
              y="50%"
              dy={8}
              textAnchor="middle"
              fill="var(--chartSecondary)"
              fontSize="24px"
              fontWeight="semi-bold"
            >
              {totalAmount}
            </text>
          </g>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;

//2:46
