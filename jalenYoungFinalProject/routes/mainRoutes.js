const express = require('express');
const controller = require('../controllers/mainController')

const router = express.Router();

//GET /about: send html for about page

router.get('/about', controller.about);

//GET /about: send html for contacts page

router.get('/contact', controller.contact);

//GET /about: send html for home page

router.get('/', controller.home);

module.exports = router;