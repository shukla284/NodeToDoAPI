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

UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user)
       return Promise.reject();

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result)
          resolve(user);
        else
          reject();
      });
    });
  });
};

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
      decoded = jwt.verify(token, process.env.JWT_SECRET);
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
  var token = jwt.sign({_id: user._id, auth: 'auth'}, process.env.JWT_SECRET).toString();

  user.tokens.push({auth: 'auth', token});

  return user.save().then(() => {
     return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;
  return user.update({
    $pull: {tokens: {token: token}}
  });
};

var UserModel = mongoose.model('UserDetails', UserSchema);

module.exports = {UserModel};
