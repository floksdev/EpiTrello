const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { userSchema } = require('../DataBase/userCollection');

const User = mongoose.model('User', userSchema);
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Post request to valid connection of users
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect." });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '15d' } // Token expire in 15 day
        );

        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
        console.log('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

module.exports = router;
