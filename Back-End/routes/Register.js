const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { userSchema } = require('../DataBase/userCollection');

const User = mongoose.model('User', userSchema);

const router = express.Router();

// Post method for register getting datas and filling the DB \\

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser){
            return res.status(400).json({message: "Cet email est déjà utilisé."});
        }

        console.log('Hachage du mot de passe...');
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({message: 'Utilisateur créé avec succès'});
        console.log('Utilisateur créé avec succès');
    } catch(error) {
        console.log('Erreur lors de la création de l\'utilisateur:', error);
        res.status(500).json({message: 'Erreur interne du serveur.'});
    }
});

module.exports = router;
