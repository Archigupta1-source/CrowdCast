const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const {
  createSession,
  joinSession,
  changeSlide,
  endSession
} = require('../controllers/sessionController');

// Presenter routes (auth required)
router.post('/', auth, createSession);
router.patch('/:sessionId/slide', auth, changeSlide);
router.patch('/:sessionId/end', auth, endSession);

// Audience route (no auth)
router.get('/join/:code', joinSession);

module.exports = router;