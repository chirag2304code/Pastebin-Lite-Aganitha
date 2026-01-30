const mongoose = require('mongoose');

exports.healthCheck = async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    if (isConnected) {
      res.status(200).json({ ok: true });
    } else {
      res.status(500).json({ ok: false, message: 'MongoDB not connected' });
    }
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};
