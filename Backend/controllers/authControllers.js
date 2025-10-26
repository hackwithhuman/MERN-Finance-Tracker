const jwt = require('jsonwebtoken');
const User = require('../models/UersSchema');

const cloudinary = require('../config/Cloudnary');
const fs = require('fs');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d', });
}

// Register a new user


exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ message: 'Fill all fields' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Account exists' });

    let profilePicURL = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ExpenseTrackerUser',
      });

      fs.unlinkSync(req.file.path); // remove local file
      profilePicURL = result.secure_url;
    }

    const user = await User.create({ fullName, email, password, profilePicURL });

    res.status(201).json({
      message: 'Registration successful',
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
//  Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }
  const user = await User.findOne({ email });
  if(!user){
    return res.status(400).json({message: "Account Not exist"});
  }
  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      user,
      token: generateToken(user._id),
      message: 'Login successful'
    });
  } else {
    res.status(400).json({ message: 'Invalid email or password' });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};