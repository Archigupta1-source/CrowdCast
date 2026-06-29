const Session = require('../models/Session');

// Generate random 6-digit code
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create session (start live presentation)
const createSession = async (req, res) => {
  try {
    const code = generateCode();

    const session = await Session.create({
      presentationId: req.params.presentationId,
      code,
      activeSlideIndex: 0,
      isLive: true
    });

    res.status(201).json(session);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Join session by code (audience)
const joinSession = async (req, res) => {
  try {
    const session = await Session.findOne({ 
      code: req.params.code,
      isLive: true 
    }).populate('presentationId');

    if (!session) {
      return res.status(404).json({ message: 'Session not found or ended' });
    }

    res.json(session);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Change active slide
const changeSlide = async (req, res) => {
  try {
    const { activeSlideIndex } = req.body;

    const session = await Session.findByIdAndUpdate(
      req.params.sessionId,
      { activeSlideIndex },
      { new: true }
    );

    res.json(session);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// End session
const endSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.sessionId,
      { isLive: false },
      { new: true }
    );

    res.json({ message: 'Session ended!', session });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createSession, joinSession, changeSlide, endSession };