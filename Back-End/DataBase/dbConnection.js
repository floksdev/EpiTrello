const mongoose = require("mongoose");

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

// Server Connection To MongoDB Using Mongoose \\

const dbConnection = async () => {
    mongoose.connect(process.env.CONN_STR, {
    }).then((conn) => {
        console.log("Server connected to DB ✅");
    }).catch((err) => {
        console.error("DB Connection Error: ", err);
        process.exit(1);
    });
};

module.exports = dbConnection;
