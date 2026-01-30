const express = require('express');
const router = express.Router();
const pasteController = require('../controllers/pasteController');

router.post('/', pasteController.createPaste);
router.get('/:id', pasteController.getPaste);

module.exports = router;
