const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
    id: Number,
    lastname: String,
    firstname: String,
    email: {
        type: String, 
        required: [true, "Email is required field!"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required field!"],
    },
    permissions: {
        type: Number,
        default: 0 // 0 is a normal user, not admin
    },
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
});

// Plugin to auto-increment "id" field
userSchema.plugin(AutoIncrement, { inc_field: 'id' });

const User = mongoose.model('User', userSchema);

module.exports = User;
