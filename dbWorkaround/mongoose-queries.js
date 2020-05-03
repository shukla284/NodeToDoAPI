const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongooseConfig.js');
const {ToDoModel} = require('./../server/models/ToDo.js');
const {UserModel} = require('./../server/models/Users.js');

// var id = '5ead78b301114321800f82e11';
// if (!ObjectID.isValid(id))
//     console.log('Not a valid ID');

// ToDoModel.find({_id: id}).then((todo) => console.log('Todo: ', todo));
// ToDoModel.findOne({_id: id}).then((todo) => console.log('ToDo: ', todo));
// ToDoModel.findById(id).then((todo) => {
//   if (!todo)
//      return console.log('Note not found with this ID');
//   console.log('ToDo: ', todo);
// }).catch((e) => console.log(e));


var id = '5eaef8bb3453d8065c492bd2';
UserModel.findById(id).then((doc) => {
  if (!doc)
     return console.log('No matching users found');
  console.log('User Details', doc);
}).catch((e) => console.log(e));
