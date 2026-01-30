const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  expires_at: {
    type: Date,
    default: null,
  },
  remaining_views: {
    type: Number,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

pasteSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Paste', pasteSchema);
