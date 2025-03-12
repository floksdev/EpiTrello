const registerRoute = require('./Register');
const loginRoute = require('./Login');
const boardRoutes = require('./Boards');
const listRoutes = require('./Lists');
const CardRoutes = require('./Cards');
const BoardInfos = require('./BoardInfos');
const GoogleLoginRoute = require('./GoogleLogin');
const discordLoginRoute = require('./DiscordLogin');

const routesHandling = (app) => {
    app.use('/register', registerRoute);
    app.use('/login', loginRoute);
    app.use('/auth/google', GoogleLoginRoute);
    app.use('/auth/discord', discordLoginRoute);
    app.use('/users', boardRoutes);
    app.use('/board', listRoutes);
    app.use('/lists', CardRoutes);
    app.use('/board-infos', BoardInfos)
};

module.exports = routesHandling;
