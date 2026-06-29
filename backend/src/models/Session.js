const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  presentationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presentation',
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  activeSlideIndex: {
    type: Number,
    default: 0
  },
  isLive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);