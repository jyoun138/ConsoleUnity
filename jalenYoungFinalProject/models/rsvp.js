const { DateTime } = require('luxon');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    connection: {type: Schema.Types.ObjectId, ref: 'Game'},
    status: {type: String, enum: ['Yes','No','Maybe']}
},
{timestamps: true}
);
// collection name is games in the database
module.exports = mongoose.model('Rsvp', rsvpSchema);