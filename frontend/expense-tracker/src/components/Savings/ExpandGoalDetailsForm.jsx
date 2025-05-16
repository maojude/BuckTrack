import React, { useState, useEffect } from "react";
import moment from "moment";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "../layouts/Modal";
import FundActionForm from "./FundActionForm";

const ExpandGoalDetailsForm = ({ goal, setGoal }) => {
  if (!goal) return <p className="text-sm text-gray-400">Loading...</p>;

  const [transactions, setTransactions] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  // Handle adding and removal of funds
  const handleFundAction = async (type, amount) => {
    const endpoint = // so it can be used for both removal and addition of funds, endpoint is decided
      type === "add"
        ? API_PATHS.SAVINGS.ADD_SAVING_FUNDS(goal._id)
        : API_PATHS.SAVINGS.REMOVE_SAVING_FUNDS(goal._id);

    try {
      await axiosInstance.post(endpoint, { amount }); // Send the addition/removal request of funds to backend

      // Refresh transactions
      const txResponse = await axiosInstance.get(
        API_PATHS.SAVINGS.GET_SAVING_TRANSACTIONS(goal._id)
      );
      setTransactions(txResponse.data);

      // Refresh goal itself
      const allGoalsRes = await axiosInstance.get(
        API_PATHS.SAVINGS.GET_ALL_SAVING_GOALS
      );
      const updated = allGoalsRes.data.find((g) => g._id === goal._id); // find specified goal
      if (updated) setGoal(updated);

      if (type === "add") setOpenAddModal(false);
      else setOpenRemoveModal(false);
    } catch (error) {
      console.error("Error performing fund action:", error);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!goal?._id) return;

      try {
        const response = await axiosInstance.get(
          API_PATHS.SAVINGS.GET_SAVING_TRANSACTIONS(goal._id)
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    setOpenAddModal(false);
    setOpenRemoveModal(false);
    fetchTransactions();
  }, [goal]);

  const daysLeft = moment(goal.targetDate).diff(moment(), "days");
  const amountLeft = goal.targetAmount - goal.savedAmount;
  const percentage = Math.min(
    (goal.savedAmount / goal.targetAmount) * 100,
    100
  );

  return (
    <div className="space-y-6">
      {/* Icon + Title + Progress */}
      <div className="flex flex-col items-center">
        {/* Donut progress with icon */}
        <div className="relative w-16 h-16 mb-2">
          <CircularProgressbar
            value={percentage}
            strokeWidth={10}
            styles={buildStyles({
              pathColor: "#875cf5",
              trailColor: "var(--trailColor)",
            })}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xl">
            {goal.icon ? (
              <img src={goal.icon} alt="icon" className="w-6 h-6" />
            ) : (
              "🎯"
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {goal.title}
        </h3>
        <p className="text-sm text-gray-400">
          ₱{(goal.savedAmount ?? 0).toLocaleString()} / ₱
          {(goal.targetAmount ?? 0).toLocaleString()}
        </p>
      </div>
      {/* Target & Date Info */}
      <div className="flex justify-between text-sm text-gray-400">
        <div>
          <p className="font-medium dark:text-white">Target Amount</p>₱
          {(amountLeft ?? 0).toLocaleString()} left{" "}
          {/* toLocaleString adds commas to the number*/}
        </div>
        <div className="text-right">
          <p className="font-medium dark:text-white">Target Date</p>
          <p>{daysLeft} days left</p>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-between gap-4">
        <button
          className="w-full px-4 py-2 rounded-md bg-green-50 text-green-500 dark:bg-green-900 dark:text-green-300 cursor-pointer"
          onClick={() => setOpenAddModal(true)}
        >
          Add Funds
        </button>
        <button
          className="w-full px-4 py-2 rounded-md bg-red-50 text-red-500 dark:bg-red-900 dark:text-red-300 cursor-pointer"
          onClick={() => setOpenRemoveModal(true)}
        >
          Withdraw Funds
        </button>
      </div>

      {/* Transaction History */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2 dark:text-white">
          Transaction History
        </h4>
        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div
                key={tx._id}
                className="text-sm text-gray-600 rounded px-3 py-2 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium dark:text-gray-400">
                    {tx.type === "add" ? "Added" : "Withdrawn"}: ₱
                    {(tx.amount ?? 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {moment(tx.date).format("Do MMM YYYY")}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    tx.type === "add"
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {tx.type}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400">No transactions yet.</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        title="Add Funds"
      >
        <FundActionForm
          type="add"
          onSubmit={(amount) => handleFundAction("add", amount)}
        />
      </Modal>

      <Modal
        isOpen={openRemoveModal}
        onClose={() => setOpenRemoveModal(false)}
        title="Withdraw Funds"
      >
        <FundActionForm
          type="remove"
          onSubmit={(amount) => handleFundAction("remove", amount)}
        />
      </Modal>
    </div>
  );
};

export default ExpandGoalDetailsForm;
