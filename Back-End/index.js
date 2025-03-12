const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const dbHandler = require('./DataBase/dbHandler');
const routesHandling = require('./routes/Handler');

const app = express();

dbHandler();

// Middlewares \\

app.use(cors());
app.use(express.json());

// All Routes \\

routesHandling(app);

// Setting Up And Starting Server Properly \\

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log("Server started !✅");
})

