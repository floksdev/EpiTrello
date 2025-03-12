const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required field!"]
    },
    description: String,
    list: {type: mongoose.Schema.Types.ObjectId, ref: 'List'},
    labels: [String],
    dueDate: Date,
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    asigne: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    archive: {
        type: Boolean,
        default: false
    },
    position: {
        type: Number,
        default: 1
    }
}, {timestamps: true});

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;
