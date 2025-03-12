const express = require('express');
const Board1 = require('../DataBase/MVP/mvpBoardCollection');
const Card1 = require('../DataBase/MVP/mvpCardCollection');

const router = express.Router();

router.post('/', async (req, res) => {
    const { boardName, title, description } = req.body;

    try {
        const board = await Board1.findOne({ name: boardName });
        if (!board) {
            return res.status(404).json({ message: `Le board "${boardName}" n'existe pas.` });
        }

        const newCard = new Card1({
            title,
            description,
        });

        await newCard.save();

        board.cards.push(newCard._id);
        await board.save();

        res.status(201).json({ message: `Task ajoutée au board "${boardName}"`, card: newCard });
    } catch (error) {
        console.log('Erreur lors de la création de la task:', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const boards = await Board1.find().populate('cards');
        res.status(200).json(boards);
    } catch (error) {
        console.log('Erreur lors de la récupération des boards:', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

module.exports = router;
