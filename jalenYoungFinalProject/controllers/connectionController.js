const Game = require('../models/connection');
const Rsvp = require('../models/rsvp');
let validator = require('validator')

//GET /connections: send all connections to the user
exports.index = (req, res, next)=> {
    //res.send(model.find());
    Game.find()
    .then(games=>{
        let categories = sortCategories(games);
        res.render('./connection/connection', {games, categories});
    })
    .catch(err=>next(err));
};

//GET /connections/new: send html form for creating a new connection

exports.new = (req, res)=> {
    res.render('./connection/new');
};

//POST /connections: create a new connection

exports.create = (req, res, next)=>{
    //res.send('Created a new connection');
    let game = new Game(req.body); // create a new game document
    game.hostName = req.session.user;
    game.save() // insert document to database
    .then(game=>{ 
        if(game) {
            // game.imageURL = validator.unescape(game.imageURL);
            req.flash('success', 'Successfully created a connection');
            res.redirect('/connections')
        } 
    })
    .catch(err=>next(err));
    
};

//GET /connections/:id: send details of connection identified by id

exports.show = (req, res, next)=>{
    let id = req.params.id;
    Promise.all([Rsvp.count({connection: id, status: 'Yes'}),Game.findById(id).populate('hostName', 'firstName lastName')])
    .then(results=>{
        const [rsvp, game] = results;

        if(game) {
            // console.log(game);
            game.imageURL = validator.unescape(game.imageURL);
            res.render('./connection/details', {game, rsvp});
        } else {
            let err = new Error('Cannot find connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
    
};

//GET /connections/:id/edit: send html form for editing an existing connection

exports.edit = (req, res, next)=> {
    let id = req.params.id;
    Game.findById(id)
    .then(game=>{
            game.imageURL = validator.unescape(game.imageURL);
            res.render('./connection/edit', {game});
    })
    .catch(err=>next(err));
};

//PUT /connections/:id: update the connection identified by id

exports.update = (req, res, next)=> {
    let game = req.body;
    let id = req.params.id;
    Game.findByIdAndUpdate(id, game, {useFindAndModify: false, runValidators: true})
    .then(game=>{
        if(game) {
            // game.imageURL = validator.unescape(game.imageURL);
            req.flash('success', 'Successfully updated a connection');
            res.redirect('/connections/' + id);
        } 
    })
    .catch(err=>next(err));
};

// DELETE /stories/:id: delete the story identified by id
exports.delete = (req, res, next)=> {
    let id = req.params.id;
    let rsvp = req.params.rsvp;
    Promise.all([Rsvp.deleteOne({connection: id}, {useFindAndModify: false}), Game.findByIdAndDelete(id, {useFindAndModify: false})])
    .then(game => {
        if(game) {
            req.flash('success', 'Successfully deleted a connection');
            res.redirect('/connections');
        } 
    })
    .catch(err=>next(err));
};

exports.rsvp = (req, res, next)=> {
    let connection = req.params.id;
    let status = req.body.rsvp;
    let user = req.session.user;
    let rsvp = {
        connection: connection, status: status, user: user
    };
    Rsvp.findOneAndUpdate({user: user, connection:connection}, rsvp, {useFindAndModify: false, upsert: true, new: true, runValidators: true})
    .then(rsvp =>{
        if(status == 'Yes') {
            req.flash('success', 'RSVP Status: Yes');
        }
        if(status == 'No') {
            req.flash('success', 'RSVP Status: No');
        }
        res.redirect('/users/profile');
    })
    .catch(err=>next(err));
};

function sortCategories(games) {
    let categories = [];
    games.forEach(game=>{
        if(!categories.includes(game.category))
        categories.push(game.category);
    });
    return categories;
}

