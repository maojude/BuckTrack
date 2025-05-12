import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";

const AddExpenseForm = ({ onAddExpense, initialData = null }) => {
  const [expense, setExpense] = useState({
    category: initialData?.category || "",
    amount: initialData?.amount || "",
    date: initialData?.date ? initialData.date.slice(0, 10) : "",
    icon: initialData?.icon || "",
    _id: initialData?._id || "",
  });

  // Since react is used, the expense state is copied and the specified key is updated with
  // the new value. This is done using the spread operator (...) to create a new object
  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="Rent, Groceries, etc."
        type="text"
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill "
          onClick={() => onAddExpense(expense)}
        >
          {initialData ? "Update" : "Add"} Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
