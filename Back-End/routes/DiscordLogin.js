const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { userSchema } = require('../DataBase/userCollection');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = mongoose.model('User', userSchema);
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/', async (req, res) => {
    const { code } = req.body;

    try {
        const discordResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.DISCORD_REDIRECT_URI,
            scope: 'identify email',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = discordResponse.data;

        const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const { email, username, avatar, id } = userResponse.data;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                password: await bcrypt.hash(id, 10),
                name: username,
                profilePicture: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
            });

            await user.save();
        }

        const jwtToken = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '15d' }
        );

        res.status(200).json({ message: 'Connexion réussie via Discord', token: jwtToken });
    } catch (error) {
        console.error('Erreur lors de la connexion Discord:', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

module.exports = router;
