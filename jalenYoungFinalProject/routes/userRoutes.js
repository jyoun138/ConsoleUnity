const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const { logInLimiter } = require('../middlewares/rateLimiter');
const {validateSignUp, validateLogIn, validateResult} = require('../middlewares/validator');


const router = express.Router();

//GET /users/new: send html form for registering new user

router.get('/new', isGuest, controller.new);

//POST /users: create a new user

router.post('/', isGuest, validateSignUp,  controller.create);

//GET /users/login: send html form for user login
router.get('/login', isGuest, controller.login);

//POST /users/: process login request
router.post('/login', logInLimiter, isGuest, validateLogIn, controller.process);

//GET /users/profile send details of user profile
router.get('/profile', isLoggedIn, controller.profile);

//GET /users/logout logout the user
router.get('/logout', isLoggedIn, controller.logout);


module.exports = router;