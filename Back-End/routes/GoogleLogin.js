const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const { userSchema } = require('../DataBase/userCollection');

const User = mongoose.model('User', userSchema);
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/', async (req, res) => {
    const { token: googleToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                password: await bcrypt.hash(sub, 10),
                name,
                profilePicture: picture,
            });

            await user.save();
        }

        const jwtToken = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '15d' }
        );

        res.status(200).json({ message: 'Connexion réussie via Google', token: jwtToken });
    } catch (error) {
        console.log('Erreur lors de la connexion Google:', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

module.exports = router;
