const mongoose = require('mongoose');

const cardSchema1 = new mongoose.Schema({
    title: String,
    description: String,
});

const Card = mongoose.model('Card1', cardSchema1);
module.exports = Card;
