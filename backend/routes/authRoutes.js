const express = require('express');
const { protext } = require("../middleware/authMiddleware");

const{
    registerUser,
    loginUser,
    getUserInfo,
    googleLogin,

} = require('../controllers/authController.js');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/getUser', protect, getUserInfo);


module.exports = router;
// This code defines the routes for user authentication in an Express application. 
// It imports the necessary modules, defines the routes for user registration, 
// login, and fetching user information, and exports the router for use in other 
// parts of the application.

