const express = require('express');
const { addIncome, getIncomes, deleteIncome,downloadIncome } = require('../controllers/incomeControllers');
const { protect } = require('../middleware/authMiddlewares');

const router = express.Router();
// Add income
router.post('/add-income', protect, addIncome);
// Get incomes
router.get('/get-incomes', protect, getIncomes);    
// Update income
// router.put('/update-income/:id', protect, updateIncome);
// Delete income
router.delete('/delete-income/:id', protect, deleteIncome);
// download income
router.get("/download-income" , protect, downloadIncome);
module.exports = router;
