const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.statics.findByToken = function(token) {
   // this points to the overall model
   var User = this;
   var decoded;

   // this will return a promise that will resolve depending upon whether we get the
   // things correctly from the database.
   // If findOne succeeds then it would return the fulfilled promise otherwise that
   // would be rejected at all.
   try{
      // this ensures the validity if it doesn't lies into the catch block
      decoded = jwt.verify(token, 'qweerty874398349');
   }
   catch(e) {
     // here promise reject case is directly called and surely this will be calling
     // in the reject block of the calling point or the catch block of calling point
     return Promise.reject();
   }

   // this is a promise in itself we can handle the resolution and rejection at point of call
   // if this call will succeeds then the resolve case will be callled otherwise
   // the reject case will be called.

   // Here there is no certainity of being resolved or rejected since that depends
   // upon the case of the findOne being successful or not.

   console.log('Decoding successful', decoded._id);
   console.log('User Token fetched ', token);
   return User.findOne({
     '_id' : decoded._id,
     'tokens.token': token,
     'tokens.auth': 'auth'
   });
};

UserSchema.pre('save', function (next) {
   // this will be similar to trigger like thing
   // reference to single inserted record is being made
   var user = this;

   if (user.isModified('password')) {
      bcrypt.genSalt(10, (error, salt) => {
        if (error)
           return console.log('Error while generating salt');
        bcrypt.hash(user.password, salt, (error, result) => {
          user.password = result;
          next();
        });
      });
   }
   else
      next();
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
