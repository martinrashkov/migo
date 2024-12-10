const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimeslotSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    isRequired: true
  },
  positive: {
    type: Boolean,
    isRequired: true,
    default: true
  },
  visible: {
    type: Boolean,
    isRequired: true,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  endDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  startTime: [{
    type: Number,
    isRequired: true
  }],
  duration: {
    type: Number,
    isRequired: true
  },
  day: {
    monday: {
      type: Boolean,
      default: false
    },
    tuesday: {
      type: Boolean,
      default: false
    },
    wednesday: {
      type: Boolean,
      default: false
    },
    thursday: {
      type: Boolean,
      default: false
    },
    friday: {
      type: Boolean,
      default: false
    },
    saturday: {
      type: Boolean,
      default: false
    },
    sunday: {
      type: Boolean,
      default: false
    }
  }
});

module.exports = mongoose.model('timeslot', TimeslotSchema);
