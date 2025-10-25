const mongoose = require('mongoose');
const Income = require('../models/Income');

const Expense = require('../models/Expense');


// dashBoard data
exports.getDashboardData = async (req, res) => {

    try{
        const userId = req.user.id;
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        const userobjectId = new mongoose.Types.ObjectId(userId);
        // fetch Total Income & expenses 
        const totalIncomeAgg = await Income.aggregate([
            { $match: { userID: userobjectId } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);

        console.log("Total Income Aggregate:", { totalIncomeAgg, isValidUserId: mongoose.isValidObjectId(userId) });

        // Expense model uses field 'userId'
        const totalExpenseAgg = await Expense.aggregate([
            { $match: { userId: userobjectId } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);
        // console.log("Total Expense Aggregate:", totalExpenseAgg);
        // const totalIncome = totalIncomeAgg[0] ? totalIncomeAgg[0].totalAmount : 0;
        // const totalExpense = totalExpenseAgg[0] ? totalExpenseAgg[0].totalAmount : 0;
        // const balance = totalIncome - totalExpense;

        // get income transaction for last 60 days
        const incomeLast60DaysTransaction = await Income.find({
            userID: userId,
            date: { $gte: new Date(Date.now() - 60*24*60*60*1000) }
        }).sort({ date: -1 });

    // get total income for last 60 days
    const incomelast60days = incomeLast60DaysTransaction.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

        // get expense transaction for last 30 days
        const expenseLast60DaysTransaction = await Expense.find({
            userId: userId,
            date: { $gte: new Date(Date.now() - 60*24*60*60*1000) }
        }).sort({ date: -1 });

    // get total expense for last 60 days
    const expenseLast60Days = expenseLast60DaysTransaction.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
//  fetch last 5 transaction ( income + expense )
    const last5IncomeTransactions = [ ...await Income.find({ userID: userId }).sort({ date: -1 }).limit(5) ];
    const last5ExpenseTransactions = [ ...await Expense.find({ userId: userId }).sort({ date: -1 }).limit(5) ];
        const last5Transactions = [ ...last5IncomeTransactions, ...last5ExpenseTransactions ]
            .sort((a, b) => b.date - a.date)
            .slice(0, 5);

        // Ensure aggregation results are numbers (default to 0)
        const totalIncome = Number(totalIncomeAgg[0]?.totalAmount || 0);
        const totalExpense = Number(totalExpenseAgg[0]?.totalAmount || 0);
        const balance = totalIncome - totalExpense;

        // Also return absolute balance and status for UI friendliness
        const balanceAbsolute = totalIncome-totalExpense;
        const balanceStatus = balance > 0 ? 'positive' : (balance < 0 ? 'negative' : 'zero');

        res.status(200).json({
            totalIncome,
            totalExpense,
            balance,
            balanceAbsolute,
            balanceStatus,
            incomelast60days,
            expenseLast60Days,
            last5Transactions
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}
