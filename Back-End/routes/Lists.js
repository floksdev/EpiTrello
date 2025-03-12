const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const TokenValidity = require('../Middlewares/TokenValidity');
const { userSchema } = require('../DataBase/userCollection');
const List = require('../DataBase/listCollection');
const Board = require('../DataBase/boardCollection');
const logActivity = require('./LogActivity');
const ActivityLog = require('../DataBase/ActivityLog');

const User = mongoose.model('User', userSchema);

const router = express.Router();

router.get('/:boardID/lists', TokenValidity, async (req, res) => {
    const { boardID } = req.params;

    try {
        const board = await Board.findById(boardID);

        if (!board)
            return res.status(404).json({message : "Cannot find board"});
        
        const Lists = await List.find({board: boardID}).populate('cards');
        
        res.status(200).json(Lists);
        } catch(e) {
            return res.status(500).json({message : "Cannot get list", details: e.message });
        }
});

router.post('/:boardID/lists', TokenValidity, async (req, res) => {
    const { boardID } = req.params;

    try {
        const board = await Board.findById(boardID);

        if(!board)
            return res.status(404).json({message : "Cannot find board"});

        const {name, position} = req.body;
        const NewList = new List({
            name,
            position,
            board: boardID
        });

        const SaveList = await NewList.save();
        board.lists.push(SaveList._id);
        await board.save();

        await logActivity(
            boardID,
            req.user.email || "inconnu",
            "a créé une liste",
            `Nom: ${name}`
        );
        
        res.status(200).json({SaveList});
    } catch(e) {
        return res.status(500).json({message : "Cannot create list", details: e.message });
    }
});

router.patch('/:boardID/lists/:listID', TokenValidity, async (req, res) => {
    const { boardID, listID } = req.params;

    try {
        const board = await Board.findById(boardID);

        if(!board)
            return res.status(404).json({message : "Cannot find board"});

        const { name, position, archive } = req.body;
        const UpdatedList = await List.findByIdAndUpdate(
            listID,
            { name, position, archive },
            { new: true }
        )

        if (!UpdatedList) {
            return res.status(404).json({ message: "Cannot find card" });
        }
        
        await logActivity(
            boardID,
            req.user.email || "inconnu",
            "a modifié une liste",
            `Changements: ${JSON.stringify({ name, position, archive })}`
        );

        res.status(200).json(UpdatedList);
    } catch(e) {
        return res.status(500).json({message : "Cannot update list", details: e.message });
    }
});


module.exports = router;
