import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";

const AddSavingGoalForm = ({ onAddSavingGoal, initialData = null }) => {
  const [savingGoal, setSavingGoal] = useState({
    title: initialData?.title || "",
    icon: initialData?.icon || "",
    targetAmount: initialData?.targetAmount || "",
    targetDate: initialData?.targetDate
      ? initialData.targetDate.slice(0, 10)
      : "",
    _id: initialData?._id || "",
  });

  // Handles input changes
  const handleChange = (key, value) =>
    setSavingGoal({ ...savingGoal, [key]: value });

  return (
    <div>
      <EmojiPickerPopup
        icon={savingGoal.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={savingGoal.title}
        onChange={({ target }) => handleChange("title", target.value)}
        label="Title"
        placeholder="e.g. Emergency Fund"
        type="text"
      />

      <Input
        value={savingGoal.targetAmount}
        onChange={({ target }) => handleChange("targetAmount", target.value)}
        label="Target Amount"
        placeholder="e.g. 10000"
        type="number"
      />

      <Input
        value={savingGoal.targetDate}
        onChange={({ target }) => handleChange("targetDate", target.value)}
        label="Target Date"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddSavingGoal(savingGoal)}
        >
          {initialData ? "Update" : "Add"} Saving Goal
        </button>
      </div>
    </div>
  );
};

export default AddSavingGoalForm;
