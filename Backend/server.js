const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashBoardroutes = require('./routes/dashBoardRoutes');
const Expense = require('./models/Expense');
const { error } = require('console');
const { protect } = require('./middleware/authMiddlewares');

// Database connection 
connectDB();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    // origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}
));

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashBoardroutes);


app.post('/api/addexpenses', protect, async(req, res) => {
  try {
    const userId = req.user.id;
    const expenses = req.body.expenses;
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ message: "Invalid or empty data" });
    }
    // Attach userId to each expense and validate fields
    const expensesToSave = expenses.map(exp => ({
      userId: userId,
      icon: exp.icon,
      category: exp.category,
      amount: exp.amount,
      date: exp.date
    }));
    const savedExpenses = await Expense.insertMany(expensesToSave);
    res.status(201).json({
      message: "Expenses added successfully",
      data: savedExpenses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.get('/api', (req, res) => {
    res.send('Chal Raha hai...');

});

// Upload Folder
app.listen(PORT, () => {
    console.log(`Server ${PORT} par chal raha hai`);
});