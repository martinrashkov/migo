const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserToMeetupSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId
  },
  meetup: {
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('usertomeetup', UserToMeetupSchema);
