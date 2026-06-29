const Slide = require('../models/Slide');
const Presentation = require('../models/Presentation');

// Add slide to presentation
const addSlide = async (req, res) => {
  try {
    const { type, question, options, settings } = req.body;

    const slide = await Slide.create({
      type,
      question,
      options,
      settings
    });

    // Add slide to presentation
    await Presentation.findByIdAndUpdate(
      req.params.presentationId,
      { $push: { slides: slide._id } }
    );

    res.status(201).json(slide);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all slides of a presentation
const getSlides = async (req, res) => {
  try {
    const presentation = await Presentation.findById(req.params.presentationId)
      .populate('slides');

    res.json(presentation.slides);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete slide
const deleteSlide = async (req, res) => {
  try {
    await Slide.findByIdAndDelete(req.params.slideId);

    await Presentation.findByIdAndUpdate(
      req.params.presentationId,
      { $pull: { slides: req.params.slideId } }
    );

    res.json({ message: 'Slide deleted!' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const updateSlide = async (req, res) => {
  try {
    const { type, question, options, settings } = req.body;
    const slide = await Slide.findByIdAndUpdate(
      req.params.slideId,
      { type, question, options, settings },
      { new: true }
    );
    res.json(slide);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addSlide, getSlides, deleteSlide, updateSlide };