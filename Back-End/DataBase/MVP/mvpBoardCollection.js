const mongoose = require('mongoose');

const boardSchema1 = new mongoose.Schema({
    name: String,
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card1' }],
});

const Board = mongoose.model('Board1', boardSchema1);
module.exports = Board;
