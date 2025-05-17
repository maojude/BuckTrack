import React, { useEffect, useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";
import { getCurrencySymbol } from "../../utils/helper";
import { useTheme } from "../../context/ThemeContext";

const COLORS = ["var(--primary)", "var(--red)", "var(--orange)", "#4f30f6"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);

  const { currency } = useTheme();
  const currencySymbol = getCurrencySymbol(currency);

  const prepareChartData = () => {
    const dataArr = data?.map((item) => ({
      name: item?.source,
      amount: item?.amount,
    }));

    setChartData(dataArr);
  };

  useEffect(() => {
    prepareChartData();

    return () => {};
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`${currencySymbol}${totalIncome}`}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomeWithChart;
