const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserToChatSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId
  },
  chat: {
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('usertochat', UserToChatSchema);
