import React from 'react';
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';

// This component is used to display a list of income transactions.
// It takes in a list of transactions and a function to handle deletion of a transaction.
const IncomeList = ({ transactions, onDelete}) => {
  return (
    <div className="card">
        <div className="flex items-center justify-between">
            <h5 className="text-lg">Income Sources</h5>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
            {transactions.map((income) => (
                <TransactionInfoCard
                    key={income._id}
                    title={income.source}
                    icon={income.icon}
                    date={moment(income.date).format("Do MMM YYYY")}
                    amount={income.amount}
                    type="income"
                    onDelete={() => onDelete(income._id)}
                />
            ))}
        </div>
    </div>
  );
};

export default IncomeList;