const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MEETUP_STATUSES = {
  PENDING: 'Pending',
  APROVED: 'Approved',
  DECLINED: 'Declined'
}

const MeetupSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      required: true
    }
  ],
  name: {
    type: String
  },
  status: {
    type: String,
    enum: Object.values(MEETUP_STATUSES),
    default: MEETUP_STATUSES.PENDING,
    isRequired: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  postUser: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  post: {
    type: Schema.Types.ObjectId
  },
  chat: {
    type: Schema.Types.ObjectId
  },
  text: {
    type: String,
    required: true
  },
  location: {
    longitude: {
      type: String
    },
    latitude: {
      type: String
    }
  },
  sport: {
    type: Schema.Types.ObjectId,
    required: true
  },
  timeslot: {
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('meetup', MeetupSchema);
