const mongoose = require('mongoose');

var UserModel = mongoose.model('UserDetails',{
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

module.exports = {UserModel};
