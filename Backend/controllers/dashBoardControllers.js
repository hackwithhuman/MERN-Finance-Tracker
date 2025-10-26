const mongoose = require("mongoose");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // --- Aggregations ---
    const totalIncomeAgg = await Income.aggregate([
      { $match: { userID: userObjectId } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const totalExpenseAgg = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const totalIncome = Number(totalIncomeAgg[0]?.totalAmount || 0);
    const totalExpense = Number(totalExpenseAgg[0]?.totalAmount || 0);
    const balance = totalIncome - totalExpense;

    // --- Fetch recent transactions ---
    const last10Income = await Income.find({ userID: userId })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    const last10Expense = await Expense.find({ userId: userId })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    // Tag transactions with type
    const transactions = [
      ...last10Income.map((i) => ({ ...i, type: "income", date: new Date(i.date) })),
      ...last10Expense.map((e) => ({ ...e, type: "expense", date: new Date(e.date) })),
    ];

    // Sort and slice last 5
    const last5Transactions = transactions
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
      last5Transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
