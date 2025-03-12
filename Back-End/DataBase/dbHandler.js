const dbConnection = require('./dbConnection');
require('./userCollection');
require('./boardCollection');
require('./listCollection');
require('./cardCollection.js');

async function dbHandler() {
    await dbConnection();
}

module.exports = dbHandler;
