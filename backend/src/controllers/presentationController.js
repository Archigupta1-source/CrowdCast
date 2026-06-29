const Presentation = require('../models/Presentation');

// Create presentation
const createPresentation = async (req, res) => {
  try {
    const { title } = req.body;

    const presentation = await Presentation.create({
      title,
      ownerId: req.userId
    });

    res.status(201).json(presentation);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all presentations of a user
const getMyPresentations = async (req, res) => {
  try {
    const presentations = await Presentation.find({ ownerId: req.userId });
    res.json(presentations);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single presentation
const getPresentation = async (req, res) => {
  try {
    const presentation = await Presentation.findById(req.params.id)
      .populate('slides');

    if (!presentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }

    res.json(presentation);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete presentation
const deletePresentation = async (req, res) => {
  try {
    await Presentation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Presentation deleted!' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createPresentation,
  getMyPresentations,
  getPresentation,
  deletePresentation
};