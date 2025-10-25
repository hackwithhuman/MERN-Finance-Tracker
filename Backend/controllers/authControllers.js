const jwt = require('jsonwebtoken');
const User = require('../models/UersSchema');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '1d',});
}

// Register a new user
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profilePicURL } = req.body;
    // validation
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'Account already exists try to login' });
    }

    // Create new user
    const user = await User.create({ fullName, email, password, profilePicURL });
    if (user) {
        res.status(201).json({
            _id: user._id,
            user,
            token: generateToken(user._id),
            message: 'Registration successful'
        });
    } else {
        res.status(400).json({ message: 'Something went wrong' , error: error.message});
    }
 };

//  Login user
exports.loginUser = async (req, res) => {
    const {email , password} = req.body;
    if(!email|| !password){
        return res.status(400).json({message: 'Please fill in all fields'});
    }
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.status(200).json({
            _id: user._id,
            user,
            token: generateToken(user._id),
            message: 'Login successful'
        });
    }else{
        res.status(400).json({message: 'Invalid email or password'});   
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