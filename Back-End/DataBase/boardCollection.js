const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required field!"]
    },
    description: String,
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    lists: [{type: mongoose.Schema.Types.ObjectId, ref: 'List'}],
    archive: {
        type: Boolean,
        default: false
    },
    favorite: { 
        type: Boolean,
        default: false 
    }
}, {timestamps: true});

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;
