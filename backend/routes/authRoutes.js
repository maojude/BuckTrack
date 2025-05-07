const express = require('express');
const { protect } = require("../middleware/authMiddleware");

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

// router to google auth
router.post('/google-login', googleLogin);


module.exports = router;
// This code defines the routes for user authentication in an Express application. 
// It imports the necessary modules, defines the routes for user registration, 
// login, and fetching user information, and exports the router for use in other 
// parts of the application.

