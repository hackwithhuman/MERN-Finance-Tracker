const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      
    });
    console.log('database chal rha hai');
  } catch (error) {
    console.error('dataBase crash ho gya', error.message);

  }
};

module.exports = connectDB;
