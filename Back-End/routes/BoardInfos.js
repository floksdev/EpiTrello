const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const TokenValidity = require('../Middlewares/TokenValidity');
const Board = require('../DataBase/boardCollection');
const User = require('../DataBase/userCollection');
const router = express.Router();

router.get('/:boardID', TokenValidity, async (req, res) => {
    const { boardID } = req.params;

    try {
        const board = await Board.findById(boardID);

        if (!board)
            return res.status(404).json({message : "Cannot find board"});
        
        const BoardName = board.name
        const BoadMembers = board.members;
        res.status(200).json({ name: BoardName, members: BoadMembers});
        } catch(e) {
            return res.status(500).json({message : "Cannot get boardName", details: e.message });
        }
});

router.post('/getMembers', async (req, res) => {
    try {
        const { members } = req.body;

        if (!members || !Array.isArray(members)) {
            return res.status(400).json({ message: "Mauvaise requête : Liste de membres invalide" });
        }

        const users = await User.find({ _id: { $in: members } }).select('name email');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des membres", details: error.message });
    }
});

module.exports = router;