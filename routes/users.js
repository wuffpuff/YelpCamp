const express =  require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');//for generic mongoose error
const User = require('../models/user');
const usersController = require('../controllers/users')





//REGISTER route

//form page to register a user
router.get('/register', catchAsync (usersController.userRegisterForm));

//post data to database to register a user
router.post('/register', catchAsync (usersController.registerUser));

//form page to Login
router.get('/login', (usersController.loginForm));
// "local" = login to local page, you can use "facebook", "gmail", "twitter"

//login - username & password authenticate
router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login', keepSessionInfo:true}), (usersController.loginAuthenticate))

//user logout
router.get('/logout', (usersController.userLogout))


// req.user - you can see and get a user information stored in the session
// console.log(req.user)
//It is needed for the navbar to change status between Sign Up, Login, or Logout.
//if a user is logged in you will have information about that user in the session 
//and you get that information stored in the session by req.user
// if the user is not logged in, show "Login" or "Sign Up" in the navbar, else show "Logout"

// look login.ejs


module.exports = router;