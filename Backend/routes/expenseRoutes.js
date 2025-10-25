const express = require('express');
const { addExpense, getExpense, deleteExpense,downloadExpense } = require('../controllers/expenseControllers');
const { protect } = require('../middleware/authMiddlewares');
const router = express.Router();

// Add expense
router.post('/add-expense', protect, addExpense);
// Get expenses
router.get('/get-expense', protect, getExpense);    
// Update expense
// router.put('/update-expense/:id', protect, updateExpense);
// Delete expense
router.delete('/delete-expense/:id', protect, deleteExpense);
// download expense
router.get("/download-expense" , protect, downloadExpense);
module.exports = router;
