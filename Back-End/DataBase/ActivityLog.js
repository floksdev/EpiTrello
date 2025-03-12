const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  board: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Board', 
    required: true 
  },
  userEmail: { 
    type: String, 
    required: true 
  },
  action: { 
    type: String, 
    required: true 
  },
  details: { 
    type: String 
  }
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
module.exports = ActivityLog;