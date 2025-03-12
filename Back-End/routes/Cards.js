const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const TokenValidity = require('../Middlewares/TokenValidity');
const { userSchema } = require('../DataBase/userCollection');
const Card = require('../DataBase/cardCollection.js');
const List = require('../DataBase/listCollection');
const logActivity = require('./LogActivity');
const ActivityLog = require('../DataBase/ActivityLog');
// const User = mongoose.model('User', userSchema);

const router = express.Router();

router.get('/:listID/cards', TokenValidity, async (req, res) => {
    const {listID} = req.params;

    try {
        const list = await List.findById(listID);

        if (!list) {
            return res.status(404).json({ message: "Cannot find list" });
        }
        
        const Cards = await Card.find({list: listID}).populate('members');
        
        res.status(200).json(Cards);
        } catch(e) {
            return res.status(500).json({message : "Cannot get Cards", details: e.message });
        }
});

router.post('/:listID/cards', TokenValidity, async (req, res) => {
    const {listID} = req.params;

    try {
        const list = await List.findById(listID);

        if (!list) {
            return res.status(404).json({ message: "Cannot find list" });
        }

        const {title, description,labels, dueDate, members, position} = req.body;
        const userID = req.user.userId;

        const NewCard = new Card({
            title,
            description,
            list: listID,
            labels,
            dueDate,
            members: members ? [...members, userID] : [userID],
            position
        });

        const SavedCard = await NewCard.save();
        list.cards.push(SavedCard._id);
        await list.save();

        await logActivity(
            list.board, 
            req.user.email || "inconnu", 
            "a créé une carte", 
            `Titre: ${title}`
        );

        res.status(200).json(SavedCard);
    } catch(e) {
        res.status(500).json({message : "Cannot create card", details : e.message});
    }
});

router.patch('/:listID/cards/:cardID', TokenValidity, async (req, res) => {
    const { listID, cardID } = req.params;

    try {
        const thelist = await List.findById(listID);
        if (!thelist)
            return res.status(404).json({ message: "Cannot find list" });

        const { title, description, list, labels, members, archive, position } = req.body;

        const UpdatedCard = await Card.findByIdAndUpdate(
            cardID,
            {title, description, list, labels, members, archive, position},
            { new: true }
        );

        if (!UpdatedCard)
            return res.status(404).json({ message: "Cannot find card" });

        if (list && list !== listID) {
            thelist.cards.pull(cardID);
            await thelist.save();

            const newList = await List.findById(list);
            if (!newList)
                return res.status(404).json({ message: "Cannot find new list" });

            newList.cards.push(cardID);
            await newList.save();
        }

        res.status(200).json(UpdatedCard);
    } catch (e) {
        return res.status(500).json({ message: "Cannot update card", details: e.message });
    }
});

router.patch('/:listID/cards/:cardID/assign', TokenValidity, async (req, res) => {
    const { listID, cardID } = req.params;
    const { userId } = req.body;
  
    try {
      const list = await List.findById(listID);
      if (!list) return res.status(404).json({ message: "Cannot find list" });
  
      const updatedCard = await Card.findByIdAndUpdate(
        cardID,
        { asigne: userId },
        { new: true }
      );
  
      if (!updatedCard) return res.status(404).json({ message: "Cannot find card" });

      await logActivity(
        list.board,
        req.user.email || "inconnu",
        "a assigné la carte",
        `Assignée à l'utilisateur ID: ${userId}`
      );  
  
      res.status(200).json(updatedCard);
    } catch (e) {
      return res.status(500).json({ message: "Cannot update card assignment", details: e.message });
    }
  });  

module.exports = router;
