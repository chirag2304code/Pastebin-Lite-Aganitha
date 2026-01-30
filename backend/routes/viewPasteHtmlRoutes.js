const express = require('express');
const router = express.Router();
const viewPasteHtmlController = require('../controllers/viewPasteHtmlController');

router.get('/:id', viewPasteHtmlController.viewPasteHtml);

module.exports = router;
