const Response = require('../models/Response');

// Submit answer (audience)
const submitResponse = async (req, res) => {
  try {
    const { slideId, participantId, answer } = req.body;

    const response = await Response.create({
      sessionId: req.params.sessionId,
      slideId,
      participantId,
      answer
    });

    res.status(201).json(response);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all responses for a slide (presenter)
const getResponses = async (req, res) => {
  try {
    const responses = await Response.find({
      sessionId: req.params.sessionId,
      slideId: req.query.slideId
    });

    res.json(responses);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { submitResponse, getResponses };