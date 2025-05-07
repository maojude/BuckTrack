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
    const { email, password } = req.body; //pulls the data from the JSON sent by frontend

    //Validation: Check for missing fields
    if(!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try{
        //Check if user exists
        const user = await User.findOne({ email });

        if(!user || !(await user.comparePassword(password))) {
            //Check if user exists and password matches
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user || user.provider === "google" || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials or wrong login method' });
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error logging in user", error: error.message });
    }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user); // responds by sending status 200 which means OK then sends the user data

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching user info", error: error.message });
    }
};


exports.googleLogin = async (req,res) => {
    const { idToken } = req.body;

    try{
        const decodedToken = await auth().verifyIdToken(idToken);
        const { uid, name, email } = decodedToken;

        // look for existing user
        let user = await User.findOne({ email });

        if(user && user.provider === "local"){
            return res.status(400).json({ message: "This email is already registered with password login" });
        }

        // if new user
        if(!user) {
            user = await User.create({
                fullName: name,
                email,
                provider: "google",
            });
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid Firebase token", error: error.message });
    }
};