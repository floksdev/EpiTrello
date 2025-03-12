const ActivityLog = require('../DataBase/ActivityLog');

async function logActivity(boardId, userEmail, action, details = "") {
  try {
    const log = await ActivityLog.create({
      board: boardId,
      userEmail: userEmail,
      action: action,
      details: details
    });
    console.log("Log créé :", log);
  } catch (err) {
    console.error("Erreur lors de la création du log d'activité:", err.message);
  }
}

module.exports = logActivity;
