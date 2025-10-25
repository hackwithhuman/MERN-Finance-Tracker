const express = require('express');
const Expense = require('../models/Expense')
const xlsx = require("xlsx");

// Add expense
exports.addExpense = async (req, res) => {
    const { userId, icon, category, amount, date } = req.body;
    try{
        if(!category || !amount || amount <= 0){
            return res.status(400).json({message:"Please Fill all the required fields"});
        }
        const expense = new Expense({
            userId: req.user.id,
            icon,
            category,
            amount,
            date
        });
        await expense.save();
        return res.status(201).json({expense , message: "Expense added successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}
// Get expenses
exports.getExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        if (!expenses || expenses.length === 0) {
            return res.status(404).json({ message: 'No expenses found' });
        }
        return res.status(200).json({ expenses });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
// Delete expense
exports.deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const expense = await Expense.findById(expenseId);
        if (!expense || !expense.userId.equals(req.user.id)){
            return res.status(404).json({ message: 'Expense not found' });
        }else{
            await Expense.findByIdAndDelete(expenseId);

            return res.status(200).json({expense, message: 'Expense deleted successfully' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
// Download expense
exports.downloadExpense = async (req, res) => {
     try{
         const userId = req.user.id;
         const expense = await Expense.find({ userId: userId });
         if (!expense || expense.length === 0) {
             return res.status(404).json({ expense,message: 'No expenses found' });
         }
         // Prepare data for download
         const expenseData = expense.map((item) => ({
             icon: item.icon,
             category: item.category,
             amount: item.amount,
             date: item.date
         }));
         const wb = xlsx.utils.book_new();
         const ws = xlsx.utils.json_to_sheet(expenseData);
         xlsx.utils.book_append_sheet(wb, ws, "Expenses");
         const buf = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
         res.setHeader('Content-Disposition', 'attachment; filename="expenses.xlsx"');
         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
         res.status(200).send(buf);
        }
        catch(error){
     
        res.status(500).json({ message: 'Server Error', error: error.message });
        }
};

