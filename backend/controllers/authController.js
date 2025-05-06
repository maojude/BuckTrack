
const jwt = require("jsonwebtoken");

//Generate JWT tokens
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '10h'});
};


//Register a new user
exports.registerUser = async (req, res) => {

};

//Login User
exports.loginUser = async (req, res) => {
};

// Get User Info
exports.getUserInfo = async (req, res) => {
};
