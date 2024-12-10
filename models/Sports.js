const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SportsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  popularity: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('sports', SportsSchema);
