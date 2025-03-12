const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const TokenValidity = require('../Middlewares/TokenValidity');
const Board = require('../DataBase/boardCollection');
const User = require('../DataBase/userCollection');
const logActivity = require('./LogActivity');
const ActivityLog = require('../DataBase/ActivityLog');

const router = express.Router();

router.get('/:userID', TokenValidity, async (req, res) => {
    try {
        const userId = req.params.userID;
        const user = await User.findById(userId).populate('boards');
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        const { __v, ...userData } = user.toObject();
        res.json(userData);
    } catch (error) {
        console.error("Erreur lors de la récupération des infos utilisateur:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

router.patch('/:userID', TokenValidity, async (req, res) => {
    const { userID } = req.params;
  
    if (userID !== req.user.userId.toString()) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce compte." });
    }
  
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ message: "Le nouveau mot de passe est requis." });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const updatedUser = await User.findByIdAndUpdate(
        userID,
        { password: hashedPassword },
        { new: true }
      );
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
      
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      res.status(500).json({ message: "Erreur interne du serveur.", details: error.message });
    }
});

router.patch('/:userID/password', TokenValidity, async (req, res) => {
    const { userID } = req.params;
  
    if (userID !== req.user.userId.toString()) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce compte." });
    }
  
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Veuillez fournir le mot de passe actuel et le nouveau mot de passe." });
    }
  
    try {
      const user = await User.findById(userID);
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Le mot de passe actuel est incorrect." });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      res.status(500).json({ message: "Erreur interne du serveur.", details: error.message });
    }
});
  
router.get('/:userID/Boards', TokenValidity, async (req, res) => {
    const { userID } = req.params;

    if (userID !== req.user.userId.toString())
        return res.status(500).json({message : "You are not allowed to access to this dashboard !"});

    try {
        const Boards = await Board.find({ members: userID })
                                  .populate('lists')
                                  .populate('members');

        if (!Boards)
            return res.status(404).json({message : "No boards found for this user."});

        res.status(200).json(Boards);
    } catch (e) {
        res.status(500).json({ error: "Can't get board", details: e.message });
    }
});

router.post('/:userID/Boards', TokenValidity, async (req, res) => {
    const { userID } = req.params;
    const { name, description, members } = req.body;
    const user = await User.findById(userID);

    if (userID !== req.user.userId.toString())
        return res.status(500).json({ message : "You are not allowed to access to this dashboard !" });

    try {
        const NewBoard = new Board({
            name,
            description,
            members: userID
        });
        const SavedBoard = await NewBoard.save();
        user.boards.push(SavedBoard._id);
        await user.save();
        await logActivity(SavedBoard._id, user.email, "a créé le tableau", `Nom: ${name}`);
        res.status(201).json(SavedBoard);
    } catch (e) {
        res.status(500).json({ error: "failed to create board", details: e.message });
    }
});

router.post('/:userID/Boards/:boardID/addMember', TokenValidity, async (req, res) => {
    const { userID, boardID } = req.params;
    const { newMemberEmail } = req.body;

    if (userID !== req.user.userId.toString()) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce tableau !" });
    }

    try {
        const board = await Board.findById(boardID);
        if (!board) return res.status(404).json({ message: "Tableau introuvable !" });

        const newMember = await User.findOne({ email: newMemberEmail });
        if (!newMember) return res.status(404).json({ message: "Utilisateur non trouvé !" });

        if (board.members.includes(newMember._id)) {
            return res.status(400).json({ message: "L'utilisateur est déjà membre du tableau !" });
        }

        board.members.push(newMember._id);
        await board.save();

        await logActivity(boardID, req.user.email || "inconnu", "a ajouté un membre", `[ ${newMemberEmail}] `);

        res.status(200).json({ message: "Utilisateur ajouté avec succès !", board });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du membre", details: error.message });
    }
});

router.patch('/:userID/Boards/:boardID', TokenValidity, async (req, res) => {
    const { userID, boardID } = req.params;
    if (userID !== req.user.userId.toString())
        return res.status(500).json({ message: "You are not allowed to access to this dashboard !" });

    try {
        const { name, members, archive, favorite } = req.body;
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (members !== undefined) updates.members = members;
        if (archive !== undefined) updates.archive = archive;
        if (favorite !== undefined) updates.favorite = favorite;

        const updatedBoard = await Board.findByIdAndUpdate(boardID, updates, { new: true });
        if (!updatedBoard)
            return res.status(404).json({ message: "Board not found !" });

        await logActivity(boardID, req.user.email || "inconnu", "a modifié le tableau", `Mises à jour: ${JSON.stringify(updates)}`);

        res.status(200).json(updatedBoard);
    } catch (e) {
        res.status(500).json({ message: "Cannot update this board", details: e.message });
    }
});

router.get('/:userID/Boards/:boardID/activity', TokenValidity, async (req, res) => {
    const { userID, boardID } = req.params;
    try {
      const board = await Board.findById(boardID);
      if (!board) return res.status(404).json({ message: "Tableau introuvable" });
  
      if (!board.members.map(id => id.toString()).includes(userID))
        return res.status(403).json({ message: "Accès interdit à l'activité de ce tableau" });
  
      const logs = await ActivityLog.find({ board: boardID }).sort({ createdAt: -1 });
      res.status(200).json(logs);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des logs d'activité", error: err.message });
    }
  });  

module.exports = router;
