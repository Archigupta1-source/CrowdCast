const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { addSlide, getSlides, deleteSlide, updateSlide } = require('../controllers/slideController');

router.post('/', auth, addSlide);
router.get('/', auth, getSlides);
router.delete('/:slideId', auth, deleteSlide);
router.patch('/:slideId', auth, updateSlide);

module.exports = router;