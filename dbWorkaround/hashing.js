const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'qwerty1234';

// bcrypt.genSalt(10, (error, salt) => {
//   if (error)
//      return console.log(error);
//   bcrypt.hash(password, salt, (error, result) => {
//     if (error)
//        console.log('Error while generating hash');
//     console.log('Resulting Hash ', result);
//   });
// });

var hashedInput = '$2a$10$XgTUpa01Z87eWq1mOKhL7.Jznz8MJoFWxNEQQ3rW1nL8E.H.EpIem';
bcrypt.compare(password, hashedInput, (error, result) => {
  if (error)
     console.log('Error while comparing passwords');
  console.log(result);
});

// var data = {id :10};
// var token = jwt.sign(data, 'secretkey');
//
// console.log(token);
//
// var decoded = jwt.verify(token, 'secretkey123');
// console.log(decoded);
//
// // creation of the token
// var data = {userId: 10};
// var token = {
//   data,
//   hash: SHA256((JSON.stringify(data) + 'qweerty874398349')).toString()
// };
//
// // creation of new token to be verified
// var alterData = {userId: 10};
// var newHash = SHA256(JSON.stringify(data)).toString();
//
// console.log(newHash);
// console.log(token.hash);
//
// // verification of the token
// if (newHash === token.hash)
//    console.log('Data unchanged');
// else
//    console.log('Data changed');
