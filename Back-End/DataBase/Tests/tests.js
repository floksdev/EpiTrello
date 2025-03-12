
const mongoose = require("mongoose");
const { userSchema } = require('../userTable');

const User = mongoose.model('User', userSchema);

// Creating Test User | Will be deleted soon... \\

const userTableTest = async () => {
    const testUser = new User({
        lastname: "Tek",
        firstname: "Trello",
        email: "test@epitrello.comm",
        password: "12345"
    })
    
    testUser.save().then(doc => {
        console.log(doc);
    }).catch(err => {
        console.log("Oh oh the user is not save in the DataBase", err);
    });
};

module.exports = userTableTest;
