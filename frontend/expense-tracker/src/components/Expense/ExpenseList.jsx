import React from "react";
import moment from "moment";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const ExpenseList = ({ transactions, onDelete, onEdit }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expense List</h5>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={expense.category}
            icon={expense.icon}
            date={moment(expense.date).format("Do MMM YYYY")} //moment converts raw date to a readable format
            amount={expense.amount}
            type="expense"
            onDelete={() => onDelete(expense._id)}
            onEdit={() => onEdit(expense._id)} // Pass the expense ID to the onEdit function
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
