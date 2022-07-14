const { DateTime } = require('luxon');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    category: {type: String, required: [true, 'category is required']},
    details: {type: String, required: [true, 'details is required'], minLength: [10, 'the content should have at least 10 characters']},
    date: {type: String, required: [true, 'date is required']},
    startTime: {type: String, required: [true, 'start time is required']},
    endTime: {type: String, required: [true, 'end time is required']},
    location: {type: String, required: [true, 'location is required']},
    hostName: {type: Schema.Types.ObjectId, ref: 'User'},
    imageURL: {type: String, required: [true, 'image URL is required']},
},
{timestamps: true}
);
// collection name is games in the database
module.exports = mongoose.model('Game', gameSchema);