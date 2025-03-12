const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required field!"]
    },
    position: Number,
    board: {type: mongoose.Schema.Types.ObjectId, ref: 'Board'},
    cards: [{type: mongoose.Schema.Types.ObjectId, ref: 'Card'}],
    archive: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const List = mongoose.model('List', listSchema);
module.exports = List;
