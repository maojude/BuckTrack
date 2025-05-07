const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// Dashboard Data
exports.getDashboardData = async (req, res) => {
    try{
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId)); // Convert userId to ObjectId
        
        //Fetch total income and expenses using mongoDB aggregation
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } }, // match userId
            { $group: { _id: null, total: { $sum: "$amount" } } }, //using null to group all documents together
        ]);

        console.log("totalIncome", {totalIncome, userId: isValidObjectId(userId)});

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } }, // match userId
            { $group: { _id: null, total: { $sum: "$amount" } } }, //using null to group all documents together
        ]);

        //Get income transactions in the last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }, // 60 days ago calculation from stack overflow
        }).sort({ date: -1 });

        //Get total income for last 60 days
        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        //Get expense transactions in the last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 days ago
        }).sort({ date: -1 });

        // Get total expense for last 30 days
        const expensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, //uses reduce to loop through array and sum up the amounts
            0
        );

        // Fetch last 5 transactions (income + expenses)
        const lastTransactions = [ 
            // the '...' spreads out the elements of an array into the new array
            // get last 5 income by using await to fetch income from database
            // sort date by -1 meaning descending (latest dates first)
            // .map() takes an array, runs a function on each element, and returns a new array
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
                //txn short for transaction as an argument (each object as a result from Income.find)
                //convert each transaction (mongoose doc) to a plain object
                //add type property to each object with value "income"
                //toObject() is a mongoose method that converts the document to a plain JavaScript object
                (txn) => ({
                    ...txn.toObject(),
                    type: "income",
                })
            ),

            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense",
                })
            ),
        ].sort((a, b) => b.date - a.date); // Sort latest first

        // Final Response
        res.json({
            totalBalance:
            //accesses totalIncome || totalExpense array, the questionmark is optional chaining used
            // to prevent code from breaking if the array is empty or undefined
            // || 0 is used to default 0 if undefined array
            (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpenses:{
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },

            recentTransactions: lastTransactions,
        });
    }catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}