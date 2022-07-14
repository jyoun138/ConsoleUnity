const User = require('../models/user');
const Game = require('../models/connection');
const Rsvp = require('../models/rsvp')

// get the sign up form
exports.new = (req, res)=>{
    return res.render('./user/new');
};

// create a new user
exports.create = (req, res, next)=> {
    let user = new User(req.body);
    if(user.email) {
        user.email = user.email.toLowerCase();
    }
    user.save()
    .then(result=>{
        if(result) {
            req.flash('success', 'Successfully registered an account');
            res.redirect('/users/login')
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/users/new')
        }

        if(err.code === 11000) {
            req.flash('error', 'Email address has been used');
            return res.redirect('/users/new');
        }

        next(err);

    });
};

// get the login form 
exports.login = (req, res)=>{
    res.render('./user/login');
};

// process login request 
exports.process = (req, res)=>{
    // authenticate user's login request
    let email = req.body.email;
    if(email) {
        email = email.toLowerCase();
    }
    let password = req.body.password;
    console.log(req.flash());
    
    // get the user that matches the email
    User.findOne({email: email})
    .then(user=>{
        if(user) {
            // user found in the database
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id; // store user's id in the session
                    req.session.userName = user.firstName; 
                    // req.session.user = {_id:user._id, firstName: user.firstName, lastName: user.lastName}; 
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
                } else {
                    //console.log('Wrong password');
                    req.flash('error', 'Wrong password');
                    res.redirect('/users/login');
                }
            })
        } else {
            // console.log('Wrong email address');
            req.flash('error', 'Wrong email address!');
            res.redirect('/users/login');
        }
    })
    .catch(err=>next(err));
};

// get profile 

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([Rsvp.find({user: id}).populate('connection','title category'), User.findById(id).populate(), Game.find({hostName: id}).populate()])
    .then(results=>{
        const [rsvps, user, games] = results;
        // console.log(results)
        res.render('./user/profile', {rsvps, user, games});
    })
    .catch(err=>next(err));
};

// logout the user 

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) {
            return next(err);
        } else {
            res.redirect('/')
        }
    })
};