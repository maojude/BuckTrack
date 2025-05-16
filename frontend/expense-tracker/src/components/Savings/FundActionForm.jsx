import React, { useState } from "react";
import Input from "../Inputs/Input";

const FundActionForm = ({ type = "add", onSubmit }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Enter a valid amount greater than 0.");
      return;
    }

    onSubmit(Number(amount));
  };

  return (
    <div className="space-y-4">
      <Input
        label="Amount"
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 rounded-md text-white ${
            type === "add" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {type === "add" ? "Add Funds" : "Withdraw Funds"}
        </button>
      </div>
    </div>
  );
};

export default FundActionForm;
