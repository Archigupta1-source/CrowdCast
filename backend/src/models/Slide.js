const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'wordcloud', 'opentext'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [String],
  settings: {
    timer: { type: Number, default: 60 },
    anonymous: { type: Boolean, default: true },
    showResults: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Slide', slideSchema);