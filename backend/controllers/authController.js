const User = require('../models/User'); //load User model to interact with database
const jwt = require("jsonwebtoken");
const { auth } = require('firebase-admin'); 


//Generate JWT tokens
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '10h'});
};


//Register a new user
exports.registerUser = async (req, res) => {

    const { fullName, email, password, provider = "local" } = req.body; //pulls the data from the JSON sent by frontend
    
    //Validation: Check for missing fields
    if(!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try{
        //Check if email already exists
        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        //Create the user
        const user = await User.create({
            fullName,
            email,
            password: provider === "local" ? password : undefined, // if local then set password, if not set to undefined as auth is handled by google
            provider,
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error registering user", error: error.message });
    }
};

//Login User
exports.loginUser = async (req, res) => {
};

// Get User Info
exports.getUserInfo = async (req, res) => {
};
