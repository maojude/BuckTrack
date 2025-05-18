import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import CustomPieChart from "../../components/Charts/CustomPieChart"; // reusable chart component
import { useTheme } from "../../context/ThemeContext";
import { addThousandsSeparator } from "../../utils/helper";
import { getCurrencySymbol } from "../../utils/helper";

const Reports = () => {
  const [report, setReport] = useState(null);
  const { currency } = useTheme();
  const currencySymbol = getCurrencySymbol(currency);

  const incomeColors = [
    "#8b5cf6",
    "#a78bfa",
    "#c4b5fd",
    "#d8b4fe",
    "#f0abfc",
    "#f9a8d4",
    "#fca5a5",
    "#f87171",
    "#fb923c",
    "#fde68a",
    "#bef264",
    "#6ee7b7",
    "#5eead4",
    "#67e8f9",
    "#93c5fd",
  ];

  const expenseColors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#84cc16",
    "#22c55e",
    "#14b8a6",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#eab308",
    "#34d399",
    "#4ade80",
  ];

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.REPORT.GET_REPORT);
        setReport(res.data);
      } catch (error) {
        console.error("Failed to fetch report:", error);
      }
    };

    fetchReport();
  }, []);

  if (!report) return <p className="mt-6 text-center">Loading report...</p>;

  const renderSection = (label, data) => (
    <div className="mb-6 card">
      <h2 className="mb-2 text-lg font-semibold">{label} Report</h2>

      <p className="mb-2 text-sm">
        Total Income: {currencySymbol}
        {addThousandsSeparator(data.totalIncome)}
        <br />
        Total Expense: {currencySymbol}
        {addThousandsSeparator(data.totalExpense)}
        <br />
        Total Saved: {currencySymbol}
        {addThousandsSeparator(data.totalSavingsAdded)}
      </p>

      <CustomPieChart
        data={data.incomeSources}
        label="Income Breakdown"
        totalAmount={`${currencySymbol}${addThousandsSeparator(
          data.totalIncome
        )}`}
        showTextAnchor
        colors={incomeColors}
      />

      <CustomPieChart
        data={data.expenseCategories}
        label="Expense Breakdown"
        totalAmount={`${currencySymbol}${addThousandsSeparator(
          data.totalExpense
        )}`}
        showTextAnchor
        colors={expenseColors}
      />

      <CustomPieChart
        data={data.savingsActivity}
        label="Savings Activity"
        totalAmount={`${currencySymbol}${addThousandsSeparator(
          data.totalSavingsAdded
        )}`}
        showTextAnchor
        colors={["#4ade80", "#f87171", "#c084fc"]}
        nameKey="name"
        dataKey="amount"
      />

      <div className="mt-4 text-sm">
        Most frequent income source: <strong>{data.topIncomeSource}</strong>
        <br />
        Most frequent expense category:{" "}
        <strong>{data.topExpenseCategory}</strong>
      </div>
    </div>
  );

  return (
    <DashboardLayout activeMenu="Reports">
      <div className="mx-auto my-5">
        {renderSection("Weekly", report.weekly)}
        {renderSection("Monthly", report.monthly)}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
