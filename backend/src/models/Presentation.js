const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slide'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Presentation', presentationSchema);