const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  slideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slide',
    required: true
  },
  participantId: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Response', responseSchema);