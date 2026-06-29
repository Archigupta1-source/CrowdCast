const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { submitResponse, getResponses } = require('../controllers/responseController');

// Audience — no auth
router.post('/', submitResponse);

// Presenter — auth required
router.get('/', auth, getResponses);

module.exports = router;