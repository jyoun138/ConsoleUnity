const Game = require('../models/connection');
const Rsvp = require('../models/rsvp')
const {body} = require('express-validator');
const {validationResult} = require('express-validator');


// check if route parameter is a valid objectId value
exports.validateId = (req, res, next) => {
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(id.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    } else {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min:8, max:64}).trim()];

exports.validateLogIn = [body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min:8, max:64}).trim()];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}

exports.validateConnection = [body('title', 'Title cannot be empty').notEmpty().trim().escape(),
body('category', 'Category cannot be empty').notEmpty().trim().escape(),
body('details', 'Details must be at least 10 characters').isLength({min:10}).trim().escape(),
body('date', 'Date cannot be empty').notEmpty().trim().escape().isDate().withMessage("Date must be a valid date").isAfter().withMessage("Date must after today's date"),
body('startTime', 'Start time cannot be empty').notEmpty().trim().escape(),
body('startTime').matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time does not match 12 hour time format'),
body('endTime', 'End time cannot be empty').notEmpty().trim().escape(),
body('endTime').matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time does not match 12 hour time format'),
body('endTime').custom((endTime, {req}) => {
    let startTime = req.body.startTime,
    startTimeMinutes = parseInt(startTime.split(':')[0]) *60+ parseInt(startTime.split(':')[1]),
    endTimeMinutes = parseInt(endTime.split(':')[0]) *60+ parseInt(endTime.split(':')[1]);
    if(endTimeMinutes <= startTimeMinutes) {
        throw new Error('End time should not be before start time')
    } else {
        return true;
    }
}),
body('location', 'Location cannot be empty').notEmpty().trim().escape(),
body('imageURL', 'Image URL cannot be empty').notEmpty().trim().escape(),];

exports.convertLower = (req, res, next) => {
    let rsvp = req.body.status;
    let con = rsvp.toLowerCase();
    console.log(con);
};

exports.validateRsvp = [body('status', 'RSVP cannot be empty').notEmpty().toLowerCase().isIn(['yes', 'no', 'maybe','Yes','No','Maybe','YES','NO','MAYBE']).withMessage('Please enter only Yes, No, or Maybe')];