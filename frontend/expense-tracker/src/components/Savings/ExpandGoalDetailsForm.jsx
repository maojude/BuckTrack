import React, { useState, useEffect } from "react";
import moment from "moment";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "../layouts/Modal";
import FundActionForm from "./FundActionForm";
import { getCurrencySymbol } from "../../utils/helper";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const ExpandGoalDetailsForm = ({ goal, setGoal }) => {
  if (!goal) return <p className="text-sm text-gray-400">Loading...</p>;

  const { user } = useContext(UserContext);

  const { currency } = useTheme();
  const currencySymbol = getCurrencySymbol(currency);

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
      const response = await axiosInstance.post(endpoint, { amount }); // Send the addition/removal request of funds to backend

      // Send milestone emails if applicable
      if (type === "add" && response.data.newlyCrossedMilestones?.length > 0) {
        const goalTitle = response.data.savingGoal.title;

        response.data.newlyCrossedMilestones.forEach((milestone) => {
          sendMilestoneEmail(milestone, goalTitle);
        });
      }

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

      toast.success(
        type === "add"
          ? "Funds added successfully!"
          : "Funds removed successfully!"
      );
    } catch (error) {
      console.error("Error performing fund action:", error);

      const message = error.response?.data?.message;

      if (error.response?.status === 400) {
        switch (message) {
          case "Amount must be greater than 0":
            toast.error("Amount must be greater than 0");
            break;
          case "Insufficient balance":
            toast.error("You don't have enough total balance for this saving");
            break;
          case "Insufficient funds in saving to withdraw":
            toast.error("Not enough saved funds to withdraw that amount");
            break;
          default:
            toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error(
          type === "add"
            ? "Failed to add funds. Please try again."
            : "Failed to remove funds. Please try again."
        );
      }
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

  const sendMilestoneEmail = (milestone, goalTitle) => {
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID, // replace with your actual EmailJS service ID
        import.meta.env.VITE_EMAILJS_SAVINGMILESTONE_TEMPLATE_ID, // replace with your actual template ID
        {
          user_name: user?.fullName || "User", // optional
          user_email: user?.email, // you might want to pass this down if it's not available here
          goal_title: goalTitle,
          milestone: `${milestone}%`,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        console.log(` Milestone ${milestone}% email sent!`);
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        console.log("Failed to send milestone email.");
      });
  };

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
          {currencySymbol}
          {(goal.savedAmount ?? 0).toLocaleString()} / {currencySymbol}
          {(goal.targetAmount ?? 0).toLocaleString()}
        </p>
      </div>
      {/* Target & Date Info */}
      <div className="flex justify-between text-sm text-gray-400">
        <div>
          <p className="font-medium dark:text-white">Target Amount</p>
          {currencySymbol}
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
          className="w-full px-4 py-2 text-green-500 rounded-md cursor-pointer bg-green-50 dark:bg-green-900 dark:text-green-300"
          onClick={() => setOpenAddModal(true)}
        >
          Add Funds
        </button>
        <button
          className="w-full px-4 py-2 text-red-500 rounded-md cursor-pointer bg-red-50 dark:bg-red-900 dark:text-red-300"
          onClick={() => setOpenRemoveModal(true)}
        >
          Withdraw Funds
        </button>
      </div>

      {/* Transaction History */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-white">
          Transaction History
        </h4>
        <div className="pr-1 space-y-2 overflow-y-auto max-h-40">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 rounded"
              >
                <div>
                  <p className="font-medium dark:text-gray-400">
                    {tx.type === "add" ? "Added" : "Withdrawn"}:{" "}
                    {currencySymbol}
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
