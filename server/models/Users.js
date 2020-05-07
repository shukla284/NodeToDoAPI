const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

//Tokens serve as the value which the users will use for accessing the resources
// Everytime they don't need to send username password to access the resources
// rather they will be permitted or denied for a resource with token only.
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message : '{VALUE} is not a valid email'
    }
  },

  password: {
    type: String,
    required: true,
    minlength: 8
  },

  // this is a mongodb supported syntax for the storage of objects
  tokens: [{
    auth: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]

});

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  // Arrow function don't bind this keyword and here we need them
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id, access}, 'qweerty874398349').toString();

  user.tokens.push({auth: access, token});

  return user.save().then(() => {
     return token;
  });
};

var UserModel = mongoose.model('UserDetails', UserSchema);

module.exports = {UserModel};
