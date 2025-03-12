const jwt = require('jsonwebtoken');

// Middleware to check token validity
const TokenValidity = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Accès interdit, token manquant' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: `Token invalide ou expiré: ${error.message}` });
    }
};

module.exports = TokenValidity;
