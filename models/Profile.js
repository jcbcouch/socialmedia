const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user:{
    type: String,
    required:true
},
  handle: {
    type: String,
    required: true,
    max: 40
  },
  status: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  longitude: {
    type: Number
  },
  latitude: {
    type: Number
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ]

});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
