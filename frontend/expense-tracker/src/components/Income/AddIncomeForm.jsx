import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";

const AddIncomeForm = ({ onAddIncome, initialData = null }) => {
  // The income state is an object with fields for source, amount, date, and icon.
  // The initial values for these fields are set to empty or from the values from initialData which is to be used for editing the data
  const [income, setIncome] = useState({
    source: initialData?.source || "",
    amount: initialData?.amount || "",
    date: initialData?.date ? initialData.date.slice(0, 10) : "",
    icon: initialData?.icon || "",
    _id: initialData?._id || "",
  });

  // Since react is used, the income state is copied and the specified key is updated with
  // the new value. This is done using the spread operator (...) to create a new object
  const handleChange = (key, value) => setIncome({ ...income, [key]: value });
  return (
    <div>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={income.source}
        onChange={({ target }) => handleChange("source", target.value)}
        label="Income Source"
        placeholder="Freelance, Salary, etc."
        type="text"
      />

      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />

      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill "
          onClick={() => onAddIncome(income)}
        >
          {initialData ? "Update" : "Add"} Income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
