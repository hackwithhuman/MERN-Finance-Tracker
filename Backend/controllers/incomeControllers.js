const Income = require("../models/Income");
const user = require("../models/UersSchema");
const xlsx = require("xlsx");


exports.addIncome = async (req, res) => {
    try {
        const userId = req.user.id;
        const { icon, source, amount, date } = req.body;
        // Validation
      if(!source || !amount || !date){
        return res.json({message: 'Please fill in all required fields'});
      }  
      if(amount <= 0){
        return res.json({message:'ammount must be greater then 0'});
      }
        // Create new income
        try {
            const income = new Income({
                userID: req.user.id,
                icon,
                source,
                amount,
                date: new Date(date)
            })
            await income.save();
            res.status(201).json({ income, message: 'Income added successfully' });
        } catch (error) {
            res.status(400).json({ message: 'Something went wrong', error: error.message });
        }   
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get all incomes for a user
exports.getIncomes = async (req, res) => {
    try {
        const id = req.user.id;
        const incomes = await Income.find({ userID:id }).sort({ date: -1 });
        if (!incomes || incomes.length === 0) {
            return res.status(404).json({ message: 'No incomes found' });
        }
         const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
        res.status(200).json({ totalIncome ,incomes });
        
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// Download an income

exports.downloadIncome = async(req, res) =>{
   try{
    const userId = req.user.id;
    const income = await Income.find({ userID: userId });
    if (!income || income.length === 0) {
        return res.status(404).json({ message: 'No incomes found' });
    }
    // Prepare data for download
    const incomeData = income.map((item) => ({
        icon: item.icon,
        source: item.source,
        amount: item.amount,
        date: item.date
    }));
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(incomeData);
    xlsx.utils.book_append_sheet(wb, ws, "Incomes");
    const buf = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
    res.setHeader('Content-Disposition', 'attachment; filename="incomes.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(200).send(buf);
   }
   catch(error){

   res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Delete an income
exports.deleteIncome = async(req, res) =>{

    try {
        // const userId = req.user.id;
        const incomeId = req.params.id;
        // console.log(incomeId)
        const income = await Income.findOne({ _id: incomeId });
        if (!income) {
            return res.status(404).json({ message: "Income not found or not authorized" });
        }
        await Income.deleteOne({ _id: incomeId });
        res.status(200).json({ message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


