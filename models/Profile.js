const mongoose = require('mongoose');

const EXPERIENCE_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  EXPERT: 'Expert'
}

const PROFILE_TYPES = {
  USER: 'User',
  TEACHER: 'Teacher',
  ORGANIZATION: 'Organization'
}

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  type:{
    type: String,
    enum: Object.values(PROFILE_TYPES),
    default: PROFILE_TYPES.USER,
    isRequired: true
  },
  location: {
    type: String
  },
  status: {
    type: String
  },
  bio: {
    type: String
  },
  experience: [
    {
      sport: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      expLevel: {
        type: String,
        enum: Object.values(EXPERIENCE_LEVELS),
        default: EXPERIENCE_LEVELS.BEGINNER
      },
      location: {
        type: String
      },
      club: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      main: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('profile', ProfileSchema);
