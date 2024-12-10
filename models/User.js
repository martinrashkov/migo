const mongoose = require('mongoose');

const PERMISSIONS = {
  USER: 'User',
  ADMIN: 'Admin'
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  permission: {
    type: String,
    enum: Object.values(PERMISSIONS),
    default: PERMISSIONS.USER
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', UserSchema);
