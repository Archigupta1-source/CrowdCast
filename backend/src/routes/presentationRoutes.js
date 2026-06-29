const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createPresentation,
  getMyPresentations,
  getPresentation,
  deletePresentation
} = require('../controllers/presentationController');

router.post('/', auth, createPresentation);
router.get('/', auth, getMyPresentations);
router.get('/:id', auth, getPresentation);
router.delete('/:id', auth, deletePresentation);

module.exports = router;