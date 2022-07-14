const Game = require('../models/connection');
const Rsvp = require('../models/rsvp')


// check if user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

// check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to login first');
        return res.redirect('/users/login');
    }
};

// check if user is host of connection
exports.isHost = (req, res, next) => {
    let id = req.params.id;
    Game.findById(id)
    .then(game=>{
        if(game) {
            if(game.hostName == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            console.log(err);
            return next(err);
        }
    })
    .catch(err=>next(err));
};

exports.isNotHostOfRSVP = (req, res, next) => {
    let id = req.params.id;
    Promise.all([Rsvp.find({connection:id}), Game.findById(id)])
    .then(rsvp=>{
        if(rsvp) {
            if(rsvp.hostName != req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            console.log(err);
            return next(err);
        }
    })
    .catch(err=>next(err));
};