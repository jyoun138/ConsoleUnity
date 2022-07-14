const express = require('express');
const controller = require('../controllers/connectionController')
const {isLoggedIn, isHost, isNotHostOfRSVP} = require('../middlewares/auth');
const {validateId, validateConnection, validateResult, validateRsvp, convertLower} = require('../middlewares/validator');

const router = express.Router();

//GET /connections: send all connections to the user

router.get('/', controller.index);

//GET /connections/new: send html form for creating a new connection

router.get('/new', isLoggedIn, controller.new);

//POST /connections: create a new connections

router.post('/', isLoggedIn, validateConnection, validateResult, controller.create);

//GET /connections/:id: send details of connection identified by id

router.get('/:id', validateId, controller.show);

//GET /connections/:id/edit: send html form for editing an existing connection

router.get('/:id/edit', isLoggedIn, validateId, isHost, controller.edit);

//PUT /connections/:id: update the connection identified by id

router.put('/:id', isLoggedIn, validateId, isHost, validateConnection, validateResult, controller.update);

// DELETE /connections/:id: delete the connection identified by id
router.delete('/:id', isLoggedIn, validateId, isHost, controller.delete);

//POST /connections: create rsvp status
router.post('/:id/rsvp', controller.rsvp);


module.exports = router;