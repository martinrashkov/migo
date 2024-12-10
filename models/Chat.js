const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  users: [
    {
      id: {
        type: Schema.Types.ObjectId
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      lastSeen: {
        type: Date,
        default: null
      }
    }
  ],
  admin: {
    id: {
      type: Schema.Types.ObjectId
    },
    name: {
      type: String
    },
    avatar: {
      type: String
    }
  },
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('chat', ChatSchema);
