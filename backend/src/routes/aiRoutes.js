const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generatePresentation } = require('../controllers/aiControllers');

router.post('/generate-presentation', auth, generatePresentation);

module.exports = router;