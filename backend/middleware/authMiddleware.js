const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); //load User model  

exports.protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1]; // Get token from headers

    if(!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // Get user from token
        next(); // Call the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
