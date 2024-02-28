const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  monitoredResorts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resort',
  }],
  role: {
    type: String,
    enum: ['user', 'admin'], // Define acceptable roles
    default: 'user', // Default role for new users
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
